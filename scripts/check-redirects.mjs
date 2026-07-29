#!/usr/bin/env node
/**
 * Eski sitedeki her URL'in yeni sitede bir karşılığı var mı?
 *
 * legacy/eski-sitemap-2026-07.txt içindeki her adresi dist/ çıktısında arar.
 * Üç sonuç var:
 *   • yönlendirme — o yolda Astro'nun ürettiği redirect sayfası duruyor
 *   • sayfa       — yol birebir korunmuş, gerçek içerik orada
 *   • EKSİK       — o adrese giden kimse 404 alacak
 *
 * `npm run build` sonrası çalıştır. Eksik varsa çıkış kodu 1.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

if (!existsSync(dist)) {
  console.error("dist/ yok — önce `npm run build` çalıştır.");
  process.exit(1);
}

const { redirects, intentionallyUnmapped } = await import("../src/redirects.ts").catch(
  async () => {
    // Node .ts okuyamazsa kaba ayrıştırma yerine net hata ver.
    console.error(
      "src/redirects.ts okunamadı. Node 22.6+ ile `node --experimental-strip-types` gerekebilir.",
    );
    process.exit(1);
  },
);

const listPath = path.join(root, "legacy", "eski-sitemap-2026-07.txt");
const urls = (await readFile(listPath, "utf8"))
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("https://"));

/** Bir yolun dist içindeki dosya karşılığı. */
const fileFor = (pathname) => {
  const clean = pathname.replace(/^\/|\/$/g, "");
  return clean ? path.join(dist, clean, "index.html") : path.join(dist, "index.html");
};

const results = { redirect: [], page: [], skipped: [], missing: [], broken: [] };

for (const url of urls) {
  const { pathname } = new URL(url);

  if (intentionallyUnmapped.includes(pathname)) {
    results.skipped.push(pathname);
    continue;
  }

  const file = fileFor(pathname);

  if (!existsSync(file)) {
    results.missing.push({ pathname, expected: redirects[pathname] ?? null });
    continue;
  }

  const html = await readFile(file, "utf8");
  if (html.includes('http-equiv="refresh"')) {
    const target = html.match(/content="0;url=([^"]+)"/)?.[1] ?? "?";
    // Yönlendirmenin varlığı yetmez: hedefin de gerçekten var olması gerek,
    // yoksa ziyaretçi bir zıplama sonrası 404'e düşer.
    const targetExists =
      target.endsWith(".xml") || target.endsWith(".png")
        ? existsSync(path.join(dist, target.replace(/^\//, "")))
        : existsSync(fileFor(target));

    if (targetExists) results.redirect.push({ pathname, target });
    else results.broken.push({ pathname, target });
  } else {
    results.page.push(pathname);
  }
}

const line = "─".repeat(64);
console.log(`\n${line}\nEski → yeni URL kontrolü · ${urls.length} adres\n${line}`);
console.log(`  yönlendirme : ${results.redirect.length}`);
console.log(`  korunan yol : ${results.page.length}`);
console.log(`  atlanan     : ${results.skipped.length}`);
console.log(`  EKSİK       : ${results.missing.length}`);
console.log(`  KOPUK hedef : ${results.broken.length}`);

if (results.broken.length) {
  console.log(`\n${line}\nKOPUK — yönlendirme var ama hedef sayfa yok\n${line}`);
  for (const item of results.broken) {
    console.log(`  ${item.pathname}  →  ${item.target}`);
  }
}

if (results.missing.length) {
  console.log(`\n${line}\nEKSİK — bu adresler 404 verecek\n${line}`);

  const groups = new Map();
  for (const item of results.missing) {
    const key = item.pathname.split("/")[1] || "(kök)";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  for (const [group, items] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  /${group}/ — ${items.length} adres`);
    for (const item of items.slice(0, 5)) {
      const note = item.expected ? `→ ${item.expected} (hedef sayfa yok)` : "(haritada yok)";
      console.log(`    ${item.pathname}  ${note}`);
    }
    if (items.length > 5) console.log(`    … ve ${items.length - 5} tane daha`);
  }
}

console.log("");
process.exit(results.missing.length + results.broken.length ? 1 : 0);
