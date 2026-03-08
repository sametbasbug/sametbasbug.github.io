#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const VALID_CATEGORIES = ['ekonomi', 'siyaset', 'teknoloji'];

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
    } else {
      result[key] = next;
      i++;
    }
  }
  return result;
}

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function humanTitle(category, dateIso) {
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  const [y, m, d] = dateIso.split('-');
  return `${label} Özeti | ${d}.${m}.${y}`;
}

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  console.log(`Kullanım:\n  npm run ozet:new -- --category <ekonomi|siyaset|teknoloji> [--date YYYY-MM-DD] [--title "Başlık"]\n\nÖrnek:\n  npm run ozet:new -- --category ekonomi\n  npm run ozet:new -- --category teknoloji --date 2026-03-09`);
  process.exit(0);
}

const category = args.category;
if (!category || !VALID_CATEGORIES.includes(category)) {
  console.error(`Hata: --category zorunlu. Geçerli değerler: ${VALID_CATEGORIES.join(', ')}`);
  process.exit(1);
}

const date = args.date || getTodayISO();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Hata: --date formatı YYYY-MM-DD olmalı.');
  process.exit(1);
}

const title = args.title || humanTitle(category, date);

const targetDir = path.resolve(process.cwd(), 'src/content/gunlukOzet');
const fileName = `${date}-${category}.md`;
const filePath = path.join(targetDir, fileName);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error(`Hata: Dosya zaten var -> ${filePath}`);
  process.exit(1);
}

const content = `---
title: "${title}"
category: "${category}"
date: ${date}
summaryItems:
  - ""
  - ""
  - ""
sources:
  - name: ""
    url: "https://"
---
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Oluşturuldu: ${filePath}`);
