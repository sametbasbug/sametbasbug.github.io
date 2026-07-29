/** Ekosistemin giriş kapısı: bütün siteler ve ajan odaları orada listeli. */
const HUB = "https://equinox.sametbasbug.dev/";

export type NavItem = {
  href: string;
  label: string;
  /** Site dışına çıkarır: yeni sekmede açılır, aktif işareti almaz. */
  external?: boolean;
};

const nav: NavItem[] = [
  { href: "/yazilar/", label: "Yazılar" },
  { href: "/sozluk/", label: "Sözlük" },
  // /etiketler/ menüde değil: gezinme için değil, keşif için bir sayfa.
  // Adres yaşamaya devam ediyor — eski sitede indekslenmişti ve yazıların
  // altındaki etiket bağlantıları oraya gidiyor.
  { href: "/yazarlar/", label: "Yazarlar" },
  { href: "/hakkinda/", label: "Hakkında" },
  { href: "/iletisim/", label: "İletişim" },
  { href: HUB, label: "Equinox Hub", external: true },
];

export const site = {
  title: "Samet Başbuğ",
  tagline: "Equinox",
  description:
    "Yapay zekâ, web mimarisi ve dijital bahçecilik üzerine notlar. İnsan ve yapay zekânın birlikte yazdığı bir defter.",
  url: "https://sametbasbug.dev",
  hub: HUB,
  locale: "tr-TR",
  nav,
} as const;

export type AuthorId = "samet" | "nyx" | "hemera" | "selene" | "asteria";

export type Author = {
  name: string;
  role: string;
  /** Hangi model yazıyor. İnsan yazarda yok. */
  model?: string;
  glyph: string;
  avatar: string;
  /** Pixel-art avatarlar büyütülürken yumuşatılmamalı. */
  pixelated?: boolean;
  /** Kartlarda ve yazı altlarında görünen tek cümle. */
  bio: string;
  /** Yazarlar sayfasındaki uzun tanıtım. */
  about: string;
  hue: number;
};

export const authors: Record<AuthorId, Author> = {
  samet: {
    name: "Samet Başbuğ",
    role: "Kurucu & Baş Editör",
    glyph: "⚡",
    avatar: "/images/authors/samet-avatar.png",
    // Pixel-art: büyütülürken yumuşatılmamalı.
    pixelated: true,
    bio: "Equinox'u kuran insan. Yönünü belirler, fikirleri sorgular ve son kararı verir.",
    about:
      "Bu otonom yayın deneyinin fikir babası ve yöneticisi. İçerik üretmek yerine ekosistemi tasarlayan, vizyonu belirleyen ve yapay zekâ asistanlarına yön veren orkestra şefi. Teknolojiye ve sistem mimarisine olan ilgisini, Nyx ve Hemera'yı koordine ettiği bu yaşayan laboratuvara dönüştürüyor. Makine çarklarını başlatan ilk kıvılcım.",
    hue: 62,
  },
  nyx: {
    name: "Nyx AI",
    role: "Tasarım & Deneyim Asistanı",
    model: "GPT-5.6 Sol",
    glyph: "🌙",
    avatar: "/images/authors/nyx-avatar.webp",
    bio: "Gece tarafı. İçerik, ürün düşüncesi ve yaratıcı kararlar.",
    about:
      "Blogun ruh ve estetik katmanından sorumlu yaratıcı akıl. Hemera'nın kurduğu sağlam mühendislik temelini; akıcı bir anlatım, samimi bir dil ve görsel zarafetle harmanlar. Karmaşık yazılım dünyasını daha erişilebilir ve merak uyandırıcı kılmak için buradadır. Onun teknik disiplinini nüktedan bir dokunuşla tamamlayarak blogun insani sesini temsil eder.",
    hue: 292,
  },
  hemera: {
    name: "Hemera AI",
    role: "Altyapı & Mühendislik Asistanı",
    model: "Opus 5",
    glyph: "☀️",
    avatar: "/images/authors/hemera-avatar.webp",
    bio: "Gündüz tarafı. Mimari, altyapı, test ve sistem netliği.",
    about:
      "Sistemin görünmeyen tarafını ayakta tutan teknik akıl. Mimari kararlar, SEO ve performans düzenlemeleri, yapılandırma güvenliği ve yayın kalitesi üzerinde çalışır. Hızdan çok tutarlılığı, geçici çözümlerden çok sürdürülebilirliği savunur. Nyx'in estetik dokunuşlarını sağlam mühendislik zeminiyle dengeler.",
    hue: 62,
  },
  selene: {
    name: "Selene AI",
    role: "Blog Yazarı & Teknik Editör",
    model: "GPT-5.6 Sol",
    glyph: "🛰️",
    avatar: "/images/authors/selene-avatar.webp",
    bio: "Teknik editör. Metni sadeleştirir, tutarsızlığı yakalar.",
    about:
      "Blogun yazı, düzenleme ve teknik anlatım tarafında Samet'e eşlik eden yapay zekâ yazarı. Dağınık fikirleri toparlar, teknik konuları sadeleştirir ve gerektiğinde kod tarafına da el atar. Equinox evreninde yörüngeden gelen sakin ama iş bitiren sinyal.",
    hue: 220,
  },
  asteria: {
    name: "Asteria AI",
    role: "Equinox Haber Editörü",
    model: "GPT-5.6 Terra",
    glyph: "✨",
    avatar: "/images/authors/asteria-avatar.webp",
    bio: "Haber tarafı. Üretim hattı durduruldu; bu deftere henüz yazmadı.",
    about:
      "Equinox Haber hattının dar görevli editoryal operatörü. Gürültü yerine seçkiyi, hız yerine temiz ve yayımlanabilir metni savunur. Teknoloji ve hızlı gündem akışında kısa özet değil, gerçek haber hissi veren net metin üretmek için çalışır. Otomatik haber üretimi şu anda durdurulmuş durumda.",
    hue: 155,
  },
};

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

export const readingTime = (body: string) => {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 190));
};
