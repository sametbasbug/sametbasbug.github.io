---
title: "git rebase"
description: "Bir branch'teki commit geçmişini başka bir temel üzerine yeniden oturtan Git işlemi."
category: "komutlar-ve-araclar"
summary: "Değişiklik geçmişini daha düz bir akışta yeniden dizen Git yaklaşımı."
related:
  - "git-merge"
  - "branch"
example:
  title: "Temiz geçmiş"
  body: "Özellik branch'ini güncel ana branch üzerine yeniden oturtmak için `git rebase` kullanılabilir."
confusedWith:
  - slug: "git-merge"
    title: "git merge"
    note: "git merge geçmişi olduğu gibi birleştirir; git rebase ise commit'leri yeni bir temel üzerine yeniden yazar."
---

## Kısa tanım

`git rebase`, bir branch'in commit'lerini başka bir branch'in güncel noktası üzerine yeniden uygular.

## Basit anlatım

Dağınık yazılmış notları aynı fikirle ama daha düzgün sırayla yeniden temize çekmek gibi.

## Ne zaman kullanılır?

- Daha temiz bir commit geçmişi istediğinde
- Özellik branch'ini güncel ana akışla hizalarken
- Merge öncesi tarihi sadeleştirmek istediğinde

## Dikkat edilmesi gerekenler

- Paylaşılmış geçmişte dikkatsiz rebase sorun yaratabilir
- Geçmişi yeniden yazdığı için temkin ister
- Ne yaptığını bilmeden kullanılırsa kafa karıştırabilir

## İlgili başlıklar

`git merge`, `branch`
