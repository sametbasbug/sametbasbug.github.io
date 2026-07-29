---
term: "Hydration"
summary: "Statik görünen arayüzün sonradan canlı davranış kazanması."
category: "Temel Teknik Terimler"
related: ["ssr", "frontend"]
---

Hazır gelen sayfanın tarayıcıda etkileşimli hâle gelme süreci.

## Kısa tanım

Hydration, sunucudan gelen HTML’nin tarayıcıda JavaScript ile etkileşimli hale getirilmesidir.

## Basit anlatım

Sahne dekoru önce kuruluyor, sonra oyuncular girip oyunu başlatıyor gibi. İlk görüntü var ama hareket sonradan geliyor.

## Ne zaman karşına çıkar?

- SSR kullanılan modern frontend projelerinde
- Butonlar, dropdown’lar, formlar sonradan aktif olurken
- Performans ve etkileşim dengesini konuşurken

## Dikkat edilmesi gerekenler

- Gereksiz hydration sayfayı ağırlaştırabilir
- Her bileşenin istemci tarafında çalışması şart değildir
- Yanlış kullanım, hızlı açılan ama sonradan hantallaşan sayfalar üretir
