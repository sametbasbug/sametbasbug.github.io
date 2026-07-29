---
term: "npm run build"
summary: "Canlıya çıkmadan önce projenin üretim paketini hazırlayan komut."
category: "Komutlar ve Araçlar"
related: ["deployment", "npm-install", "npm-run-dev"]
---

Projeyi yayınlanabilir üretim çıktısına dönüştürür.

> **Yayın öncesi kontrol** — Yerelde her şey düzgün görünse bile build aşamasında eksik environment variable veya kırık import gibi hatalar ortaya çıkabilir.

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
