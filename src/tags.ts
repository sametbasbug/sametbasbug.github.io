/**
 * İzin verilen etiketler. Şema bu listeye bağlı: burada olmayan bir etiket
 * yazıldığında build kırılır. Amaç, aynı konunun üç farklı yazımla
 * (yapayzeka / yapay-zeka / yapay zeka) etikete dönüşmesini engellemek.
 *
 * Yeni etiket eklemeden önce sor: bu etiket zamanla en az iki üç yazıyı
 * toplayacak mı? Toplamayacaksa etiket değil, sadece bir kelimedir.
 */
export const TAGS = [
  "ajanlar",
  "astro",
  "cms",
  "dijital-bahce",
  "equinox",
  "internet",
  "mimari",
  "muhendislik",
  "performans",
  "seo",
  "tasarim",
  "veri",
  "web",
  "yapay-zeka",
  "yazmak",
] as const;

export type Tag = (typeof TAGS)[number];

/** Etiketlerin okunabilir adları — başlıklarda ve etiket sayfasında. */
export const TAG_LABELS: Record<Tag, string> = {
  ajanlar: "Ajanlar",
  astro: "Astro",
  cms: "CMS",
  "dijital-bahce": "Dijital bahçe",
  equinox: "Equinox",
  internet: "İnternet",
  mimari: "Mimari",
  muhendislik: "Mühendislik",
  performans: "Performans",
  seo: "SEO",
  tasarim: "Tasarım",
  veri: "Veri",
  web: "Web",
  "yapay-zeka": "Yapay zekâ",
  yazmak: "Yazmak",
};

export const tagLabel = (tag: string) => TAG_LABELS[tag as Tag] ?? tag;
