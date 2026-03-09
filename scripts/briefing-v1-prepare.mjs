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

function ensureDailySummaryFile(projectRoot, date, category) {
  const dir = path.join(projectRoot, 'src', 'content', 'gunlukOzet');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${date}-${category}.md`);
  if (fs.existsSync(filePath)) return filePath;

  const cap = category.charAt(0).toUpperCase() + category.slice(1);
  const [y, m, d] = date.split('-');
  const title = `${cap} Özeti | ${d}.${m}.${y}`;

  const content = `---\ntitle: "${title}"\ncategory: "${category}"\ndate: ${date}\nsummaryItems:\n  - ""\n  - ""\n  - ""\nsources:\n  - name: ""\n    url: "https://"\n---\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

const args = parseArgs(process.argv.slice(2));
if (args.help || args.h) {
  console.log('Kullanım: npm run briefing:v1 -- [--date YYYY-MM-DD]');
  process.exit(0);
}

const date = args.date || todayISO();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Hata: --date formatı YYYY-MM-DD olmalı.');
  process.exit(1);
}

const projectRoot = process.cwd();
const briefingRoot = path.join(projectRoot, 'briefing');
const dayDir = path.join(briefingRoot, date);
if (!fs.existsSync(dayDir)) fs.mkdirSync(dayDir, { recursive: true });

const sourcesPath = path.join(briefingRoot, 'sources.json');
if (!fs.existsSync(sourcesPath)) {
  console.error(`Hata: Kaynak dosyası bulunamadı -> ${sourcesPath}`);
  process.exit(1);
}

const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

const rawInputPath = path.join(dayDir, 'ham-veri.md');
if (!fs.existsSync(rawInputPath)) {
  const rawTemplate = CATEGORIES.map((category) => {
    const list = (sources[category] || []).map((url) => `- ${url}`).join('\n');
    return `## ${category.toUpperCase()}\n\n### Kaynaklar\n${list || '- (kaynak ekleyin)'}\n\n### Gün içi başlıklar (manuel ekleyin)\n- [Saat] Başlık | Kısa spot | https://...\n- [Saat] Başlık | Kısa spot | https://...\n`;
  }).join('\n\n');

  fs.writeFileSync(rawInputPath, `# Ham Veri - ${date}\n\n${rawTemplate}\n`, 'utf8');
}

const targetFiles = CATEGORIES.map((category) => ({
  category,
  path: ensureDailySummaryFile(projectRoot, date, category),
}));

const promptPath = path.join(dayDir, 'nyx-prompt.md');
const playbookPath = path.join(projectRoot, 'NYX_BRIEFING_PLAYBOOK.md');
const promptText = `# Nyx Günlük Özet Promptu (${date})

Aşağıdaki ham veriyi kullanarak 3 kategori için kısa, tarafsız ve tekrarları birleştiren akşam özeti üret.

## Referans (Önce Oku)
- Nyx playbook: ${playbookPath}

## Kurallar
- Her kategori için tam 10 madde.
- Her madde 2-3 cümlelik doyurucu bir paragraf olsun.
- Spekülatif ifade kullanma, doğrulanmamış bilgiyi dışarıda bırak.
- Aynı olayın tekrar eden başlıklarını mümkünse birleştir ama toplam 10 güçlü madde üret.
- Sonuna Kaynaklar alanını düzgün doldur.

## Girdi
- Ham veri dosyası: ${rawInputPath}

## Çıktı hedef dosyaları
${targetFiles.map((t) => `- ${t.category}: ${t.path}`).join('\n')}

## Uygulama adımı
1) Önce Nyx playbook'u oku ve kuralları uygula.
2) Ham veriyi kategori bazında tara.
3) Her kategori için ilgili markdown dosyasını doldur.
4) summaryItems alanına 10 maddeyi yaz.
5) sources alanına kullanılan kaynakları name + url olarak ekle.
`;

fs.writeFileSync(promptPath, promptText, 'utf8');

console.log('Hazırlandı:');
console.log(`- Ham veri şablonu: ${rawInputPath}`);
console.log(`- Nyx promptu:      ${promptPath}`);
for (const t of targetFiles) console.log(`- ${t.category}: ${t.path}`);
