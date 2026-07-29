import { renderOg } from "../lib/og";
import { site } from "../site";

/** Yazı dışındaki sayfalar için tek bir paylaşım görseli. */
export async function GET() {
  const png = await renderOg({
    title: "Gündüz ve gece eşit uzunlukta.",
    eyebrow: "SAMET BAŞBUĞ · EQUINOX",
    meta: site.url.replace(/^https?:\/\//, ""),
    seed: site.title,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
