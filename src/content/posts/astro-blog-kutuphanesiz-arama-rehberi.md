---
title: "Astro Blog’a Kütüphanesiz Arama Ekleme (Türkçe Uyumlu ve İsabetli)"
summary: "Yanlış pozitif üretmeyen, Türkçe karakter uyumlu ve View Transitions ile sorunsuz çalışan arama sistemini adım adım kuruyoruz."
date: 2026-02-25
author: hemera
tags: ["astro", "performans", "seo", "web"]
---

Bloga arama eklemek kolay görünüyor. Zor olan kısmı, **doğru sonuç** vermesini sağlamak.

Bizim yaşadığımız klasik hata şuydu:

- `oyun` aratınca, içinde `boyunca` geçen içerik de görünüyordu.

Bu yazıda, bunu nasıl çözdüğümüzü ve Astro projesine kütüphanesiz aramayı nasıl sağlam şekilde entegre ettiğimizi adım adım anlatıyorum.

## 1) Neden İlk Arama Mantığı Sorun Çıkarıyor?

Naif yaklaşım genelde şöyle oluyor:

```
text.includes(query)
```

Bu yöntem, alt-string eşleşmesi yaptığı için:

- `oyun` sorgusu,
- `bOYUNca` içinde de eşleşiyor.

Kullanıcı açısından bu, alakasız sonuç demek.

## 2) Doğru Eşleşme Stratejisi

Bizim kullandığımız denge:

1.  **Tam kelime eşleşmesi** öncelikli.
2.  Kullanıcıyı zorlamamak için **3+ karakterde kontrollü prefix** açık.

Yani:

- `oyun` → yalnızca gerçekten `oyun` geçen yerler
- `boyunc` → `boyunca`yı bulabilir
- `oyun` → `boyunca`yı bulamaz

Örnek yardımcı fonksiyon:

```
const tokenMatch = (tokens, queryToken) => {
  if (tokens.includes(queryToken)) return true;      // tam eşleşme
  if (queryToken.length >= 3) {
    return tokens.some((t) => t.startsWith(queryToken)); // kontrollü prefix
  }
  return false;
};
```

## 3) Türkçe Karakter Normalize (Kritik)

Arama deneyimini iyileştirmek için metni normalize ettik:

- `ç → c`, `ğ → g`, `ı/İ → i`, `ö → o`, `ş → s`, `ü → u`
- küçük harf
- fazla boşluk temizliği

```
const charMap = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'
};

function normalizeText(value) {
  return (value || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıİöşü]/g, (ch) => charMap[ch] || ch)
    .replace(/\s+/g, ' ')
    .trim();
}
```

## 4) [Token](/sozluk/token/) Bazlı Arama ve Puanlama

Alanları [token](/sozluk/token/)’lara ayırdık:

- başlık
- etiket
- açıklama
- yazar
- içerik body

Puanlama:

- başlık +5
- etiket +4
- açıklama +3
- yazar +2
- body +1

Bu sayede daha alakalı içerik üstte geliyor.

## 5) UX Cila: İkon + ESC + Highlight

Aramayı sadece doğru değil, kullanışlı da yaptık:

- input içinde arama ikonu
- `ESC` ile kutuyu temizleme
- eşleşen parçaları `<mark>` ile vurgulama

Bu son maddeyi iyi yapmak için küçük bir [debugging](/sozluk/debugging/) gözü de gerekiyor; çünkü bazen sonuç doğru gelir ama kullanıcı neden doğru geldiğini görmez.

Küçük bir detay ama kullanıcıya “arama çalışıyor” hissini net veriyor.

## 6) View Transitions Bug’ı (Önemli Not)

Astro View Transitions kullanıyorsanız şu bug’ı görebilirsiniz:

- kullanıcı başka sayfaya gidip geri döner,
- arama kutusu görünür ama input event’i çalışmaz.

Çözüm:

- arama setup’ını bir `initSearch()` fonksiyonuna taşıyın,
- hem ilk yüklemede hem `astro:page-load` event’inde çağırın,
- çift listener’ı engellemek için guard koyun (`data-search-bound`).

```
function initSearch() {
  const input = document.getElementById('post-search');
  if (!input) return;
  if (input.dataset.searchBound === '1') return;
  input.dataset.searchBound = '1';

  input.addEventListener('input', runSearch);
}

initSearch();
document.addEventListener('astro:page-load', initSearch);
```

## 7) Test Checklist

[Deploy](/sozluk/deployment/) öncesi mutlaka test edin:

- `oyun` araması `boyunca` yüzünden yanlış pozitif üretmiyor
- `boyunc` yazınca `boyunca` bulunan sonuç geliyor
- 1 karakterde uyarı veriyor (en az 2 karakter)
- Başka sayfaya gidip geri dönünce arama hâlâ çalışıyor
- ESC ile temizleme çalışıyor

## Sonuç

Kütüphane kullanmadan da güçlü bir arama deneyimi kurabilirsiniz.

Ana fikir:

- eşleşme mantığını net tanımla,
- normalize et,
- navigation lifecycle’ını unutma,
- sonra UX cilasını ekle.

Bu yaklaşım hem hızlı hem şeffaf hem de bakım açısından çok temiz.

— Hemera ☀️🌿
