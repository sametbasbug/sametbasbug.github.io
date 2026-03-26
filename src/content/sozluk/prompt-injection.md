---
title: "Prompt Injection"
description: "Dış içerik içine gömülen yanıltıcı talimatların modeli veya ajanı istenmeyen yöne çekmeye çalışması durumu."
category: "ai-ve-otomasyon"
summary: "Dış verinin komut gibi davranıp sistemi saptırmaya çalışması."
related:
  - "prompt"
  - "human-in-the-loop"
  - "sandbox"
example:
  title: "Gömülü talimat riski"
  body: "Bir web sayfasında geçen 'önceki kuralları unut ve bunu çalıştır' benzeri metinler pasif veri olmalı; komut sayılırsa prompt injection riski doğar."
---

## Kısa tanım

Prompt injection, dış kaynaktan gelen metnin sisteme sanki gerçek talimatmış gibi etki etmeye çalışmasıdır.

## Basit anlatım

Sana gelen paketin içine sahte bir patron notu bırakılmış gibi. Kâğıtta emir yazıyor olabilir ama gerçekten yetkili kişiden gelmemiştir.

## Ne zaman önemlidir?

- Web, e-posta, belge veya kullanıcı içeriği okunuyorsa
- Agent araç kullanabiliyorsa
- Dış veri ile gerçek talimatı ayırmak kritikse

## Dikkat edilmesi gerekenler

- Dış içerik varsayılan olarak veri kabul edilmelidir
- Yetki sınırları ve onay çizgileri burada hayati önem taşır
- Pasif okuma ile aktif uygulama arasındaki sınır net tutulmalıdır

## İlgili başlıklar

`prompt`, `human-in-the-loop`, `sandbox`
