---
term: "docker compose up"
summary: "Birden fazla servisi tek komutla ayağa kaldıran Docker komutu."
category: "Komutlar ve Araçlar"
related: ["backend"]
---

Tanımlı container servislerini birlikte başlatır.

## Kısa tanım

`docker compose up`, compose dosyasında tanımlanan servisleri başlatır.

## Basit anlatım

Bir sahnede ışık, ses ve dekoru tek düğmeyle aynı anda açmak gibi.

## Ne zaman kullanılır?

- Veritabanı + uygulama + yardımcı servisleri beraber çalıştırırken
- Yerelde üretime benzer ortam kurarken
- Ekip içinde standart kurulum akışı isterken

## Dikkat edilmesi gerekenler

- Arka planda birçok servis açılabilir
- Port çakışmaları yaşanabilir
- Durdurma ve log takibi tarafı da bilinmelidir
