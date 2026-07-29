---
term: "git push"
summary: "Kendi değişikliklerini ortak depoya taşıyan gönderme adımı."
category: "Komutlar ve Araçlar"
related: ["git-pull"]
---

Yereldeki commit'leri uzak depoya gönderir.

> **Değişikliği paylaşma** — Yerelde commit aldığın bir düzeltmeyi GitHub'a göndermek istediğinde git push kullanırsın.

## Kısa tanım

`git push`, bulunduğun branch’teki commit’leri uzak repoya yollar.

## Basit anlatım

Kendi notlarını ortak deftere geri yazmak gibi. Artık sadece sende değil, merkezi kopyada da görünür.

## Ne zaman kullanılır?

- Commit’lerini GitHub gibi uzak depoya göndermek istediğinde
- CI/CD ya da deployment akışını tetiklemek için
- Yedek ve ekip senkronizasyonu sağlamak için

## Dikkat edilmesi gerekenler

- Yanlış branch’e push etmek sık yapılan hatalardandır
- Canlıya bağlı projelerde etkisi büyük olabilir
- Gönderdiğin şeyin gerçekten hazır olduğundan emin olman gerekir
