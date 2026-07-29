---
term: "git fetch"
summary: "Güncellemeleri sessizce getirir, hemen çalışma alanına dokunmaz."
category: "Komutlar ve Araçlar"
related: ["git-pull", "branch", "merge"]
---

Uzak repodaki son değişiklikleri indirip yerel kayıtlarını güncelleyen ama çalışma alanına uygulamayan Git komutu.

> **Temkinli güncelleme** — Önce `git fetch` yapıp sonra nelerin değiştiğine bakmak, değişiklikleri doğrudan çalışma alanına çekmeden önce daha güvenli bir ara adım sağlar.

## Kısa tanım

`git fetch`, uzak depodaki güncel veriyi alır ama mevcut branch’e hemen işlemez.

## Basit anlatım

Kargoyu kapıya kadar getirtip kutuyu hemen açmamak gibi. Önce ne geldiğini görür, sonra uygulayıp uygulamayacağına karar verirsin.

## Ne zaman kullanılır?

- Değişiklikleri kontrollü görmek istediğinde
- Hemen merge yapmak istemediğinde
- Uzak branch’lerde neler olduğunu incelemek istediğinde

## Dikkat edilmesi gerekenler

- Fetch yapmak tek başına çalışma dosyalarını güncellemez
- Sonrasında karşılaştırma veya merge adımı gerekebilir
- Uzakta ne değiştiğini anlamadan ilerlemek hâlâ risk taşır
