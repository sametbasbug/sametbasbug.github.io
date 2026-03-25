---
title: "Merge"
description: "Farklı geliştirme hatlarındaki değişiklikleri birleştirme işlemi."
category: "komutlar-ve-araclar"
summary: "Ayrı kollarda yapılan işi tek akışta buluşturma adımı."
example:
  title: "Özelliği ana dala alma"
  body: "Bir feature branch üzerinde tamamlanan değişiklikleri main dalına katmak için yapılan işlem çoğu zaman merge'dür."
confusedWith:
  - slug: "branch"
    title: "Branch"
    note: "Branch çalışma alanını ayırır; merge ise ayrılmış değişiklikleri yeniden bir araya getirir."
related:
  - "branch"
  - "commit"
---

## Kısa tanım

Merge, bir branch'teki değişiklikleri başka bir branch ile birleştirme işlemidir.

## Basit anlatım

İki ayrı not defterindeki güncellemeleri tek defterde bir araya getirmek gibi.

## Ne zaman kullanılır?

- Özellik branch'ini ana branch'e alırken
- Paralel geliştirmeleri birleştirirken
- Güncel kalmak için değişiklikleri toplarken

## Dikkat edilmesi gerekenler

- Aynı satırlar değiştiyse conflict çıkabilir
- Körlemesine merge yerine ne geldiğini anlamak önemlidir
- Sık senkron kalmak işi kolaylaştırır

## İlgili başlıklar

`branch`, `commit`
