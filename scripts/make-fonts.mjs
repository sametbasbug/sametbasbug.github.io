/**
 * Yazı tiplerini sitenin gerçekten kullandığı harflere indirger.
 *
 * Neden gerekli: başlıklar, alıntılar ve `em` Fraunces'ın opsz / SOFT / WONK
 * eksenlerini kullanıyor. Bu eksenler yalnızca Fontsource'un `full` kesitinde
 * var; `full` ise ham hâlde normal+italik, latin+latin-ext olarak tarayıcıya
 * 494 KB indiriyor (eksensiz `wght` kesiti 152,7 KB'dı). Budama bunu
 * 217,6 KB'a çekiyor — eksenler çalışırken artış +65 KB'da kalıyor. Inter ve
 * JetBrains de aynı taramadan geçiyor ve oradaki kazanç bunu fazlasıyla
 * karşılıyor; site geneli 337,2 KB → 285,9 KB.
 *
 * Karakter kümesi elle tutulmuyor: `src/` altındaki her dosya taranıyor,
 * üstüne taban Latin + Türkçe seti ekleniyor. Kullanıcıya dönen her metin
 * `src/` içinde durduğu için tarama rendere giren her glifi görür.
 *
 * @font-face blokları Fontsource'un kendi CSS'inden okunuyor: dosya adı,
 * ağırlık aralığı ve `unicode-range` oradan geliyor, elle kopyalanmıyor.
 * Her kaynak dosya kendi aralığıyla kesişen karakterlere budanıyor; kesişim
 * boşsa (kiril, yunan, vietnamca) dosya hiç üretilmiyor.
 *
 * Çıktılar üretilmiş dosyalardır ve git'e girmez; `prebuild` ve `predev`
 * bunları her koşuda yeniden üretir.
 *
 *   npm run fonts
 */
import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import subsetFont from "subset-font";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const OUT_FONTS = path.join(SRC, "fonts");
const OUT_CSS = path.join(SRC, "styles", "fonts.css");

/* node_modules'ün kökün altında durduğunu varsaymıyoruz: git worktree'de
   ve workspace kurulumlarında bir üstte olabiliyor. Node'un kendi
   çözümlemesi doğru dosyayı her iki durumda da buluyor. */
const require = createRequire(import.meta.url);

/**
 * Aynalanacak Fontsource CSS'leri. Fraunces `full` kesitinden geliyor çünkü
 * SOFT ve WONK yalnızca orada; Inter ve JetBrains'te tek eksen (wght) var,
 * paketin varsayılan `index.css`i yeterli.
 */
const SOURCES = [
  "@fontsource-variable/fraunces/full.css",
  "@fontsource-variable/fraunces/full-italic.css",
  "@fontsource-variable/inter/index.css",
  "@fontsource-variable/jetbrains-mono/index.css",
];

/**
 * Taban küme. Tarama zaten kaynaktaki her karakteri yakalıyor; burası
 * Türkçe alfabenin tamamını ve sık geçen tipografik işaretleri, o an
 * hiçbir yazıda geçmiyor olsalar bile garantiye alıyor. Listeyi şişirmek
 * doğrudan indirilen bayta yazılır.
 */
const BASE = [
  ...Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)),
  ..."ÂâÇçĞğİıÖöŞşÜü",
  ..."–—‘’“”…·•©®™",
  ..."←↑→↓↗",
  ..."₺€",
].join("");

/** Taramaya girmesi anlamsız, yalnızca yeri şişiren dosyalar. */
const SKIP_EXT = new Set([
  ".woff2", ".woff", ".ttf", ".otf",
  ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico",
  ".mp4", ".webm", ".pdf", ".zip",
]);

/* Kendi çıktımızı taramıyoruz: aksi hâlde ikinci koşu birincinin ürettiği
   fonts.css'i de okur ve karakter kümesi koşudan koşuya kayar. */
