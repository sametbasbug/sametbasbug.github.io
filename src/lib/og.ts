import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { decompress } from "wawoff2";
import { sigil } from "./sigil";

/* ------------------------------------------------------------------
   Renkler — gece temasının OG karşılığı. Sitede OKLCH token olarak
   duruyorlar; burada sabit sRGB'ye çevrilmiş halleri.
   ------------------------------------------------------------------ */

export const OG = {
  surface: "#191921",
  surfaceDeep: "#101018",
  ink: "#f4f1ea",
  inkSoft: "#b3b1c0",
  inkFaint: "#7d7b8c",
  ember: "#ffb069",
  veil: "#a68cf5",
  width: 1200,
  height: 630,
} as const;

/* ------------------------------------------------------------------
   Fontlar — Fontsource yalnızca woff2 dağıtıyor, satori woff2 okumuyor.
   Build sırasında bir kez TTF'ye açıp bellekte tutuyoruz.
   ------------------------------------------------------------------ */

const require = createRequire(import.meta.url);

const fontFile = (pkg: string, file: string) => {
  try {
    return require.resolve(`${pkg}/files/${file}`);
  } catch {
    return path.join(process.cwd(), "node_modules", pkg, "files", file);
  }
};

type SatoriFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600;
  style: "normal";
};

let fontsPromise: Promise<SatoriFont[]> | null = null;

async function ttf(pkg: string, file: string): Promise<Buffer> {
  const woff2 = await readFile(fontFile(pkg, file));
  return Buffer.from(await decompress(woff2));
}

function loadFonts(): Promise<SatoriFont[]> {
  fontsPromise ??= (async () => {
    // Türkçe karakterler latin-ext altkümesinde; ikisi de gerekli.
    const [display, displayExt, sans, sansExt] = await Promise.all([
      ttf("@fontsource/fraunces", "fraunces-latin-600-normal.woff2"),
      ttf("@fontsource/fraunces", "fraunces-latin-ext-600-normal.woff2"),
      ttf("@fontsource/inter", "inter-latin-400-normal.woff2"),
      ttf("@fontsource/inter", "inter-latin-ext-400-normal.woff2"),
    ]);

    // Aynı adı taşıyan iki altküme arasında satori geçiş yapmıyor; ayrı
    // adlarla verip fontFamily listesinde sıralıyoruz.
    return [
      { name: "Fraunces", data: display, weight: 600, style: "normal" },
      { name: "FrauncesExt", data: displayExt, weight: 600, style: "normal" },
      { name: "Inter", data: sans, weight: 400, style: "normal" },
      { name: "InterExt", data: sansExt, weight: 400, style: "normal" },
    ] satisfies SatoriFont[];
  })();

  return fontsPromise;
}

/* ------------------------------------------------------------------
   Kart
   ------------------------------------------------------------------ */

export interface OgCard {
  title: string;
  eyebrow?: string;
  meta?: string;
  /** Sigil'i üreten tohum; verilmezse başlık kullanılır. */
  seed?: string;
  /**
   * Yazının kapak görseli (public/ altına göre mutlak yol). Verilirse sigil
   * yerine zemine serilir. Okunabilirlik için üstüne koyu bir perde çekiyoruz.
   */
  cover?: string;
}

/**
 * resvg yalnızca PNG ve JPEG gömebiliyor — WebP/AVIF verildiğinde hata bile
 * atmıyor, görseli sessizce boş bırakıyor. Bu yüzden desteklemediği biçimleri
 * sharp ile PNG'ye çeviriyoruz (sharp zaten Astro ile birlikte geliyor).
 */
const NATIVE: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

