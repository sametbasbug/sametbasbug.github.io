---
title: "docker compose up"
description: "Tanımlı container servislerini birlikte başlatır."
category: "komutlar-ve-araclar"
summary: "Birden fazla servisi tek komutla ayağa kaldıran Docker komutu."
aliases:
  - "docker-compose up"
related:
  - "backend"
---

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

## İlgili başlıklar

`backend`
