---
term: "CI/CD"
summary: "Kodun kontrolden yayına daha düzenli akmasını sağlayan otomasyon hattı."
category: "Komutlar ve Araçlar"
related: ["build-pipeline", "deployment", "staging"]
---

Kod değişikliklerini test etme, doğrulama ve yayınlama süreçlerini otomatikleştiren geliştirme yaklaşımı.

> **Otomatik yayın hattı** — Bir commit geldiğinde testlerin çalışması ve her şey yolundaysa sitenin otomatik deploy edilmesi tipik CI/CD akışıdır.

## Kısa tanım

CI/CD, kod değişikliklerini otomatik test ve dağıtım adımlarıyla yöneten süreç yaklaşımıdır.

## Basit anlatım

Mutfağa giren her tabağın kalite kontrolden geçip sonra servise çıkması gibi. Amaç hız değil; güvenli ve düzenli akıştır.

## Ne zaman kullanılır?

- Ekipte düzenli deploy yapılıyorsa
- Hata riskini azaltmak istiyorsan
- Tekrarlayan test ve yayın işlerini otomatikleştirmek istediğinde

## Dikkat edilmesi gerekenler

- Yanlış kurulan otomasyon hatayı da otomatik yayabilir
- Süreç görünürlüğü ve log takibi önemlidir
- Küçük projelerde bile basit ama anlaşılır kurgu daha değerlidir
