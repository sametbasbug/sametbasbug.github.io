#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const CATEGORIES = ['ekonomi', 'siyaset', 'teknoloji'];
const RAW_SOURCE_NAME_RE = /^(feeds?|rss|tr)$/i;
const MAX_ITEMS_PER_SOURCE = 3;
const MIN_DISTINCT_SOURCES = 5;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const k = a.slice(2);
    const v = argv[i + 1];
    if (!v || v.startsWith('--')) out[k] = true;
    else {
      out[k] = v;
      i++;
    }
  }
  return out;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readSafe(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
}

function getSummaryItems(markdown) {
  const lines = markdown.split(/\r?\n/);
  const items = [];
  let inSummary = false;

  for (const line of lines) {
    if (/^summaryItems\s*:\s*$/i.test(line.trim())) {
      inSummary = true;
      continue;
    }

    if (inSummary) {
      if (/^\s{2}-\s+/.test(line)) {
        const text = line.replace(/^\s{2}-\s+/, '').trim().replace(/^"|"$/g, '');
        items.push(text);
        continue;
      }
      if (/^[a-zA-Z]/.test(line.trim())) {
        break;
      }
    }
  }

  return items;
}

function getSources(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sources = [];
  let current = null;

  for (const line of lines) {
    const nameMatch = line.match(/^\s*-\s*name\s*:\s*"([^"]*)"\s*$/i);
    if (nameMatch) {
      current = { name: nameMatch[1].trim(), url: '' };
      sources.push(current);
      continue;
    }

    const urlMatch = line.match(/^\s*url\s*:\s*"([^"]+)"\s*$/i);
    if (urlMatch && current) {
      current.url = urlMatch[1].trim();
    }
  }

  return sources;
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname && u.hostname !== '...';
  } catch {
    return false;
  }
}

function extractSiteLabel(source) {
  const name = (source.name || '').trim();
  if (!name) return '';
  const [site] = name.split(' - ');
  return (site || '').trim();
}

function countBy(arr) {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
}

const args = parseArgs(process.argv.slice(2));
if (args.help || args.h) {
  console.log('Kullanım: npm run briefing:v1:validate -- [--date YYYY-MM-DD] [--strict]');
  process.exit(0);
}

const date = args.date || todayISO();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Hata: --date formatı YYYY-MM-DD olmalı.');
  process.exit(1);
}

const strict = Boolean(args.strict);
const root = process.cwd();
let hasError = false;

console.log(`Validasyon tarihi: ${date}`);

for (const category of CATEGORIES) {
  const filePath = path.join(root, 'src', 'content', 'gunlukOzet', `${date}-${category}.md`);
  const content = readSafe(filePath);

  if (!content) {
    hasError = true;
    console.log(`\n[HATA] ${category}: dosya yok -> ${filePath}`);
    continue;
  }

  const items = getSummaryItems(content).filter((x) => x && x !== '');
  const sources = getSources(content);
  const urls = sources.map((s) => s.url).filter(Boolean);
  const siteLabels = sources.map(extractSiteLabel).filter(Boolean);
  const distinctSiteLabels = [...new Set(siteLabels)];

  const errors = [];
  const warns = [];

  if (items.length < 10) errors.push(`summaryItems sayısı düşük (${items.length}) · min: 10`);
  if (items.length > 10) warns.push(`summaryItems sayısı yüksek (${items.length}) · öneri max: 10`);

  const shortItems = items.filter((i) => i.length < 20);
  if (shortItems.length > 0) warns.push(`${shortItems.length} madde çok kısa görünüyor (<20 karakter)`);

  if (urls.length < 1) errors.push('en az 1 source url gerekli');

  const invalidUrls = urls.filter((u) => !isValidHttpUrl(u));
  if (invalidUrls.length > 0) errors.push(`geçersiz source url sayısı: ${invalidUrls.length}`);

  if (/\[Saat\]\s*Başlık/i.test(content) || /https:\/\/\.\.\./i.test(content)) {
    errors.push('placeholder metin kalmış ([Saat] veya https://...)');
  }

  if (sources.some((s) => !s.name || !s.url)) {
    errors.push('name/url çifti eksik source kaydı var');
  }

  const malformedNames = sources.filter((s) => !s.name.includes(' - '));
  if (malformedNames.length > 0) {
    errors.push(`source adı formatı bozuk (${malformedNames.length}) · beklenen: Site Adı - Haber adı`);
  }

  const rawNames = siteLabels.filter((name) => RAW_SOURCE_NAME_RE.test(name));
  if (rawNames.length > 0) {
    errors.push(`ham/bozuk source adı var: ${[...new Set(rawNames)].join(', ')}`);
  }

  const sourceUsage = countBy(siteLabels);
  const overusedSources = [...sourceUsage.entries()].filter(([, count]) => count > MAX_ITEMS_PER_SOURCE);
  if (overusedSources.length > 0) {
    errors.push(`aynı kaynak aşırı kullanılmış: ${overusedSources.map(([name, count]) => `${name} (${count})`).join(', ')} · max ${MAX_ITEMS_PER_SOURCE}`);
  }

  if (distinctSiteLabels.length < MIN_DISTINCT_SOURCES) {
    const msg = `farklı kaynak sayısı düşük (${distinctSiteLabels.length}) · min: ${MIN_DISTINCT_SOURCES}`;
    if (strict) errors.push(msg);
    else warns.push(msg);
  }

  console.log(`\n[${category.toUpperCase()}] ${path.basename(filePath)}`);
  if (errors.length === 0 && warns.length === 0) {
    console.log('  ✅ Temiz');
  } else {
    for (const e of errors) console.log(`  ❌ ${e}`);
    for (const w of warns) console.log(`  ⚠️  ${w}`);
  }

  if (errors.length > 0) hasError = true;
  if (strict && warns.length > 0) hasError = true;
}

if (hasError) {
  console.log('\nSonuç: BAŞARISIZ (yayın öncesi düzeltme gerekli)');
  process.exit(1);
}

console.log('\nSonuç: BAŞARILI (yayın kontrolü geçti)');
