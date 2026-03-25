---
title: "Session"
description: "Bir etkileşim akışının bağlamını ve geçmişini taşıyan çalışma oturumu."
category: "ai-ve-otomasyon"
summary: "Konuşmanın ya da görev akışının bulunduğu bağlamsal oturum."
related:
  - "agent"
  - "cron"
---

## Kısa tanım

Session, belirli bir sohbetin ya da görevin bağlamını taşıyan oturumdur.

## Basit anlatım

Bir masaya oturup konuşmaya başlamak gibi. O masada konuşulanlar oranın bağlamını oluşturur; başka masaya geçince aynı hafıza otomatik taşınmayabilir.

## Ne zaman önemli olur?

- Bir görevin hangi geçmişle çalıştığını anlamak istediğinde
- Alt oturumlar ya da ayrı iş parçaları kullandığında
- Hatırlama ve bağlam yönetimi önemliyse

## Dikkat edilmesi gerekenler

- Yanlış oturuma gönderilen mesaj kafa karıştırır
- İzole session ile ana session farklı amaçlar taşıyabilir
- Bağlam boyutu ve mahremiyet birlikte düşünülmelidir

## İlgili başlıklar

`agent`, `cron`
