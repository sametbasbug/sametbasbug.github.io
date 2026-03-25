---
title: "Rate Limit"
description: "Bir servisin, kısa sürede atılabilecek istek sayısına koyduğu sınır."
category: "teknik-terimler"
summary: "Fazla hızlı istek atınca devreye giren trafik freni."
aliases:
  - "İstek limiti"
related:
  - "api"
  - "webhook"
---

## Kısa tanım

Rate limit, bir API'nin ya da servisin aynı kullanıcıdan belirli sürede kaç istek kabul edeceğini sınırlamasıdır.

## Basit anlatım

Kapıda güvenlik var ve içeri aynı anda çok fazla kişi sokmuyor gibi düşün. Yoksa sistem boğulur.

## Ne zaman karşına çıkar?

- API kullanırken
- Otomasyon akışları çok sık tetiklendiğinde
- Hatalı döngüler aşırı istek ürettiğinde

## Dikkat edilmesi gerekenler

- Aynı hatayı tekrar tekrar denemek hesabı riske atabilir
- 429 gibi hatalar rate limit işareti olabilir
- Bekleme süresi varsa ona saygı göstermek gerekir

## İlgili başlıklar

`API`, `webhook`
