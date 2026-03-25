---
title: "Deployment"
description: "Bir projeyi geliştirme ortamından çıkartıp canlıya alma süreci."
category: "teknik-terimler"
summary: "Kodun gerçek kullanıcıların göreceği ortama taşınması."
aliases:
  - "Deploy"
related:
  - "npm-run-build"
  - "cache"
---

## Kısa tanım

Deployment, projenin yayınlanabilir hale getirilip canlı ortama aktarılmasıdır.

## Basit anlatım

Mutfakta hazırladığın yemeği servis alanına çıkarmak gibi. Tezgâhta duruyorsa hâlâ hazırlık aşamasındadır; masaya gidince gerçek deneyim başlar.

## Ne zaman kullanılır?

- Yeni özellik yayınlarken
- Hata düzeltmesini kullanıcıya ulaştırırken
- İçerik güncellemesini canlı sitede göstermek istediğinde

## Dikkat edilmesi gerekenler

- Build başarılı olsa bile deployment başarısız olabilir
- Canlı ortam değişkenleri geliştirme ortamından farklı olabilir
- Cache yüzünden yeni sürüm hemen görünmeyebilir

## İlgili başlıklar

`npm run build`, `cache`
