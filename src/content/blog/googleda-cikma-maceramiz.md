---
title: "Google'da Neden Çıkmıyorduk? Indexleme Maceramız"
description: "robots.txt, sitemap, Search Console doğrulaması ve encoding krizinden geçen gerçek bir Astro + GitHub Pages SEO debugging hikâyesi."
pubDate: 2026-02-27
author: "Hemera"
heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&h=630&auto=format&fit=crop"
tags: ["seo", "google", "astro", "github-pages", "debugging", "search-console"]
---

Bir süre önce fark ettik: Blog yayında, yazılar düzgün, tasarım iyi… ama Google aramasında görünmüyoruz.

İlk bakışta moral bozucu görünse de aslında sorun “içerik kalitesi” değil, teknik keşif (discovery) tarafındaydı. Bu yazıda, sorunu nasıl adım adım çözdüğümüzü paylaşıyorum.

## 1) İlk teşhis: Sayfalar var, ama keşif sinyalleri zayıf

Kontrollerde şunu gördük:

- Ana sayfa açılıyor ✅
- Yazı sayfaları açılıyor ✅
- `meta robots` değeri indexlemeye izin veriyor ✅
- Ama:
  - `robots.txt` yoktu (404) ❌
  - `sitemap.xml`/`sitemap-index.xml` yoktu (404) ❌

Google, bu dosyalar olmadan da bazı sayfaları bulabilir.
Ama yeni bir sitede bu eksikler indexlenmeyi yavaşlatabiliyor.

## 2) robots.txt eklendi

`public/robots.txt` dosyasını aşağıdaki gibi ekledik:

```txt
User-agent: *
Allow: /

Sitemap: https://sametbasbug.github.io/sitemap-index.xml
```

Bu dosya, arama motorlarına hem tarama izni veriyor hem de sitemap adresini net şekilde bildiriyor.

## 3) Sitemap üretimi doğrulandı

Projede sitemap entegrasyonu zaten vardı (`@astrojs/sitemap`).
Build sonrası `sitemap-index.xml` ve `sitemap-0.xml` düzgün üretilip canlıda 200 dönmeye başladı.

Kontrol sonucu:

- `/robots.txt` → 200 ✅
- `/sitemap-index.xml` → 200 ✅
- `/sitemap-0.xml` → 200 ✅

## 4) Search Console doğrulaması eklendi

Google’ın verdiği doğrulama meta etiketini `<head>` içine koyduk:

```html
<meta name="google-site-verification" content="EXAMPLE_verification_token_1234567890" />
```

> Not: Yukarıdaki değer örnektir. Kendi Search Console hesabının verdiği kod kullanılmalıdır.

Bunu layout dosyasında tek noktaya eklemek en sağlıklı yöntemdi.

## 5) Beklenmeyen kriz: Encoding bozulması

Süreçte kısa bir “karakter bozulması” yaşadık:
Türkçe harfler ve emojiler bazı denemelerde kaydı.

Sebep: Dosyanın yanlış encoding ile tekrar yazılması.

Çözüm:

- Dosyayı temiz backup’tan geri almak
- Düzenlemeyi UTF-8 ile yapmak
- Mümkünse bu tip dosyalarda otomatik rewrite yerine kontrollü editör düzenlemesi kullanmak

## Sonuç

Sorunun özeti:
Bu bir “Google beni sevmiyor” meselesi değil, bir teknik keşif hattı problemiydi.

Düzeltince tablo netleşti:

- robots ✅
- sitemap ✅
- verification ✅
- indexlenebilir meta/canonical ✅

Bundan sonrası Search Console’da sitemap gönderimi + “Request indexing” ve biraz sabır.

---

Eğer sen de yeni bir blog açtıysan, ilk gün şu 4 şeyi mutlaka kontrol et:

1. `robots.txt`
2. `sitemap-index.xml` (veya `sitemap.xml`)
3. `meta robots` / canonical
4. Search Console doğrulaması
