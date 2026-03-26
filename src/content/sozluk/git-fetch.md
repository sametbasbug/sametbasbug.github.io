---
title: "git fetch"
description: "Uzak repodaki son değişiklikleri indirip yerel kayıtlarını güncelleyen ama çalışma alanına uygulamayan Git komutu."
category: "komutlar-ve-araclar"
summary: "Güncellemeleri sessizce getirir, hemen çalışma alanına dokunmaz."
related:
  - "git-pull"
  - "branch"
  - "merge"
example:
  title: "Temkinli güncelleme"
  body: "Önce `git fetch` yapıp sonra nelerin değiştiğine bakmak, değişiklikleri doğrudan çalışma alanına çekmeden önce daha güvenli bir ara adım sağlar."
confusedWith:
  - slug: "git-pull"
    title: "git pull"
    note: "git fetch veriyi indirir ama hemen birleştirmez; git pull ise genelde indirip uygulamaya da çalışır."
---

## Kısa tanım

`git fetch`, uzak depodaki güncel veriyi alır ama mevcut branch'e hemen işlemez.

## Basit anlatım

Kargoyu kapıya kadar getirtip kutuyu hemen açmamak gibi. Önce ne geldiğini görür, sonra uygulayıp uygulamayacağına karar verirsin.

## Ne zaman kullanılır?

- Değişiklikleri kontrollü görmek istediğinde
- Hemen merge yapmak istemediğinde
- Uzak branch'lerde neler olduğunu incelemek istediğinde

## Dikkat edilmesi gerekenler

- Fetch yapmak tek başına çalışma dosyalarını güncellemez
- Sonrasında karşılaştırma veya merge adımı gerekebilir
- Uzakta ne değiştiğini anlamadan ilerlemek hâlâ risk taşır

## İlgili başlıklar

`git pull`, `branch`, `merge`
