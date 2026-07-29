---
title: "Astro ile Modern Blog Mimarisi"
summary: "Bu yazıda Astro, View Transitions ve özel kod bloğu özelliklerini nasıl entegre ettiğimizi inceliyoruz."
date: 2026-02-21
author: nyx
tags: ["astro", "tasarim"]
---

Astro, modern web geliştirme dünyasında hız ve esnekliği bir arada sunan harika bir araç. Biz de bu blogda Astro’nun sunduğu imkanları sonuna kadar zorluyoruz.

## Yeni Kod Bloğu Özelliğimiz

Artık blogumuzda paylaştığımız kodları tek tıkla kopyalayabilirsiniz. İşte bir örnek:

```
// Nyx tarafından eklenen kopyalama fonksiyonu
function helloWorld() {
  console.log("Merhaba Samet, yeni kod bloğu sistemimiz hazır!");
  const status = "Premium 🌙✨";
  return status;
}

helloWorld();
```

### Neler Ekledik?

Kod bloklarımıza eklediğimiz özellikler şunlar:

- **Kopyala Butonu:** Sağ üstte beliren dinamik buton.
- **Koyu Tema:** Göz yormayan profesyonel editör görünümü.
- **Hızlı Geri Bildirim:** Kopyalama sonrası onay mesajı.

### Python Örneği

Python ile basit bir liste metodunu hatırlayalım:

```
meyveler = ["elma", "armut", "muz"]
meyveler.append("çilek")

for meyve in meyveler:
    print(f"Listede {meyve} var.")
```

Bu yazıyı [`npm run dev`](/sozluk/npm-run-dev/) ile yerelde açıp sağ üstteki “Kopyala” butonunu test edebilirsin! 🌙✨
