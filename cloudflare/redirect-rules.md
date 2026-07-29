# Cloudflare — yönlendirmelerin kurulumu

30 adresin tamamı tek bir **Bulk Redirect List** içinde ve tek bir
**Bulk Redirect Rule** ile devreye giriyor. Panelde elle kural yazılmıyor;
kaynak `bulk-redirects.csv`.

Neden böyle: ücretsiz planda Single Redirect Rules kotası 10 kural. Önceki
kurulumda wildcard'larla o kotanın tamamı doluydu ve yeni bir yönlendirme
eklemek imkânsızdı. Bulk Redirects kotası ise 5 liste / 10.000 kayıt —
30 adres yanında ciddi bir pay.

## Şu anki durum

Kurulum yapıldı. Panelde duran:

- Liste `sametbasbug_2026_gecis` — 30 kayıt
- Kural `Eski URL yonlendirmeleri 2026` — listeye bağlı, **kapalı**

Eski wildcard'lı Single Redirect Rules silindi; o kota (10) tamamen boş.
Geriye kalan tek iş: **3. adım**, yani kuralı doğru anda açmak.

---

## 1. Listeyi oluştur

**Rules → Settings → Bulk Redirects → Create Bulk Redirect List**

- Ad: `sametbasbug_2026_gecis`
- `bulk-redirects.csv` dosyasını sürükle-bırak ile yükle

Dosyada **başlık satırı yok**, bilerek: panelin ayrıştırıcısı başlığı
atlamıyor, `source → target` diye sahte bir kayıt olarak ekliyor.

Listeler hesap seviyesinde yaşıyor; aynı hesaptaki bütün alan adları
aynı listeyi görür.

## 2. Kuralı oluştur

Liste kaydedildikten sonra aynı sayfada **Create Bulk Redirect Rule**.
Listeyi seç, kural adını ver, **"Save and Deploy" değil "Save as Draft"**
düğmesine bas. Draft kural kapalı doğar; yanlış anda trafiğe girmez.

## 3. Sırayı bozma

Kuralı yalnızca yeni site yayına girdikten sonra aç. Aksi hâlde eski
adresler var olmayan hedeflere 301 verir ve yazılar erişilemez olur.
Bu bir kere yaşandı.

```bash
# Önce hedefler ayakta mı?
for p in /yazilar/ /hakkinda/ /yazi/bu-blog-nasil-calisiyor/; do
  printf '%-40s %s\n' "$p" "$(curl -sS -o /dev/null -w '%{http_code}' https://sametbasbug.dev$p)"
done
```

Üçü de `200` verdikten sonra kuralı aç, ardından cache purge et.

## 4. Doğrula

```bash
curl -sSI https://sametbasbug.dev/blog/bu-blog-nasil-calisiyor/ | head -3
curl -sSI https://sametbasbug.dev/blog/feed/ | head -3
curl -sSI https://sametbasbug.dev/hakkimda/ | head -3
```

Üçü de `HTTP/2 301` ve doğru `location:` satırı vermeli.

## Astro'nun ürettiği yönlendirme sayfaları ne olacak

Kalıyor. Cloudflare isteği kenarda yakaladığı için o sayfalara hiç
ulaşılmıyor. Bir gün Cloudflare kuralları silinirse meta refresh sayfaları
devreye girer — yedek olarak duruyorlar, çakışmıyorlar.
