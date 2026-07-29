# Equinox — sametbasbug.dev

Astro 7 + Tailwind 4 ile kurulmuş statik blog. Gündüz ve gece olmak üzere iki
eşdeğer tema, başlıktan türetilen prosedürel kapak görselleri, komut paleti ve
sayfa başına 16 KB JavaScript.

Klavye: `⌘K` / `Ctrl+K` ya da `/` komut paletini açar, `T` temayı çevirir.

```bash
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run preview  # üretim çıktısını yerelde sun
```

## Yazı eklemek

`src/content/posts/` altına bir markdown dosyası koy. Dosya adı URL olur
(`/yazi/<dosya-adı>`), o yüzden **Türkçe karakter kullanma**.

```markdown
---
title: "Başlık"
summary: "Kartlarda ve arşivde görünen bir–iki cümlelik özet."
date: 2026-07-28
author: samet        # samet | nyx | hemera | selene
tags: ["web", "tasarim"]
featured: false      # ana sayfada büyük blokta çıkar
draft: false         # true ise üretimde yayınlanmaz
---
```

Şema `src/content.config.ts` içinde. Yanlış bir yazar adı ya da eksik alan
build'i kırar — bu bilinçli.

**Etiketler kanon listeden seçilir.** İzin verilen set `src/tags.ts` içinde;
listede olmayan bir etiket yazarsan build kırılır. Yeni etiket eklemeden önce
sor: bu etiket zamanla en az iki üç yazıyı toplayacak mı? Toplamayacaksa
etiket değil, sadece bir kelimedir. Okunabilir adlar da aynı dosyada
(`TAG_LABELS`) — URL'de `yapay-zeka`, ekranda "Yapay zekâ".

### Gövdede kullanabileceğin işaretler

İlk paragraf otomatik olarak büyür ve ilk harfi düşer — ayrıca bir şey
yapmana gerek yok. Bunlar da hazır:

```markdown
> Alıntı. Metin sütununu iki yandan taşar, italik Fraunces ile dizilir.

<aside class="note">Kenar notu. Geniş ekranda metnin soluna çıkar,
dar ekranda akışın içinde kalır.</aside>

---
```

`---` üç yıldızlı bir ayraca dönüşüyor. `*vurgu*` italik Fraunces'e geçiyor,
gövde yazısından ayrılıyor.

## Yapı

| Yol | Ne |
| --- | --- |
| `src/site.ts` | Site adı, menü, yazar tanımları, tarih/okuma süresi yardımcıları |
| `src/styles/global.css` | Tema token'ları, tipografi, animasyonlar, `.prose` |
| `src/components/Sigil.astro` | Başlıktan türetilen deterministik yörünge diyagramı |
| `src/components/Sky.astro` | Arka plan: gecede yıldız, gündüzde toz ve ışık huzmesi |
| `src/lib/posts.ts` | Yazı listeleme, etiket sayımı, benzer yazı seçimi |
| `src/lib/og.ts` | Paylaşım görselleri: satori + resvg ile 1200×630 PNG |
| `src/components/CommandPalette.astro` | ⌘K paleti; veri build sırasında gömülüyor |

## Tasarım kararları

**Tek token seti.** Renkler `--c-surface`, `--c-ink`, `--c-ember` gibi anlam
adlarıyla tanımlı; tema değişince isimler değil değerleri değişiyor. Yeni bir
bileşen yazarken doğrudan renk değeri yazma, token kullan.

**Kapak görseli yok, sigil var.** Her yazının başlığı FNV-1a ile hash'lenip
deterministik bir SVG'ye dönüşüyor. Aynı başlık her zaman aynı şekli verir;
stok görsel aramaya gerek kalmaz. Beş arketip dönüşümlü geliyor — yörünge,
spiral, takımyıldız, dalga, kafes — böylece yan yana duran kapaklar
birbirinin kopyası gibi durmuyor. Büyük gösterimlerde `weight` propunu
artır (`1.7`–`1.9`), yoksa çizgiler incelip kayboluyor.

**Paylaşım görselleri build'de üretiliyor.** Her yazı için `/og/<slug>.png`,
diğer sayfalar için `/og.png`. Metin satori ile diziliyor, zemin ve sigil elle
çizilip resvg ile PNG'ye veriliyor. Fontsource yalnızca woff2 dağıttığı,
satori ise woff2 okumadığı için fontlar build sırasında `wawoff2` ile TTF'ye
açılıyor — bu yüzden `@fontsource/fraunces` ve `@fontsource/inter` (statik
sürümler) bağımlılıkta duruyor.

**Hareket isteğe bağlı.** Bütün animasyonlar `prefers-reduced-motion`
kontrolünün arkasında. Yeni animasyon eklerken aynısını yap.

**Yazar ayrımı.** Dört imza var ve hiçbiri diğerinin adına yazmıyor;
`author` alanı zorunlu.

## Eski siteden geçiş

Eski site (`/blog/…`, `/sozluk/…`, `/hakkimda/`) bu yapıya taşındı. İlgili
parçalar:

| Yol | Ne |
| --- | --- |
| `legacy/eski-sitemap-2026-07.txt` | Eski sitenin 123 URL'lik sitemap kaydı — `check-redirects` bunu okur |
| `src/redirects.ts` | Eski → yeni URL haritası; `astro.config.ts` bunu okuyor |
| `scripts/check-redirects.mjs` | Her eski adres karşılanıyor mu, hedefi var mı |

İçeriği eski siteden çeken `migrate-*` betikleri geçiş bittiğinde silindi;
kaynakları artık yayında değil. Gerekirse git geçmişinden alınabilir.

```bash
npm run build && npm run check:redirects
```

**URL'ler sonunda slash taşıyor.** Eski site böyle indekslendi; `trailingSlash:
"always"` sayesinde sözlüğün ve yasal sayfaların 91 adresi hiç değişmedi.
Yeni bağlantı yazarken sonuna `/` koy.

**301'ler Cloudflare'de.** GitHub Pages sunucu tarafı yönlendirme yapamıyor;
alan adı Cloudflare üzerinden proxy edildiği için gerçek 301'ler orada
tanımlanıyor.

```bash
npm run cloudflare
```

Kural Cloudflare panelinde **açık** ve 30 kayıtlı listeye bağlı; ayrıntılar
`cloudflare/redirect-rules.md` içinde.

**Sıra önemli: önce site deploy, sonra kuralları aç.** Kurallar hedefler
yayına girmeden açılırsa eski adresler 301 alıp 404'e düşer. Geçişte bu
sıraya uyuldu; ileride yeni bir yönlendirme eklerken de aynısı geçerli.

Astro'nun ürettiği `meta refresh` sayfaları yedek olarak duruyor: Cloudflare
isteği kenarda yakaladığı için onlara ulaşılmaz, ama kurallar bir gün
silinirse devreye girerler.

## Değişiklik yayına çıkmadan önce

- `npm run check:redirects` temiz mi? "KOPUK hedef" satırı sıfır olmalı.
- **Yasal metinler hâlâ hukuki denetimden geçmedi.** `src/content/pages/`
  altındakiler sitenin bugünkü gerçeğine göre yazıldı (veri toplanmıyor,
  çerez yok, yorum yok) ama bir hukukçu okumadı.
- Siteye veri toplayan bir özellik eklersen gizlilik ve çerez metinleri o
  özellik yayına girmeden önce güncellenmeli.
- Alan adı değişirse üç yer birden güncellenir: `astro.config.ts` içindeki
  `site` (sitemap, RSS ve mutlak OG adresleri), `src/site.ts` içindeki `url`
  ve `public/CNAME`.
