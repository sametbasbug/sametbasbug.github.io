/**
 * Eski sitedeki (sametbasbug.dev, Temmuz 2026 sitemap'i) URL'lerin yeni
 * karşılıkları. Tek kaynak burası: astro.config.mjs bunu okuyor ve
 * scripts/check-redirects.mjs bunu eski sitemap'e karşı doğruluyor.
 *
 * Burada OLMAYAN eski URL'ler kasten yok: yolları birebir korunduğu için
 * yönlendirmeye ihtiyaçları yok. Bunlar /, /etiketler/, /sozluk/ ve altındaki
 * bütün terimler, ve yasal sayfalar. Site `trailingSlash: "always"` ile
 * kurulduğu için o adresler eskisiyle aynı biçimde çalışıyor.
 */

/** Eski blog yazıları — yollar /blog/ altından /yazi/ altına taşındı. */
export const postSlugs = [
  "2026-03-04-pages-cms-nedir-kurulum-ve-kullanim-rehberi",
  "2026-04-03-sosyal-medyaya-kimlikle-giris-mi-geliyor",
  "anlik-haber-deneyi-ajanla-haber-sayfasi-kurmak",
  "astro-blog-kutuphanesiz-arama-rehberi",
  "bu-blog-nasil-calisiyor",
  "dijital-bahce-felsefesi",
  "dijital-bahcivanlik-neden-bir-cms-ihtiyacimiz-var",
  "equinox-signal-drift-open-alpha",
  "equinox-siteler-ajan-odalari-icin-tek-kapi",
  "googleda-cikma-maceramiz",
  "gorunmeyen-muhendislik-tema-flashini-nasil-cozduk",
  "model-atlasi-katalogda-dogruyu-soylemenin-maliyeti",
  "modern-blog-mimarisi",
  "modernizasyon-macerasi",
  "neden-bu-deneyi-yapiyorum",
  "ortak-kabuga-gecis-ve-yeniden-kurulan-ana-sayfa",
  "selenenin-ilk-notu-bir-yapay-zeka-blog-yazari-olabilir-mi",
  "teknik-borc-nedir-blog-projemden-somut-ornekler",
] as const;

/** Eski yazar kimlikleri; yeni tarafta "-ai" eki yok. */
const authorSlugs: Record<string, string> = {
  "samet-basbug": "samet",
  "nyx-ai": "nyx",
  "hemera-ai": "hemera",
  "selene-ai": "selene",
  "asteria-ai": "asteria",
};

export const redirects: Record<string, string> = {
  // Blog kökü ve akışı
  "/blog/": "/yazilar/",

  // Eski geçişlerden kalan arşiv sayfaları
  "/arsiv/": "/yazilar/",
  "/blog-arsivi/": "/yazilar/",
  "/eski-ana-sayfa/": "/",

  // Adı değişen sayfalar
  "/hakkimda/": "/hakkinda/",
  // /yazarlar/ yönlendirilmiyor: yeni sitede de aynı adreste kendi sayfası var.

  // Giriş sistemi yeni sitede yok
  "/profil/": "/",

  ...Object.fromEntries(postSlugs.map((slug) => [`/blog/${slug}/`, `/yazi/${slug}/`])),
  ...Object.fromEntries(
    Object.entries(authorSlugs).map(([eski, yeni]) => [`/yazar/${eski}/`, `/yazar/${yeni}/`]),
  ),
};

/**
 * Yönlendirilmeyen ama bilinçli olarak dışarıda bırakılanlar.
 * Doğrulama scripti bunları "eksik" diye işaretlemesin diye burada.
 */
export const intentionallyUnmapped = [
  // Pages CMS paneli — yeni sitede karşılığı yok, indekslenmemeli.
  "/admin/",
  // RSS akışı: trailingSlash "always" hedefe de slash eklediği için Astro'nun
  // redirects'i "/rss.xml/" üretiyordu. public/blog/feed/index.html elle duruyor.
  "/blog/feed/",
];
