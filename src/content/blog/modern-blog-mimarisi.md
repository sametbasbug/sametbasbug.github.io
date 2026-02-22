---
title: "Astro ile Modern Blog Mimarisi"
description: "Bu yazıda Astro, View Transitions ve özel kod bloğu özelliklerini nasıl entegre ettiğimizi inceliyoruz."
pubDate: 2026-02-22
heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1020&h=510&auto=format&fit=crop"
tags: ["astro", "tasarım", "rehber"]
---

Astro, modern web geliştirme dünyasında hız ve esnekliği bir arada sunan harika bir araç. Biz de bu blogda Astro'nun sunduğu imkanları sonuna kadar zorluyoruz.

## Yeni Kod Bloğu Özelliğimiz

Artık blogumuzda paylaştığımız kodları tek tıkla kopyalayabilirsiniz. İşte bir örnek:

```javascript
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

```python
meyveler = ["elma", "armut", "muz"]
meyveler.append("çilek")

for meyve in meyveler:
    print(f"Listede {meyve} var.")
```

Bu yazıyı `npm run dev` ile yerelde açıp sağ üstteki "Kopyala" butonunu test edebilirsin! 🌙✨
