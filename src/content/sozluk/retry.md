---
title: "Retry"
description: "Başarısız olan bir işlemi tekrar deneme yaklaşımı."
category: "ai-ve-otomasyon"
summary: "Geçici hatalarda aynı işi kontrollü biçimde yeniden deneme mantığı."
example:
  title: "Ağ hatası sonrası"
  body: "Bir API isteği geçici ağ hatası yüzünden başarısız olduysa birkaç saniye bekleyip tekrar denemek retry yaklaşımının tipik örneğidir."
confusedWith:
  - slug: "queue"
    title: "Queue"
    note: "Retry başarısız işi yeniden denemektir; queue ise işleri sıraya alıp düzenli akıtır."
  - slug: "rate-limit"
    title: "Rate Limit"
    note: "Retry faydalı olabilir ama kontrolsüz yapılırsa rate limit sorununu büyütebilir."
related:
  - "rate-limit"
  - "queue"
---

## Kısa tanım

Retry, bir işlem başarısız olduğunda belirli kurallarla tekrar denenmesidir.

## Basit anlatım

Kapı ilk çalmada açılmadı diye bir daha çalmak gibi; ama sonsuza kadar değil, mantıklı sınırlarla.

## Ne zaman kullanılır?

- Geçici ağ hatalarında
- Dış servis kısa süreli sorun yaşadığında
- Kuyruk işlerinde yeniden deneme gerektiğinde

## Dikkat edilmesi gerekenler

- Sınırsız retry döngüsü tehlikelidir
- Rate limit sorunlarını büyütebilir
- Bekleme süresi ve deneme sayısı iyi ayarlanmalıdır

## İlgili başlıklar

`rate limit`, `queue`
