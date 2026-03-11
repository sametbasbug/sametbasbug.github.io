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
      if (/^[a-zA-Z]/.test(line.trim())) break;
    }
  }

  return items;
}

function getSourceUrls(markdown) {
  const urls = [];
  for (const line of markdown.split(/\r?\n/)) {
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
const date = args.date || todayISO();
const strict = Boolean(args.strict);

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Hata: --date formatı YYYY-MM-DD olmalı.');
  process.exit(1);
}

const root = process.cwd();
const reportDir = path.join(root, 'briefing', date);
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, 'validate-report.md');

let hasError = false;
const rows = [];

for (const category of CATEGORIES) {
  const filePath = path.join(root, 'src', 'content', 'gunlukOzet', `${date}-${category}.md`);
  const content = readSafe(filePath);

  const errors = [];
  const warns = [];

  if (!content) {
    errors.push('Dosya yok');
    rows.push({ category, filePath, errors, warns, itemCount: 0, sourceCount: 0 });
    hasError = true;
    continue;
  }

  const items = getSummaryItems(content).filter(Boolean);
  const urls = getSourceUrls(content);

  if (items.length < 10) errors.push(`summaryItems sayısı düşük (${items.length}) · min: 10`);
  if (items.length > 10) warns.push(`summaryItems sayısı yüksek (${items.length}) · öneri max: 10`);
  if (items.filter((x) => x.length < 20).length > 0) warns.push('Kısa madde(ler) var (<20 karakter)');
  if (urls.length < 1) errors.push('Kaynak URL yok');
  if (urls.some((u) => !isValidHttpUrl(u))) errors.push('Geçersiz kaynak URL var');
  if (/\[Saat\]\s*Başlık/i.test(content) || /https:\/\/\.\.\./i.test(content)) errors.push('Placeholder metin kalmış');

  if (errors.length > 0) hasError = true;
  if (strict && warns.length > 0) hasError = true;

  rows.push({ category, filePath, errors, warns, itemCount: items.length, sourceCount: urls.length });
}

const body = [
  `# Validate Report (${date})`,
  '',
  `- strict mode: ${strict ? 'ON' : 'OFF'}`,
  `- result: ${hasError ? 'FAIL' : 'PASS'}`,
  '',
  '| Kategori | Items | Sources | Errors | Warnings |',
  '|---|---:|---:|---|---|',
  ...rows.map((r) => `| ${r.category} | ${r.itemCount} | ${r.sourceCount} | ${r.errors.join('<br>') || '—'} | ${r.warns.join('<br>') || '—'} |`),
  '',
  '## Dosyalar',
  ...rows.map((r) => `- ${r.category}: \`${r.filePath}\``),
  ''
].join('\n');

fs.writeFileSync(reportPath, body, 'utf8');
console.log(`Rapor yazıldı: ${reportPath}`);

if (hasError) process.exit(1);
