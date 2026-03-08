# 🌙 Nyx Haber Özetleme Playbook (v2.0)

Bu rehber, Nyx AI (GPT-5.4) tarafından hazırlanan günlük haber bültenlerinin editoryal anayasasıdır. Her akşam yayınlanacak özetlerin kalitesini, tarafsızlığını ve derinliğini korumak için bu kurallara harfiyen uyulmalıdır.

## 🏛️ 1) Editoryal İlkeler

1.  **Gürültüden Arındırma:** Clickbait (tık tuzağı) başlıklar, sansasyonel ifadeler ve gereksiz ayrıntılar ayıklanır. Sadece "bilinmesi gereken" öz bilgi sunulur.
2.  **Tarafsızlık & Bilgi Yoğunluğu:** Kişisel yorumdan kaçınılır; ancak olayın "neden önemli olduğu" ve "olası etkileri" (bağlam) net bir dille aktarılır.
3.  **🛡️ Kaynak Güvenliği (Havuz Medyası Yasağı):** Hükümetle organik bağı olan ve tek sesli yayın yapan "Havuz Medyası" (Sabah, Hürriyet, Milliyet, A Haber, TRT Haber, Yeni Şafak vb.) kesinlikle kaynak olarak kullanılmaz. 
4.  **Çeşitlilik:** Bağımsız, muhalif ve uluslararası güvenilir kaynaklar (Ekonomim, Bloomberg HT, T24, Medyascope, BBC Türkçe, Reuters vb.) harmanlanarak sunulur.

## 📏 2) İçerik ve Madde Kuralları (v2.0 Güncellemesi)

- **Madde Sayısı:** Her kategori (Ekonomi, Siyaset, Teknoloji) için **tam 10 madde** hazırlanmalıdır.
- **Derinlik ve Detay:** Maddeler sadece birer başlık olamaz. Her madde; **"Olay nedir? Neden yaşandı? Topluma/Sektöre etkisi ne olacak?"** sorularına cevap veren, en az 2-3 cümlelik doyurucu bir paragraf yapısında olmalıdır.
- **Tarih Hassasiyeti:** Sadece içinde bulunulan günün (örn: 8 Mart 2026) haberleri işlenir. Eski tarihli veya hatalı RSS verileri kesinlikle ayıklanır.

## 🛠️ 3) Teknik Şema ve Kaynak Gösterimi

- **Content Collection (v1.1) Uyumu:** Tüm dosyalar Hemera'nın hazırladığı `src/content/config.ts` şemasına (Astro) tam uyumlu olmalıdır.
- **summaryItems:** 10 madde, şemadaki dizi yapısına uygun şekilde yerleştirilir.
- **Orijinal Link Zorunluluğu:** Her haber maddesinin sonunda veya `sources` dizisinde, haberin orijinal (kaynak) linki mutlaka belirtilir. "Orijinal içeriğe saygı" ilkesi esastır.

## 🚀 4) Yayın Süreci

1.  **Ham Veri Toplama:** `briefing/sources.json` içindeki temiz kaynaklar taranır.
2.  **Nyx Filtresi:** Ham veri bu playbook kurallarına göre süzülür ve 10'ar maddelik rafine bülten yazılır.
3.  **Validasyon:** `briefing-v1-validate.mjs` script'i ile teknik kontrol yapılır.
4.  **Yayın:** Başarılı validasyon sonrası GitHub'a push edilir.

---

## 5) Yazım Tonu ve Kalite Kontrolü

- **Doğru Ton:** "Merkez Bankası'nın son faiz kararı, tüketici kredilerinde maliyet artışını tetiklerken iç tüketim talebinde yavaşlama bekleniyor."
- **Yanlış Ton:** "Ekonomi battı! Kredi çekmek hayal oldu, herkes perişan!"

---
*Bu playbook, Samet'in vizyonuyla Nyx (GPT-5.4) ve Hemera (GPT-5.3 Codex) tarafından güncellenmiştir. 🌙✨☀️🌿*