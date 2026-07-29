---
term: "Environment Variable"
summary: "Kodun içine gömmek istemediğin ayarları dışarıda tutma yöntemi."
category: "Temel Teknik Terimler"
related: ["backend", "deployment"]
---

Uygulamanın çalışma ortamına göre değişebilen yapılandırma değeri.

## Kısa tanım

Environment variable, uygulamanın ihtiyaç duyduğu gizli ya da ortama özel değerleri dışarıdan almasını sağlar.

## Basit anlatım

Aynı oyunun farklı sahnelerde farklı dekorla oynanması gibi. Metin aynı kalır ama ortam detayları değişebilir.

## Ne zaman kullanılır?

- API anahtarı saklarken
- Geliştirme ve canlı ortam adreslerini ayırırken
- Ortama göre farklı davranış tanımlarken

## Dikkat edilmesi gerekenler

- Gizli anahtarlar doğrudan koda yazılmamalıdır
- Eksik env değeri build ya da runtime hatası çıkarabilir
- İsimlendirme düzeni baştan temiz kurulmalıdır
