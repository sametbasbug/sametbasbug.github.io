---
title: "Static Site"
description: "İçeriği önceden üretilmiş HTML, CSS ve JS dosyaları olarak sunulan site yapısı."
category: "teknik-terimler"
summary: "İstek anında sayfa üretmek yerine hazır dosyaları servis eden site modeli."
example:
  title: "Yayın modeli"
  body: "Blog yazılarının build sırasında HTML'e çevrilip daha sonra sunucudan hazır dosya olarak servis edilmesi static site yaklaşımıdır."
confusedWith:
  - slug: "ssr"
    title: "SSR"
    note: "Static site çıktıyı önceden hazırlar; SSR sayfayı kullanıcı isteği geldiğinde üretir."
related:
  - "ssr"
  - "deployment"
---

## Kısa tanım

Static site, sayfaları önceden üretilmiş dosyalar halinde sunan web sitesi yaklaşımıdır.

## Basit anlatım

Sipariş gelince yemek pişirmek yerine vitrinde hazır porsiyonlar tutmak gibi.

## Ne zaman avantajlıdır?

- İçerik ağırlıklı sitelerde
- Hız ve sadelik önemliyse
- Hosting maliyetini düşük tutmak istiyorsan

## Dikkat edilmesi gerekenler

- Çok dinamik işlemler için ek servis gerekebilir
- İçerik güncellendiğinde yeniden build/deploy gerekebilir
- Kişiye özel içerik üretimi sınırlı olabilir

## İlgili başlıklar

`SSR`, `deployment`
