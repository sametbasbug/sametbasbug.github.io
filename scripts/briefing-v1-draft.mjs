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

function readFileSafe(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
}

function parseRawByCategory(markdown) {
  const result = {
    ekonomi: [],
    siyaset: [],
    teknoloji: [],
  };

  let current = null;
  const lines = markdown.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^##\s+EKONOMI$/i.test(line) || /^##\s+EKONOMİ$/i.test(line)) {
      current = 'ekonomi';
      continue;
    }
    if (/^##\s+SIYASET$/i.test(line) || /^##\s+SİYASET$/i.test(line)) {
      current = 'siyaset';
      continue;
    }
    if (/^##\s+TEKNOLOJI$/i.test(line) || /^##\s+TEKNOLOJİ$/i.test(line)) {
      current = 'teknoloji';
      continue;
    }

    if (!current) continue;

    // Only capture bullet lines under category sections
    if (line.startsWith('- ')) {
      result[current].push(line.slice(2).trim());
    }
  }

  return result;
}

function inferSourceName(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const root = host.split('.')[0] || host;
    return root.charAt(0).toUpperCase() + root.slice(1);
  } catch {
    return 'Kaynak';
  }
}

function pickTopItems(lines, max = 5) {
  const filtered = lines
    .filter((l) => l && !l.includes('[Saat] Başlık | Kısa spot | https://...'))
    .filter((l) => !/^https?:\/\//i.test(l.trim()))
    .slice(0, max);

  return filtered.map((line) => {
    const parts = line.split('|').map((p) => p.trim()).filter(Boolean);
    const maybeTitle = parts[0] || line;
    const maybeSpot = parts[1] || '';

    // Clean optional [Saat]
    const cleanTitle = maybeTitle.replace(/^\[[^\]]+\]\s*/, '').trim();

    if (maybeSpot) return `${cleanTitle}: ${maybeSpot}`;
    return cleanTitle;
  });
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return (u.protocol === 'http:' || u.protocol === 'https:') && Boolean(u.hostname) && u.hostname !== '...';
  } catch {
    return false;
  }
}

function pickSources(lines, max = 5) {
  const sources = [];
  const seen = new Set();

  for (const line of lines) {
    const urlMatch = line.match(/https?:\/\/\S+/i);
    if (!urlMatch) continue;
    const url = urlMatch[0].replace(/[),.;]+$/, '');
    if (!isValidHttpUrl(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    sources.push({ name: inferSourceName(url), url });
    if (sources.length >= max) break;
  }

  return sources;
}

function renderSummaryMarkdown({ title, category, date, summaryItems, sources }) {
  const safeItems = summaryItems.length ? summaryItems : ['Henüz özet maddesi girilmedi.'];
  const safeSources = sources.length ? sources : [{ name: 'Kaynak', url: 'https://example.com' }];

  return `---\ntitle: "${title}"\ncategory: "${category}"\ndate: ${date}\nsummaryItems:\n${safeItems.map((i) => `  - "${i.replace(/"/g, "'")}"`).join('\n')}\nsources:\n${safeSources.map((s) => `  - name: "${s.name.replace(/"/g, "'")}"\n    url: "${s.url}"`).join('\n')}\n---\n`;
}

const args = parseArgs(process.argv.slice(2));
if (args.help || args.h) {
  console.log('Kullanım: npm run briefing:v1:draft -- [--date YYYY-MM-DD]');
  process.exit(0);
}

const date = args.date || todayISO();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Hata: --date formatı YYYY-MM-DD olmalı.');
  process.exit(1);
}

const root = process.cwd();
const rawPath = path.join(root, 'briefing', date, 'ham-veri.md');
if (!fs.existsSync(rawPath)) {
  console.error(`Hata: Ham veri dosyası bulunamadı -> ${rawPath}`);
  console.error('Önce: npm run briefing:v1 -- --date ' + date);
  process.exit(1);
}

const raw = readFileSafe(rawPath);
const parsed = parseRawByCategory(raw);

for (const category of CATEGORIES) {
  const lines = parsed[category] || [];
  const summaryItems = pickTopItems(lines, 5);
  const sources = pickSources(lines, 5);

  const cap = category.charAt(0).toUpperCase() + category.slice(1);
  const [y, m, d] = date.split('-');
  const title = `${cap} Özeti | ${d}.${m}.${y}`;

  const targetPath = path.join(root, 'src', 'content', 'gunlukOzet', `${date}-${category}.md`);
  const output = renderSummaryMarkdown({
    title,
    category,
    date,
    summaryItems,
    sources,
  });

  fs.writeFileSync(targetPath, output, 'utf8');
  console.log(`Taslak yazıldı: ${targetPath}`);
}

console.log('Tamamlandı. Şimdi Nyx bu taslakları rötuşlayabilir.');
