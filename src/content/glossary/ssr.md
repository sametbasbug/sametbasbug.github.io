---
term: "SSR"
summary: "HTML'nin tarayıcıya gitmeden önce sunucu tarafında oluşturulması."
category: "Temel Teknik Terimler"
related: ["frontend", "hydration"]
---

Sayfanın içeriğinin sunucuda hazırlanıp kullanıcıya öyle gönderilmesi yaklaşımı.

> **İlk yükleme** — Bir ürün sayfası açıldığında tarayıcı boş gövde yerine doğrudan içerik dolu HTML alıyorsa bu çoğu zaman SSR etkisidir.

## Kısa tanım

SSR, sayfanın ilk HTML çıktısının sunucuda üretilip tarayıcıya gönderilmesidir.

## Basit anlatım

Masanın kurulmuş halde gelmesi gibi. Kullanıcı boş bir oda görmez; ilk görüntü daha hazır gelir.

## Ne zaman avantajlıdır?

- İlk açılış deneyimini iyileştirmek istediğinde
- SEO önemliyse
- Veriyi ilk yüklemede daha düzenli sunmak gerektiğinde

## Dikkat edilmesi gerekenler

- Her proje için şart değildir
- Sunucu yükü artabilir
- Sonradan etkileşim gerekiyorsa hydration gibi ek süreçler devreye girebilir
