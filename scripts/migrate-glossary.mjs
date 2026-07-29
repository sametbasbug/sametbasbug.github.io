#!/usr/bin/env node
/**
 * Eski sitedeki sözlük maddelerini src/content/glossary/ altına taşır.
 *
 *   node scripts/migrate-glossary.mjs           # hepsi
 *   node scripts/migrate-glossary.mjs --dry     # yazmadan göster
 *   node scripts/migrate-glossary.mjs api cron  # sadece bu slug'lar
 *
 * Kaynak sayfanın yapısı (eski Astro şablonu):
 *   .entry-category            → category
 *   h1                         → term
 *   .entry-lead                → lead
 *   .utility-card-summary strong → summary
 *   .utility-card-example      → gövdeye "Mini örnek" bloğu
 *   .prose                     → gövde
 *   .related-card[href]        → related
 *
 * Var olan dosyanın üzerine yazmaz; --force ile zorlanır.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src", "content", "glossary");
const listPath = path.join(root, "legacy", "eski-sitemap-2026-07.txt");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
});

// Eski sitedeki mutlak bağlantıları göreli tut
turndown.addRule("localLinks", {
  filter: (node) => node.nodeName === "A" && /^https:\/\/sametbasbug\.dev\//.test(node.getAttribute("href") ?? ""),
  replacement: (content, node) =>
    `[${content}](${node.getAttribute("href").replace("https://sametbasbug.dev", "")})`,
});

const slugsFromSitemap = async () => {
  const text = await readFile(listPath, "utf8");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^https:\/\/sametbasbug\.dev\/sozluk\/.+\/$/.test(line))
    .map((line) => new URL(line).pathname.replace(/^\/sozluk\/|\/$/g, ""))
    .filter(Boolean);
};

const yaml = (value) => `"${String(value).replace(/"/g, '\\"').trim()}"`;

const clean = (text) => (text ?? "").replace(/\s+/g, " ").trim();

async function migrate(slug) {
  const url = `https://sametbasbug.dev/sozluk/${slug}/`;
  const response = await fetch(url);
  if (!response.ok) return { slug, status: `HTTP ${response.status}` };

  const doc = parse(await response.text());
  const article = doc.querySelector("article.entry-article");
  if (!article) return { slug, status: "article bulunamadı" };

  const term = clean(article.querySelector("h1")?.text);
  const category = clean(article.querySelector(".entry-category")?.text);
  const lead = clean(article.querySelector(".entry-lead")?.text);
  const summary = clean(article.querySelector(".utility-card-summary strong")?.text) || lead;

  if (!term) return { slug, status: "başlık yok" };

  const related = [
    ...new Set(
      article
        .querySelectorAll(".related-card")
        .map((card) => card.getAttribute("href") ?? "")
        .map((href) => href.replace(/^\/sozluk\/|\/$/g, ""))
        .filter(Boolean),
    ),
  ];

  const parts = [];

  if (lead && lead !== summary) parts.push(lead);

  const example = article.querySelector(".utility-card-example");
  if (example) {
    const title = clean(example.querySelector("strong")?.text);
    const text = clean(example.querySelector("p")?.text);
    if (text) parts.push(`> **${title || "Mini örnek"}** — ${text}`);
  }

  const prose = article.querySelector(".prose");
  if (prose) {
    let body = turndown.turndown(prose.innerHTML).trim();

    // "İlgili başlıklar" bölümü frontmatter'a taşındı; gövdede tekrarlamasın.
    body = body.replace(/\n#{2,3}\s*İlgili başlıklar[\s\S]*$/i, "").trim();

    // Turndown listeleri "-   madde" diye giriyor; tek boşluğa indiriyoruz.
    body = body.replace(/^(\s*)-\s{2,}/gm, "$1- ");

    parts.push(body);
  }

  const frontmatter = [
    "---",
    `term: ${yaml(term)}`,
    `summary: ${yaml(summary)}`,
    `category: ${yaml(category || "Genel")}`,
    related.length ? `related: [${related.map((r) => yaml(r)).join(", ")}]` : "related: []",
    "---",
    "",
  ].join("\n");

  const file = path.join(outDir, `${slug}.md`);
  if (existsSync(file) && !force) return { slug, status: "atlandı (dosya var)" };

  const content = `${frontmatter}\n${parts.join("\n\n")}\n`;
  if (!dryRun) await writeFile(file, content, "utf8");

  return { slug, status: dryRun ? "kuru çalıştırma" : "yazıldı", term, category, related: related.length };
}

await mkdir(outDir, { recursive: true });

const slugs = only.length ? only : await slugsFromSitemap();
console.log(`${slugs.length} madde taşınacak${dryRun ? " (kuru çalıştırma)" : ""}\n`);

const results = [];
for (const slug of slugs) {
  const result = await migrate(slug).catch((error) => ({ slug, status: `hata: ${error.message}` }));
  results.push(result);
  const mark = /yazıldı|kuru/.test(result.status) ? "·" : "!";
  console.log(`  ${mark} ${slug.padEnd(28)} ${result.status}${result.category ? ` — ${result.category}` : ""}`);
}

const failed = results.filter((r) => !/yazıldı|kuru|atlandı/.test(r.status));
console.log(`\nbaşarılı: ${results.length - failed.length}   sorunlu: ${failed.length}`);
process.exit(failed.length ? 1 : 0);
