#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const CATEGORIES = ['ekonomi', 'siyaset', 'teknoloji'];

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

function getSourceUrls(markdown) {
  const lines = markdown.split(/\r?\n/);
  const urls = [];

  for (const line of lines) {
    const m = line.match(/^\s*url\s*:\s*"([^"]+)"\s*$/i);
    if (m) urls.push(m[1]);
  }

  return urls;
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname && u.hostname !== '...';
  } catch {
    return false;
  }
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
  const urls = getSourceUrls(content);

  const errors = [];
  const warns = [];

  if (items.length < 3) errors.push(`summaryItems sayısı düşük (${items.length}) · min: 3`);
  if (items.length > 5) warns.push(`summaryItems sayısı yüksek (${items.length}) · öneri max: 5`);

  const shortItems = items.filter((i) => i.length < 20);
  if (shortItems.length > 0) warns.push(`${shortItems.length} madde çok kısa görünüyor (<20 karakter)`);

  if (urls.length < 1) errors.push('en az 1 source url gerekli');

  const invalidUrls = urls.filter((u) => !isValidHttpUrl(u));
  if (invalidUrls.length > 0) errors.push(`geçersiz source url sayısı: ${invalidUrls.length}`);

  if (/\[Saat\]\s*Başlık/i.test(content) || /https:\/\/\.\.\./i.test(content)) {
    errors.push('placeholder metin kalmış ([Saat] veya https://...)');
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
