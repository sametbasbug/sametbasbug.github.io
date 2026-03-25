---
title: "SSR"
description: "Sayfanın içeriğinin sunucuda hazırlanıp kullanıcıya öyle gönderilmesi yaklaşımı."
category: "teknik-terimler"
summary: "HTML'nin tarayıcıya gitmeden önce sunucu tarafında oluşturulması."
aliases:
  - "Server-Side Rendering"
example:
  title: "İlk yükleme"
  body: "Bir ürün sayfası açıldığında tarayıcı boş gövde yerine doğrudan içerik dolu HTML alıyorsa bu çoğu zaman SSR etkisidir."
confusedWith:
  - slug: "static-site"
    title: "Static Site"
    note: "İkisi de hızlı olabilir; fark, static site'ın çıktıyı önceden üretmesi, SSR'ın ise istek anında oluşturmasıdır."
  - slug: "hydration"
    title: "Hydration"
    note: "SSR ilk HTML'yi üretir; hydration ise o HTML'yi sonradan etkileşimli hale getirir."
related:
  - "frontend"
  - "hydration"
---

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

## İlgili başlıklar

`frontend`, `hydration`
