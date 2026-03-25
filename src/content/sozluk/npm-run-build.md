---
title: "npm run build"
description: "Projeyi yayınlanabilir üretim çıktısına dönüştürür."
category: "komutlar-ve-araclar"
summary: "Canlıya çıkmadan önce projenin üretim paketini hazırlayan komut."
example:
  title: "Yayın öncesi kontrol"
  body: "Yerelde her şey düzgün görünse bile build aşamasında eksik environment variable veya kırık import gibi hatalar ortaya çıkabilir."
confusedWith:
  - slug: "npm-run-dev"
    title: "npm run dev"
    note: "npm run build son çıktıyı hazırlar; npm run dev ise geliştirme sırasında hızlı önizleme sağlar."
related:
  - "deployment"
  - "npm-install"
  - "npm-run-dev"
---

## Kısa tanım

`npm run build`, projeyi production için derler ve dağıtıma hazır çıktı üretir.

## Basit anlatım

Provanın ardından sahne versiyonunu hazırlamak gibi. Geliştirme ortamındaki esneklik gider, yayınlanabilir paket ortaya çıkar.

## Ne zaman kullanılır?

- Deploy etmeden önce
- Build hatalarını erkenden görmek için
- Statik çıktı üreten projelerde son dosyaları hazırlamak için

## Dikkat edilmesi gerekenler

- Build başarılı olsa bile canlı ortamda ayrı sorun çıkabilir
- Bazı projelerde bu komut zaman alır; gereksiz çalıştırmak verimsiz olabilir
- Environment variable eksikleri build sırasında ortaya çıkabilir

## İlgili başlıklar

`deployment`, `npm install`, `npm run dev`