async function coverDataUri(cover: string): Promise<string | null> {
  const file = path.join(process.cwd(), "public", cover.replace(/^\//, ""));

  let bytes: Buffer;
  try {
    bytes = await readFile(file);
  } catch {
    // Kapak bulunamazsa OG üretimi çökmesin; sigil devreye girsin.
    console.warn(`[og] kapak okunamadı, sigil'e düşülüyor: ${cover}`);
    return null;
  }

  const native = NATIVE[path.extname(cover).toLowerCase()];
  if (native) return `data:${native};base64,${bytes.toString("base64")}`;

  try {
    const { default: sharp } = await import("sharp");
    const png = await sharp(bytes).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (error) {
    console.warn(`[og] kapak PNG'ye çevrilemedi, sigil'e düşülüyor: ${cover}`, error);
    return null;
  }
}

const titleSize = (title: string) => {
  if (title.length <= 34) return 84;
  if (title.length <= 54) return 70;
  if (title.length <= 78) return 58;
  return 48;
};

export async function renderOg({ title, eyebrow, meta, seed, cover }: OgCard): Promise<Buffer> {
  const fonts = await loadFonts();
  const coverUri = cover ? await coverDataUri(cover) : null;

  const layer = (children: unknown[]): Record<string, unknown> => ({
    type: "div",
    props: {
      style: {
        width: `${OG.width}px`,
        height: `${OG.height}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        // Zemini biz çiziyoruz; satori katmanı saydam kalıyor.
        backgroundColor: "transparent",
      },
      children,
    },
  });

  const text = (
    content: string,
    style: Record<string, string | number>,
  ): Record<string, unknown> => ({
    type: "div",
    props: { style: { display: "flex", ...style }, children: content },
  });

  const svgText = await satori(
    layer([
      text(eyebrow ?? "SAMET BAŞBUĞ · EQUINOX", {
        fontFamily: "Inter, InterExt",
        fontSize: 21,
        letterSpacing: 4,
        color: OG.inkFaint,
      }),
      {
        type: "div",
        props: {
          style: { display: "flex", flexDirection: "column", maxWidth: "760px" },
          children: [
            text(title, {
              fontFamily: "Fraunces, FrauncesExt",
              fontWeight: 600,
              fontSize: titleSize(title),
              lineHeight: 1.04,
              letterSpacing: -1.5,
              color: OG.ink,
            }),
          ],
        },
      },
      {
        type: "div",
        props: {
          style: { display: "flex", alignItems: "center", gap: "18px" },
          children: [
            {
              type: "div",
              props: {
                style: { display: "flex", width: "56px", height: "3px", backgroundColor: OG.ember },
              },
            },
            text(meta ?? "sametbasbug.dev", {
              fontFamily: "Inter, InterExt",
              fontSize: 25,
              color: OG.inkSoft,
            }),
          ],
        },
      },
    ]) as Parameters<typeof satori>[0],
    { width: OG.width, height: OG.height, fonts },
  );

  // Satori'nin ürettiği katmanı kendi zeminimizin üstüne alıyoruz.
  const innerText = svgText.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const art = sigil(seed ?? title, {
    detail: 1.6,
    ember: OG.ember,
    veil: OG.veil,
    inner: true,
  });

  // Kapak varsa zemin o; metin okunsun diye üstüne iki kademeli perde.
  // Kapak yoksa eski düzen: gradyan zemin + sağda sigil.
  const backdrop = coverUri
    ? `<image href="${coverUri}" x="0" y="0" width="${OG.width}" height="${OG.height}"
        preserveAspectRatio="xMidYMid slice"/>
  <rect width="${OG.width}" height="${OG.height}" fill="url(#scrim-x)"/>
  <rect width="${OG.width}" height="${OG.height}" fill="url(#scrim-y)"/>`
    : `<rect width="${OG.width}" height="${OG.height}" fill="url(#bg)"/>
  <ellipse cx="120" cy="60" rx="520" ry="380" fill="url(#glow-a)"/>
  <ellipse cx="1020" cy="300" rx="480" ry="420" fill="url(#glow-b)"/>
  <g transform="translate(760 -40) scale(3.6)" opacity="0.95">${art}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}" viewBox="0 0 ${OG.width} ${OG.height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${OG.surface}"/>
      <stop offset="55%" stop-color="${OG.surfaceDeep}"/>
      <stop offset="100%" stop-color="#1d1526"/>
    </linearGradient>
    <radialGradient id="glow-a" cx="50%" cy="50%">
      <stop offset="0%" stop-color="${OG.ember}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${OG.ember}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-b" cx="50%" cy="50%">
      <stop offset="0%" stop-color="${OG.veil}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${OG.veil}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrim-x" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${OG.surfaceDeep}" stop-opacity="0.94"/>
      <stop offset="62%" stop-color="${OG.surfaceDeep}" stop-opacity="0.66"/>
      <stop offset="100%" stop-color="${OG.surfaceDeep}" stop-opacity="0.38"/>
    </linearGradient>
    <linearGradient id="scrim-y" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${OG.surfaceDeep}" stop-opacity="0.5"/>
      <stop offset="45%" stop-color="${OG.surfaceDeep}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${OG.surfaceDeep}" stop-opacity="0.72"/>
    </linearGradient>
  </defs>

  ${backdrop}

  <rect y="${OG.height - 6}" width="${OG.width}" height="6" fill="${OG.ember}"/>
  ${innerText}
</svg>`;

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG.width },
    font: { loadSystemFonts: false },
  });

  return Buffer.from(resvg.render().asPng());
}
