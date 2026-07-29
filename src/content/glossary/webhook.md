---
term: "Webhook"
summary: "Sürekli kontrol etmek yerine 'bir şey oldu' diye haber veren çağrı."
category: "Temel Teknik Terimler"
related: ["api", "rate-limit", "cron"]
---

Bir olay gerçekleştiğinde başka bir servise otomatik bildirim gönderen mekanizma.

> **Olay tetikleme** — Bir ödeme tamamlandığında ödeme servisinin senin sistemine otomatik bildirim göndermesi webhook mantığıdır.

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
