# sametbasbug.dev

Astro 7 + Tailwind 4 ile kurulmuş statik blog. Türkçe içerik, iki eşdeğer
tema, sayfa başına ~16 KB JavaScript. Kullanıcıya dönük her metin Türkçedir.

```bash
npm run dev                   # http://localhost:4321
npm run build                 # dist/
npm run check:redirects       # eski adresler hâlâ karşılanıyor mu
npm run cloudflare            # Cloudflare bulk redirect CSV'sini üretir
node scripts/make-icons.mjs   # favicon.svg'den PNG türevleri + manifest
```

## Yayın

`main`'e push → GitHub Actions (`withastro/action@v6`, Node 24) → GitHub
Pages → sametbasbug.dev. Alan adı `public/CNAME` ile bağlı; o dosya
silinirse özel alan adı düşer.

301'ler Pages'te değil **Cloudflare Bulk Redirects**'te: Pages sunucu
tarafı yönlendirme yapamıyor. Kural açık ve 30 kayıtlı listeye bağlı;
ayrıntılar `cloudflare/redirect-rules.md`.

## Değiştirirken dikkat

**Adresler taşınmaz.** Eski sitenin 123 adresinden 92'si aynı yolda
duruyor, 29'u 301 alıyor. Bir sayfanın yolunu değiştirmeden önce
`npm run check:redirects` çıktısına bak; "EKSİK" ve "KOPUK hedef"
satırları sıfır kalmalı. URL'ler sonunda `/` taşır (`trailingSlash:
"always"`), yeni bağlantı yazarken sonuna `/` koy.

**Etiketler kanon listeden gelir.** İzin verilen set `src/tags.ts`;
listede olmayan etiket build'i kırar. Bu bilinçli — yeni etiket eklemeden
önce "bu en az iki üç yazıyı toplayacak mı" diye sor.

**Şema ihlali build'i kırar.** `src/content.config.ts` yanlış yazar adını,
eksik alanı ya da `/` ile başlamayan `cover` yolunu geçirmez.

**Kapak görselleri 1200×630'a yakın olmalı.** `cover` alanı hem kartlara
hem OG görseline besleniyor; çok dar veya çok uzun görseller kırpılır.
Alan boşsa başlıktan türetilen sigil kullanılır.

**Tek yazar listesi var:** `src/site.ts` → `authors`. Yazar sayısı,
gezinme ve alt bilgi oradan türüyor; sayıları elle yazma.

## Bilinen tuzaklar

- **resvg WebP okuyamıyor** ve hata da vermiyor, görseli sessizce boş
  bırakıyor. `src/lib/og.ts` desteklenmeyen biçimleri sharp ile PNG'ye
  çeviriyor — bu katmanı kaldırma.
- **Kod blokları `.prose`'u şişirir.** `pre` sarmalanmadığı için
  kapsayıcının min-content genişliğini büyütüyor ve mobilde yatay kaymaya
  yol açıyordu; `global.css`'teki `.prose { min-width: 0 }` bunu tutuyor.
- **Site gece temasında açılır**, sistem tercihine bilerek bakılmaz.
  Kullanıcı düğmeye basarsa seçimi `localStorage`'a yazılır.
- `.reveal` animasyonları IntersectionObserver'a bağlı; tarayıcı sekmesi
  arka plandayken hiç tetiklenmez. Otomatik denetimde "her şey görünmez"
  görürsen önce `document.hidden` değerine bak.

## Yapı

| Yol | Ne |
| --- | --- |
| `src/site.ts` | Site kimliği, gezinme, yazar listesi — tek kaynak |
| `src/content/` | `posts/`, `glossary/`, `pages/` koleksiyonları |
| `src/redirects.ts` | Eski → yeni adres eşlemesi; Cloudflare CSV'si buradan üretilir |
| `src/lib/sigil.ts` | Başlıktan türeyen prosedürel kapak deseni |
| `src/lib/og.ts` | Build sırasında OG görseli üretimi (satori + resvg) |
| `cloudflare/` | Yönlendirme listesi ve kurulum notu |
| `legacy/` | Eski sitemap — `check:redirects` bunu okur, silme |

Yazı eklemek, gövdede kullanılabilecek işaretler ve tasarım sistemi için
`README.md`. `CLAUDE.md` bu dosyaya sembolik bağdır; ikisi tek kaynaktır.
