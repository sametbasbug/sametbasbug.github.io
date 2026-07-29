#!/usr/bin/env node
/**
 * Eski sitedeki blog yazılarını src/content/posts/ altına taşır.
 *
 *   node scripts/migrate-posts.mjs [--dry] [--force] [slug…]
 *
 * Slug listesi src/redirects.ts içindeki postSlugs'tan geliyor — yani
 * yönlendirme haritasıyla aynı kaynağı kullanıyor, ikisi ayrışamaz.
 *
 * Kaynak sayfanın yapısı:
 *   JSON-LD Article  → headline, description, datePublished, author
 *   .post-tags a     → tags
 *   .prose           → gövde
 *
 * Kapak görselleri taşınmıyor: yeni sitede her yazının kapağı başlığından
 * türetilen sigil.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import { postSlugs } from "../src/redirects.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src", "content", "posts");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

/** Eski yazar adları → yeni yazar kimlikleri. */
const AUTHORS = {
  "samet başbuğ": "samet",
  "nyx ai": "nyx",
  "nyx": "nyx",
  "hemera ai": "hemera",
  "hemera": "hemera",
  "selene ai": "selene",
  "selene": "selene",
  "asteria ai": "asteria",
  "asteria": "asteria",
};

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

/** Etiketler URL'e giriyor: Türkçe harfleri sadeleştir. */
const slugifyTag = (tag) =>
  tag
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function migrate(slug) {
  const response = await fetch(`https://sametbasbug.dev/blog/${slug}/`);
  if (!response.ok) return { slug, status: `HTTP ${response.status}` };

  const html = await response.text();
  const doc = parse(html);

  // JSON-LD en güvenilir kaynak: başlık, özet, tarih ve yazar orada.
  let article = null;
  for (const match of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      const parsed = JSON.parse(match[1]);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      article = entries.find((entry) => entry["@type"] === "Article") ?? article;
    } catch {
      // bozuk ld+json bloklarını atla
    }
  }

  const header = doc.querySelector(".post-header");
  const title = clean(article?.headline) || clean(header?.querySelector("h1")?.text);
  if (!title) return { slug, status: "başlık bulunamadı" };

  const summary =
    clean(article?.description) || clean(header?.querySelector(".post-lead")?.text) || title;

  const isoDate = article?.datePublished ?? header?.querySelector("time")?.getAttribute("datetime");
  const date = isoDate ? new Date(isoDate).toISOString().slice(0, 10) : null;
  if (!date) return { slug, status: "tarih bulunamadı" };

  const rawAuthor = clean(article?.author?.name ?? header?.querySelector(".author a")?.text);
  // Türkçe locale ile küçültme "AI"yı "aı" yapıyor; burada istediğimiz o değil.
  const author = AUTHORS[rawAuthor.toLowerCase()];
  if (!author) return { slug, status: `tanınmayan yazar: ${rawAuthor || "(boş)"}` };

  const tags = [
    ...new Set(
      (header?.querySelectorAll(".post-tags a") ?? [])
        .map((a) => slugifyTag(clean(a.text).replace(/^#/, "")))
        .filter(Boolean),
    ),
  ];

  const prose = doc.querySelector(".prose");
  if (!prose) return { slug, status: "gövde bulunamadı" };

  let body = turndown.turndown(prose.innerHTML).trim();
  body = body.replace(/^(\s*)-\s{2,}/gm, "$1- ");
  // Eski şablondan kalan "Bu yazıyı paylaş" benzeri kuyrukları at
  body = body.replace(/\n#{2,3}\s*(Bu yazıyı paylaş|Paylaş)[\s\S]*$/i, "").trim();

  const frontmatter = [
    "---",
    `title: ${yaml(title)}`,
    `summary: ${yaml(summary)}`,
    `date: ${date}`,
    `author: ${author}`,
    `tags: [${tags.map((t) => yaml(t)).join(", ")}]`,
    "---",
    "",
  ].join("\n");

  const file = path.join(outDir, `${slug}.md`);
  if (existsSync(file) && !force) return { slug, status: "atlandı (dosya var)" };

  if (!dryRun) await writeFile(file, `${frontmatter}\n${body}\n`, "utf8");
  return { slug, status: dryRun ? "kuru çalıştırma" : "yazıldı", author, date, tags, chars: body.length };
}

await mkdir(outDir, { recursive: true });

const slugs = only.length ? only : [...postSlugs];
console.log(`${slugs.length} yazı taşınacak${dryRun ? " (kuru çalıştırma)" : ""}\n`);

let failed = 0;
const allTags = new Set();

for (const slug of slugs) {
  const result = await migrate(slug).catch((error) => ({ slug, status: `hata: ${error.message}` }));
  const ok = /yazıldı|kuru|atlandı/.test(result.status);
  if (!ok) failed++;
  result.tags?.forEach((t) => allTags.add(t));

  console.log(
    `  ${ok ? "·" : "!"} ${slug.slice(0, 46).padEnd(48)} ${result.status}` +
      `${result.author ? ` — ${result.author}, ${result.date}, ${result.chars} karakter` : ""}`,
  );
}

if (allTags.size) console.log(`\netiketler: ${[...allTags].sort().join(", ")}`);
console.log(`\nsorunlu: ${failed}\n`);
process.exit(failed ? 1 : 0);
