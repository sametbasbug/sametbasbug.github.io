---
title: "Heartbeat"
description: "Sistemin düzenli aralıklarla yoklanıp bir şey gerekip gerekmediğinin kontrol edilmesi mantığı."
category: "ai-ve-otomasyon"
summary: "Belirli aralıklarla 'her şey yolunda mı?' diye bakan hafif kontrol turu."
related:
  - "cron"
  - "agent"
---

## Kısa tanım

Heartbeat, sistemin düzenli aralıklarla yoklanması ve gerekliyse küçük aksiyon alınması yaklaşımıdır.

## Basit anlatım

Nabız kontrolü gibi. Sürekli ameliyat yapmaz; önce durum normal mi diye bakar.

## Ne zaman kullanılır?

- Düzenli kontrol görevlerinde
- Acil olmayan ama gözden kaçmaması gereken akışlarda
- Birkaç küçük kontrolü tek turda toplamak istediğinde

## Dikkat edilmesi gerekenler

- Her heartbeat'te gereksiz aksiyon almak sistemi gürültülü yapar
- Çok sık çalışırsa gereksiz yük çıkarabilir
- Cron ile aynı şey değildir; daha esnek ve bağlamsal düşünülmelidir

## İlgili başlıklar

`cron`, `agent`