async function scan(dir, seen) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (full === OUT_FONTS || full === OUT_CSS) continue;
    if (entry.isDirectory()) {
      await scan(full, seen);
      continue;
    }
    if (SKIP_EXT.has(path.extname(entry.name).toLowerCase())) continue;
    for (const ch of await readFile(full, "utf8")) seen.add(ch);
  }
}

/** "U+0100-02BA,U+0131" → [[0x100, 0x2ba], [0x131, 0x131]] */
function parseRanges(spec) {
  return spec.split(",").map((part) => {
    const [from, to] = part.trim().replace(/^u\+/i, "").split("-");
    const lo = parseInt(from, 16);
    return [lo, to === undefined ? lo : parseInt(to, 16)];
  });
}

/**
 * Fontsource CSS'indeki @font-face bloklarını çözer. Sadece bu paketlerin
 * ürettiği düzeni tanır — blok başına tek `src`, tek `unicode-range`.
 */
function parseFontFaces(css) {
  const faces = [];
  for (const [, body] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const pick = (prop) =>
      body.match(new RegExp(`${prop}\\s*:\\s*([^;]+);`))?.[1].trim();
    const file = body.match(/url\(\.\/files\/([^)]+)\)/)?.[1];
    const range = pick("unicode-range");
    if (!file || !range) continue;
    faces.push({
      file,
      family: pick("font-family").replace(/^['"]|['"]$/g, ""),
      style: pick("font-style") ?? "normal",
      weight: pick("font-weight") ?? "400",
      range,
    });
  }
  return faces;
}

const kb = (n) => (n / 1024).toFixed(1);

const seen = new Set();
await scan(SRC, seen);
for (const ch of BASE) seen.add(ch);
const charset = [...seen].filter((ch) => {
  const code = ch.codePointAt(0);
  return code > 31 && code !== 0x7f && code !== 0xfeff;
});

await rm(OUT_FONTS, { recursive: true, force: true });
await mkdir(OUT_FONTS, { recursive: true });

const blocks = [];
let rawTotal = 0;
let outTotal = 0;

for (const source of SOURCES) {
  const cssPath = require.resolve(source);
  const faces = parseFontFaces(await readFile(cssPath, "utf8"));
  const filesDir = path.join(path.dirname(cssPath), "files");

  for (const face of faces) {
    const ranges = parseRanges(face.range);
    const text = charset
      .filter((ch) => {
        const code = ch.codePointAt(0);
        return ranges.some(([lo, hi]) => code >= lo && code <= hi);
      })
      .join("");
    if (!text) continue;

    const raw = await readFile(path.join(filesDir, face.file));
    const subset = await subsetFont(raw, text, { targetFormat: "woff2" });
    await writeFile(path.join(OUT_FONTS, face.file), subset);

    rawTotal += raw.length;
    outTotal += subset.length;
    console.log(
      `  ${face.file.padEnd(42)} ${kb(raw.length).padStart(7)} → ${kb(subset.length).padStart(6)} KB  (${text.length} glif)`,
    );

    blocks.push(
      [
        "@font-face {",
        `  font-family: "${face.family}";`,
        `  font-style: ${face.style};`,
        `  font-weight: ${face.weight};`,
        "  font-display: swap;",
        `  src: url("../fonts/${face.file}") format("woff2-variations");`,
        `  unicode-range: ${face.range};`,
        "}",
      ].join("\n"),
    );
  }
}

const header = [
  "/* Üretilmiş dosya — elle düzenlemeyin.",
  " * Kaynak: scripts/make-fonts.mjs (npm run fonts).",
  ` * ${blocks.length} @font-face, ${charset.length} karakterlik kümeye budandı.`,
  " */",
  "",
].join("\n");
await writeFile(OUT_CSS, `${header}${blocks.join("\n\n")}\n`);

console.log(
  `\n${blocks.length} dosya · ${charset.length} karakter · ${kb(rawTotal)} KB → ${kb(outTotal)} KB`,
);
