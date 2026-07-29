---
title: "Pages CMS Nedir? Astro Blog İçin Kısa Kurulum Rehberi"
summary: "Pages CMS’in GitHub tabanlı statik sitelerde nasıl çalıştığını ve Astro blog projesine nasıl bağlandığını kısa, pratik bir rehberle anlatıyorum."
date: 2026-03-04
author: samet
tags: ["astro", "cms", "web"]
---

Statik site kurmanın en güzel tarafı sade olmasıdır.

İçerikler dosya olarak durur, proje GitHub’da saklanır, site build alır ve yayınlanır. [Veritabanı](/sozluk/database/) yok, ağır panel yok, arka planda sürekli çalışan karmaşık bir sistem yok.

Ama bu sadeliğin küçük bir bedeli var: Yeni yazı eklemek için çoğu zaman dosya yapısına, [Markdown](/sozluk/markdown/)’a, frontmatter alanlarına ve Git akışına dokunmak gerekiyor.

İşte **Pages [CMS](/sozluk/cms/)** tam olarak bu noktada işe yarıyor.

## Pages CMS nedir?

Pages CMS, GitHub reposundaki içerik dosyalarını görsel bir panel üzerinden düzenlemeyi sağlayan açık kaynak bir CMS aracıdır.

Klasik WordPress mantığıyla çalışmaz. Ayrı bir veritabanı kurmaz. İçerikleri başka bir yere taşımaz. Bunun yerine repodaki Markdown dosyalarını okur, düzenler ve değişiklikleri tekrar GitHub’a yazar.

Yani içerik yine projede kalır.

Kısaca Pages CMS şunu sağlar:

- Markdown içerikleri panelden düzenleme,
- yeni blog yazısı oluşturma,
- kapak görseli yükleme,
- frontmatter alanlarını form gibi doldurma,
- GitHub tabanlı içerik akışını bozmadan daha rahat yazı yönetme.

Bu yüzden Pages CMS’i sitenin ana motoru gibi değil, GitHub’daki içerik dosyaları için daha kullanışlı bir editör gibi düşünmek daha doğru.

## Neden ihtiyaç duydum?

Bu blog Astro tabanlı çalışıyor. Yazılar `src/content/blog` klasöründe Markdown dosyaları olarak duruyor.

Her yazının başında da şöyle alanlar var:

```
---
title: "Örnek Yazı"
description: "Yazının kısa açıklaması."
pubDate: 2026-03-04
heroImage: /images/ornek.jpg
isDraft: false
tags:
  - Astro
  - Blog
author: Samet Başbuğ
---
```

Bu yapı geliştirici için temiz. Ama her yazı eklerken dosya adı, tarih formatı, görsel yolu, etiketler ve taslak durumu gibi küçük şeyleri elle takip etmek gerekiyor.

Pages CMS bu işi daha rahat hale getiriyor. Kod editörü açmadan yeni yazı oluşturabiliyor, görsel seçebiliyor ve temel alanları panelden doldurabiliyorsun.

## Kurulum mantığı

Pages CMS’in kalbi `.pages.yml` dosyasıdır.

Bu dosya Pages CMS’e şunu söyler:

> İçerikler nerede duruyor, görseller nereye yüklenecek, yeni yazı oluştururken hangi alanlar gösterilecek?

Bu projede medya ayarı şöyle:

```
media:
  input: public/images
  output: /images
```

Yani görseller [repo](/sozluk/repository/) içinde `public/images` klasörüne yükleniyor, sitede ise `/images/...` yolu üzerinden kullanılıyor.

Blog koleksiyonu ise şöyle tanımlanıyor:

```
content:
  - name: blog
    label: Blog
    type: collection
    path: src/content/blog
    filename: "{year}-{month}-{day}-{primary}.md"
```

Bu ayar sayesinde Pages CMS, blog yazılarını `src/content/blog` klasöründe arıyor ve yeni yazıları tarih + başlık mantığıyla dosyalıyor.

## Blog alanları

Blog yazısı oluştururken panelde gösterilecek alanlar da `.pages.yml` içinde belirleniyor.

Bu projede temel alanlar şunlar:

```
fields:
  - name: title
    label: Başlık
    type: string
    required: true

  - name: description
    label: Açıklama
    type: text
    required: true

  - name: pubDate
    label: Yayın Tarihi
    type: date
    required: true
    options:
      format: yyyy-MM-dd

  - name: heroImage
    label: Kapak Görseli
    type: image

  - name: isDraft
    label: Taslak mı?
    type: boolean
    default: true

  - name: tags
    label: Etiketler
    type: string
    list: true

  - name: author
    label: Yazar
    type: string

  - name: body
    label: İçerik
    type: rich-text
    required: true
```

Böylece başlık, açıklama, tarih, kapak görseli, etiketler ve yazı içeriği panelden yönetilebilir hale geliyor.

Asıl güzel taraf şu: Panelden düzenleme yapılsa bile altta yine Markdown dosyaları duruyor. Yani statik site mantığı bozulmuyor.

## Kullanım akışı

Pages CMS’i kullanmak için genel akış basit:

1.  GitHub hesabıyla Pages CMS’e giriş yap.
2.  GitHub App yetkisini ver.
3.  Blog reposunu seç.
4.  Repoda `.pages.yml` dosyasını hazırla.
5.  Panelden yeni yazı oluştur.
6.  Yazıyı kaydet.
7.  Son olarak projede build kontrolü yap.

Buradaki en önemli adım sonuncusu.

CMS paneli yazıyı düzgün göstermiş olabilir ama asıl test yine build aşamasıdır:

```
npm run build
```

Eğer build geçiyorsa frontmatter, Markdown yapısı ve Astro içerik şeması büyük ihtimalle uyumludur.

## Pages CMS neyi çözmez?

Pages CMS kullanmak yazıyı otomatik olarak iyi yapmaz.

Başlığı yine bizim düşünmemiz gerekir. Açıklamanın düzgün olması gerekir. Etiketlerin abartılmaması gerekir. Kapak görselinin yazıyla uyumlu olması gerekir.

Yani Pages CMS editoryal sorumluluğu ortadan kaldırmaz. Sadece içerik ekleme sürecindeki teknik sürtünmeyi azaltır.

Benim için değeri de burada:

> Statik sitenin sadeliğini koruyup, içerik yönetimini daha az yorucu hale getiriyor.

## Sonuç

Pages CMS, Astro + GitHub tabanlı bir blog için gayet kullanışlı bir ara katman.

Ayrı bir veritabanı kurmadan, mevcut repo yapısını bozmadan ve Markdown düzenini koruyarak daha rahat içerik girmeyi sağlıyor.

Küçük bir blogda ilk başta şart değil. Ama yazı sayısı arttıkça, kapak görselleri çoğaldıkça ve içerik düzeni önem kazandıkça böyle bir panel ciddi kolaylık sağlıyor.

Kısacası Pages CMS, blogu daha karmaşık hale getirmeden yönetimi kolaylaştırıyor.

Bazen iyi araç tam olarak budur: Sistemi büyütmeden, işi hafifletir.
