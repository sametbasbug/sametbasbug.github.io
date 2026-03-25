---
title: "Cache"
description: "Sık kullanılan veriyi daha hızlı erişmek için geçici olarak saklama yöntemi."
category: "teknik-terimler"
summary: "Aynı işi tekrar tekrar yapmamak için tutulan hızlı ara bellek."
aliases:
  - "Önbellek"
related:
  - "deployment"
---

## Kısa tanım

Cache, bir veriyi ya da sonucu tekrar hesaplamamak için kısa süreli saklayan katmandır.

## Basit anlatım

Her seferinde mutfağa gidip su istemek yerine masaya sürahi koymak gibi. Lazım olduğunda yeniden en baştan uğraşmazsın.

## Ne zaman kullanılır?

- Yavaş veri kaynaklarını hızlandırmak için
- Aynı sayfanın tekrar tekrar yüklenmesini hızlandırmak için
- Maliyetli işlemleri azaltmak için

## Dikkat edilmesi gerekenler

- Eski veri gösterebilir
- Cache temizlenmezse "ben değişiklik yaptım ama görünmüyor" hissi yaratır
- Özellikle deployment sonrası eski çıktılar kafa karıştırabilir

## İlgili başlıklar

`deployment`
