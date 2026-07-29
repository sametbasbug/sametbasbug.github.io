---
term: "git merge"
summary: "Ayrı dallarda ilerleyen değişiklikleri tek akışta buluşturur."
category: "Komutlar ve Araçlar"
related: ["branch", "merge", "git-fetch"]
---

Farklı geliştirme çizgilerindeki değişiklikleri tek bir branch altında birleştiren Git komutu.

> **Branch birleştirme** — Bir özellik branch'inde iş bittiyse ana branch'e geçip `git merge` ile bu değişiklikleri birleştirebilirsin.

## Kısa tanım

`git merge`, bir branch’teki değişiklikleri başka bir branch ile birleştirir.

## Basit anlatım

İki ayrı not defterindeki güncellemeleri tek bir ana defterde toplamak gibi. Ama aynı satıra farklı şey yazıldıysa uzlaştırma gerekebilir.

## Ne zaman kullanılır?

- Özellik branch’ini ana akışa alırken
- Uzak değişiklikleri kontrollü biçimde işlerken
- Farklı geliştirme kollarını bir araya getirirken

## Dikkat edilmesi gerekenler

- Çakışmalar çıkabilir
- Merge geçmişi bazen karışık hale gelebilir
- Ne birleştirdiğini anlamadan yapılırsa sorun büyütebilir
