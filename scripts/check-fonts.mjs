/**
 * Budanmış fontlarda eksik glif kaldı mı?
 *
 * `make-fonts.mjs` karakter kümesini `src/` taramasından çıkarıyor. Bir
 * karakter taramaya girmez ama sayfada render edilirse tarayıcı yedek
 * yazı tipine düşmez — @font-face'in `unicode-range`'i eşleştiği için
 * o fontu kullanmayı sürdürür ve boş kutu (tofu) çizer. Sessiz bozulma.
 *
 * Bu betik `dist/` içindeki gerçek çıktıyı okur ve render edilen her
 * karakterin üretilmiş fontlarda karşılığı olduğunu doğrular. Aralığın
 * tamamen dışında kalanlar (emoji, ⌘) kapsam dışı: onlar budamadan önce
 * de sistem fontundan geliyordu.
 *
 *   npm run build && npm run check:fonts
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { decompress } from "wawoff2";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const FONTS = path.join(ROOT, "src", "fonts");
const CSS = path.join(ROOT, "src", "styles", "fonts.css");

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Etiketleri ve script/style gövdelerini atıp görünen metni bırakır. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Fontun cmap'indeki kod noktaları (format 4 ve 12). */
function cmapCodes(ttf) {
  const tables = ttf.readUInt16BE(4);
  let off = 12;
  let cmap = null;
  for (let i = 0; i < tables; i++) {
    if (ttf.toString("ascii", off, off + 4) === "cmap") cmap = ttf.readUInt32BE(off + 8);
    off += 16;
  }
  if (cmap === null) throw new Error("cmap tablosu yok");

  const codes = new Set();
  const subtables = ttf.readUInt16BE(cmap + 2);
  for (let i = 0; i < subtables; i++) {
    const sub = cmap + ttf.readUInt32BE(cmap + 4 + i * 8 + 4);
    const format = ttf.readUInt16BE(sub);
    if (format === 4) {
      const segX2 = ttf.readUInt16BE(sub + 6);
      const endOffset = sub + 14;
      const startOffset = endOffset + segX2 + 2;
      for (let s = 0; s < segX2 / 2; s++) {
        const end = ttf.readUInt16BE(endOffset + s * 2);
        const start = ttf.readUInt16BE(startOffset + s * 2);
        if (start === 0xffff) continue;
        for (let c = start; c <= end; c++) codes.add(c);
      }
    } else if (format === 12) {
      const groups = ttf.readUInt32BE(sub + 12);
      for (let g = 0; g < groups; g++) {
        const o = sub + 16 + g * 12;
        const end = ttf.readUInt32BE(o + 4);
        for (let c = ttf.readUInt32BE(o); c <= end; c++) codes.add(c);
      }
    }
  }
  return codes;
}

const rendered = new Set();
for (const file of await walk(DIST)) {
  for (const ch of visibleText(await readFile(file, "utf8"))) rendered.add(ch);
}

const covered = new Set();
for (const file of await readdir(FONTS)) {
  const ttf = Buffer.from(await decompress(await readFile(path.join(FONTS, file))));
  for (const code of cmapCodes(ttf)) covered.add(code);
}

const ranges = [...(await readFile(CSS, "utf8")).matchAll(/unicode-range:\s*([^;]+);/g)]
  .flatMap(([, spec]) =>
    spec.split(",").map((part) => {
      const [from, to] = part.trim().replace(/^u\+/i, "").split("-");
      const lo = parseInt(from, 16);
      return [lo, to === undefined ? lo : parseInt(to, 16)];
    }),
  );

const missing = [...rendered].filter((ch) => {
  const code = ch.codePointAt(0);
  if (code <= 31 || code === 0x7f || code === 0xfeff) return false;
  const claimed = ranges.some(([lo, hi]) => code >= lo && code <= hi);
  return claimed && !covered.has(code);
});

console.log("Budanmış font kapsamı");
console.log("────────────────────────────────────────────────────────────────");
console.log(`  render edilen karakter : ${rendered.size}`);
console.log(`  fontlardaki kod noktası: ${covered.size}`);
console.log(`  EKSİK                  : ${missing.length}`);

if (missing.length) {
  const list = missing
    .map((ch) => `${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`)
    .join(", ");
  console.error(`\nBu karakterler tofu olarak çizilecek: ${list}`);
  console.error("scripts/make-fonts.mjs içindeki BASE listesine ekleyin.");
  process.exit(1);
}
