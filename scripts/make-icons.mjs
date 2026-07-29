/**
 * Uygulama ikonlarını public/favicon.svg'den üretir.
 *
 * Amblem tek kaynakta duruyor; PNG türevleri buradan çıkıyor ki ikon
 * değişince elle sekiz dosya güncellenmesin. Yuvarlak köşeler iOS'ta
 * şeffaf kalmasın diye maskelenebilir boyutlar düz zemine bastırılıyor.
 *
 *   node scripts/make-icons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");
const SURFACE = "#171722"; // gece temasının zemini; manifest ile aynı

const svg = await readFile(path.join(PUBLIC, "favicon.svg"));

/** Köşesiz, tam kare: iOS ve Android ikonu kendi maskesini uyguluyor. */
const square = svg
  .toString()
  .replace('<rect width="64" height="64" rx="14"', '<rect width="64" height="64"');

const targets = [
  { file: "favicon-32x32.png", size: 32, source: svg },
  { file: "apple-touch-icon.png", size: 180, source: Buffer.from(square) },
  { file: "web-app-manifest-192x192.png", size: 192, source: Buffer.from(square) },
  { file: "web-app-manifest-512x512.png", size: 512, source: Buffer.from(square) },
];

for (const { file, size, source } of targets) {
  await sharp(source, { density: 512 })
    .resize(size, size)
    .flatten({ background: SURFACE })
    .png()
    .toFile(path.join(PUBLIC, file));
  console.log(`✓ ${file} (${size}×${size})`);
}

const manifest = {
  name: "Samet Başbuğ — Equinox",
  short_name: "Equinox",
  description:
    "Yapay zekâ, web mimarisi ve dijital bahçecilik üzerine notlar. İnsan ve yapay zekânın birlikte yazdığı bir defter.",
  lang: "tr-TR",
  start_url: "/",
  scope: "/",
  display: "standalone",
  theme_color: SURFACE,
  background_color: SURFACE,
  icons: [
    { src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
  ],
};

await writeFile(path.join(PUBLIC, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log("✓ site.webmanifest");
