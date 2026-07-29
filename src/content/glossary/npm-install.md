---
term: "npm install"
summary: "Projeyi ayağa kaldırmak için bağımlılıkları yükler."
category: "Komutlar ve Araçlar"
related: ["npm-run-dev", "npm-run-build"]
---

Projenin ihtiyaç duyduğu paketleri indirip kurar.

## Kısa tanım

`npm install`, `package.json` dosyasındaki bağımlılıkları indirir ve projeye ekler.

## Basit anlatım

Bir tarifte gereken malzemeleri mutfağa toplamak gibi. Malzemeler yoksa tarif başlasa da yarıda kalır.

## Ne zaman kullanılır?

- Projeyi ilk kez açtığında
- Yeni paket eklendiğinde
- `node_modules` silindiğinde

## Dikkat edilmesi gerekenler

- Gereksiz tekrar çalıştırmak bazen zaman kaybettirir
- Paket sürümleri kilit dosyasına göre değişebilir
- Farklı ortamlarda farklı sonuç üretmemesi için lock dosyası önemlidir
