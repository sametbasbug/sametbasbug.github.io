---
title: "git pull"
description: "Uzak depodaki son değişiklikleri alıp mevcut kopyana uygular."
category: "komutlar-ve-araclar"
summary: "Projeyi uzak kaynaktaki güncel hâline yaklaştırır."
aliases:
  - "Git pull komutu"
example:
  title: "Çalışmaya başlamadan önce"
  body: "Başka cihazda veya ekip arkadaşın tarafından yapılan son değişiklikleri almak için çoğu zaman işe git pull ile başlanır."
confusedWith:
  - slug: "git-push"
    title: "git push"
    note: "git pull değişiklik alır; git push kendi değişikliklerini karşı tarafa gönderir."
related:
  - "git-push"
---

## Kısa tanım

`git pull`, uzaktaki repoda yapılan güncellemeleri indirir ve mevcut branch'e uygular.

## Basit anlatım

Ortak bir defterin son halini masana çekmek gibi. Böylece başkalarının eklediği değişiklikler sende de görünür.

## Ne zaman kullanılır?

- Çalışmaya başlamadan önce güncel kalmak için
- Başka cihazda yaptığın değişiklikleri almak için
- Ekip çalışmasında geride kalmamak için

## Dikkat edilmesi gerekenler

- Yerel değişikliklerle çakışma olabilir
- Otomatik merge her zaman temiz olmaz
- Ne çektiğini anlamadan alışkanlıkla çalıştırmak bazen sürpriz üretir

## İlgili başlıklar

`git push`
