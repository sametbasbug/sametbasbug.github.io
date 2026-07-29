#!/usr/bin/env node
/**
 * Eski sitedeki yasal ve iletişim sayfalarını src/content/pages/ altına taşır.
 *
 *   node scripts/migrate-pages.mjs [--dry] [--force] [slug…]
 *
 * DİKKAT: bu metinler eski sitenin özelliklerini (Google ile giriş, yorumlar,
 * beğeniler, Firestore) anlatıyor. Yeni site tamamen statik ve bunların hiçbiri
 * yok. Taşınan metin bir başlangıç noktasıdır, olduğu gibi yayınlanamaz.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src", "content", "pages");

const SLUGS = [
  "gizlilik-politikasi",
  "cerez-politikasi",
  "kullanim-sartlari",
  "topluluk-kurallari",
  "iletisim",
];

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

turndown.addRule("localLinks", {
  filter: (node) =>
    node.nodeName === "A" && /^https:\/\/sametbasbug\.dev\//.test(node.getAttribute("href") ?? ""),
  replacement: (content, node) =>
    `[${content}](${node.getAttribute("href").replace("https://sametbasbug.dev", "")})`,
});

const clean = (text) => (text ?? "").replace(/\s+/g, " ").trim();
const yaml = (value) => `"${String(value).replace(/"/g, '\\"').trim()}"`;

async function migrate(slug) {
  const response = await fetch(`https://sametbasbug.dev/${slug}/`);
  if (!response.ok) return { slug, status: `HTTP ${response.status}` };

  const doc = parse(await response.text());

  // Sol/sağ raylar gezinme; asıl içerik başlık + gövde bloklarında.
  const header = doc.querySelector(".legal-header");
  const body = doc.querySelector(".legal-body") ?? doc.querySelector(".center-feed");
  if (!body) return { slug, status: "içerik bulunamadı" };

  const title =
    clean(header?.querySelector("h1, h2")?.text) ||
    clean(body.querySelector("h1, h2")?.text) ||
    slug;

  // "Son güncelleme: 11.03.2026" gibi bir satır varsa yakala
  const headerText = clean(header?.text ?? "");
  const updated = headerText.match(/son güncelleme[:\s]*([\d./-]+)/i)?.[1] ?? null;

  const lead = clean(header?.querySelector("p:not(.legal-meta)")?.text ?? "");

  let markdown = turndown.turndown(body.innerHTML).trim();
  // Gövdede başlık tekrar ediyorsa at; sayfa şablonu zaten basıyor.
  markdown = markdown.replace(new RegExp(`^#{1,3}\\s*${title}\\s*\\n+`, "i"), "").trim();
  markdown = markdown.replace(/^(\s*)-\s{2,}/gm, "$1- ");

  const frontmatter = [
    "---",
    `title: ${yaml(title)}`,
    lead && lead !== title ? `lead: ${yaml(lead)}` : null,
    updated ? `legacyUpdated: ${yaml(updated)}` : null,
    "# Eski siteden taşındı; içerik yeni siteye göre gözden geçirilmeli.",
    "needsReview: true",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const file = path.join(outDir, `${slug}.md`);
  if (existsSync(file) && !force) return { slug, status: "atlandı (dosya var)" };

  if (!dryRun) await writeFile(file, `${frontmatter}\n${markdown}\n`, "utf8");
  return { slug, status: dryRun ? "kuru çalıştırma" : "yazıldı", title, chars: markdown.length };
}

await mkdir(outDir, { recursive: true });

const slugs = only.length ? only : SLUGS;
console.log(`${slugs.length} sayfa taşınacak${dryRun ? " (kuru çalıştırma)" : ""}\n`);

let failed = 0;
for (const slug of slugs) {
  const result = await migrate(slug).catch((error) => ({ slug, status: `hata: ${error.message}` }));
  const ok = /yazıldı|kuru|atlandı/.test(result.status);
  if (!ok) failed++;
  console.log(
    `  ${ok ? "·" : "!"} ${slug.padEnd(22)} ${result.status}` +
      `${result.title ? ` — ${result.title} (${result.chars} karakter)` : ""}`,
  );
}

console.log(
  `\nHatırlatma: bu metinler eski sitenin giriş/yorum/beğeni özelliklerini anlatıyor.` +
    `\nYeni site statik — yayına almadan önce her birini gözden geçir.\n`,
);
process.exit(failed ? 1 : 0);
