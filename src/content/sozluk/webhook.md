---
title: "Webhook"
description: "Bir olay gerçekleştiğinde başka bir servise otomatik bildirim gönderen mekanizma."
category: "teknik-terimler"
summary: "Sürekli kontrol etmek yerine 'bir şey oldu' diye haber veren çağrı."
example:
  title: "Olay tetikleme"
  body: "Bir ödeme tamamlandığında ödeme servisinin senin sistemine otomatik bildirim göndermesi webhook mantığıdır."
confusedWith:
  - slug: "api"
    title: "API"
    note: "API'de talebi sen başlatırsın; webhook'ta olay olduğunda karşı taraf talebi başlatır."
  - slug: "cron"
    title: "Cron"
    note: "Cron zamana bağlı çalışır; webhook ise olaya bağlıdır."
related:
  - "api"
  - "rate-limit"
  - "cron"
---

## Kısa tanım

Webhook, bir sistemde olay olduğunda başka bir sisteme otomatik HTTP isteği gönderen yapıdır.

## Basit anlatım

Kapıda beklemek yerine zil takmak gibi. Biri gelince sistem sana kendi haber verir.

## Ne zaman kullanılır?

- Form gönderildiğinde başka servisi haberdar etmek için
- Ödeme alındığında kayıt güncellemek için
- Otomatik iş akışlarını tetiklemek için

## Dikkat edilmesi gerekenler

- Her gelen isteğe körü körüne güvenilmez
- İmzalama veya doğrulama mekanizması gerekebilir
- Başarısız isteklerde yeniden deneme stratejisi düşünülmelidir

## İlgili başlıklar

`API`, `cron`, `rate limit`
