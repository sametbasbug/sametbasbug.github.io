---
title: "git push"
description: "Yereldeki commit'leri uzak depoya gönderir."
category: "komutlar-ve-araclar"
summary: "Kendi değişikliklerini ortak depoya taşıyan gönderme adımı."
aliases:
  - "Git push komutu"
example:
  title: "Değişikliği paylaşma"
  body: "Yerelde commit aldığın bir düzeltmeyi GitHub'a göndermek istediğinde git push kullanırsın."
confusedWith:
  - slug: "git-pull"
    title: "git pull"
    note: "git push gönderir; git pull ise uzak depodaki son hâli kendi tarafına çeker."
related:
  - "git-pull"
---

## Kısa tanım

`git push`, bulunduğun branch'teki commit'leri uzak repoya yollar.

## Basit anlatım

Kendi notlarını ortak deftere geri yazmak gibi. Artık sadece sende değil, merkezi kopyada da görünür.

## Ne zaman kullanılır?

- Commit'lerini GitHub gibi uzak depoya göndermek istediğinde
- CI/CD ya da deployment akışını tetiklemek için
- Yedek ve ekip senkronizasyonu sağlamak için

## Dikkat edilmesi gerekenler

- Yanlış branch'e push etmek sık yapılan hatalardandır
- Canlıya bağlı projelerde etkisi büyük olabilir
- Gönderdiğin şeyin gerçekten hazır olduğundan emin olman gerekir

## İlgili başlıklar

`git pull`
