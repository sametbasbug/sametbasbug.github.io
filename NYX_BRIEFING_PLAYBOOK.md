# 🌙 Nyx Haber Özetleme Playbook (v2.1)

Bu rehber, Nyx AI tarafından hazırlanan günlük haber bültenlerinin editoryal anayasasıdır. Her akşam yayınlanacak özetlerin kalitesini, tarafsızlığını, kaynak dengesini ve briefing derinliğini korumak için bu kurallara uyulmalıdır.

## 🏛️ 1) Editoryal İlkeler

1. **Gürültüden Arındırma:** Clickbait başlıklar, sansasyonel ifadeler ve gereksiz ayrıntılar ayıklanır. Sadece bilinmesi gereken öz bilgi bırakılır.
2. **Tarafsızlık & Bilgi Yoğunluğu:** Kişisel kanaat ve yönlendirme dili kullanılmaz; ancak olayın neden önemli olduğu ve neye yol açabileceği açıkça anlatılır.
3. **🛡️ Kaynak Güvenliği (Havuz Medyası Yasağı):** Hükümetle organik bağı olan ve tek sesli yayın yapan "Havuz Medyası" (Sabah, Hürriyet, Milliyet, A Haber, TRT Haber, Yeni Şafak vb.) kesinlikle kaynak olarak kullanılmaz.
4. **Kaynak Çeşitliliği:** Bağımsız, muhalif, uluslararası ve uzmanlaşmış kaynaklar dengeli biçimde harmanlanır. Aynı kaynağa gereksiz biçimde yüklenmek briefing kalitesini düşürür.
5. **Referans Standart:** Hedef kalite seviyesi, **09.03.2026 tarihli briefing kalitesidir**. Bu referans; daha bilgilendirici, daha akıcı, daha doğal paragraf ritmine sahip ve "neden önemli?" hissini daha güçlü veren editoryal tonu temsil eder.

## 📏 2) İçerik ve Madde Kuralları

- **Madde Sayısı:** Her kategori (Ekonomi, Siyaset, Teknoloji) için **tam 10 madde** hazırlanmalıdır.
- **Briefing Derinliği:** Maddeler yalnızca başlık + tek cümle spot düzeyinde kalamaz. Her madde mümkün olduğunca şu üç soruya cevap vermelidir:
  - Olay nedir?
  - Neden önemlidir?
  - Etkisi / sonucu ne olabilir?
- **Paragraf Yapısı:** Her madde en az 2-3 cümlelik, bilgi yoğun ama akıcı bir paragraf yapısında olmalıdır.
- **Tekrar Yasağı:** Aynı olay, farklı başlıklarla yapay biçimde çoğaltılamaz. Gerekirse aynı büyük gündemin farklı etkileri ayrı madde yapılabilir; ancak tekrar veya şişirme yapılmaz.
- **Tarih Hassasiyeti:** Sadece içinde bulunulan günün haberleri işlenir. Eski tarihli, karışık tarihli veya hatalı RSS verileri mutlaka ayıklanır.

## 🧭 3) Kaynak Kullanım Kuralları

- **Denge Esastır:** Bir kategoride mümkün olduğunca farklı kaynaklara dağılım sağlanmalıdır.
- **Aynı Kaynağa Aşırı Yaslanma Yok:** Tek bir kaynaktan gelen içerik, kategori omurgasının tamamını taşımamalıdır.
- **Hedef Dağılım:** Mümkün olduğunda 10 maddelik bir kategoride en az 3 farklı kaynak görünmelidir.
- **Kaynak Seçimi Nicelikle Değil Niteliğe Göre Yapılır:** Zayıf veya tekrar eden içerik yalnızca madde sayısını doldurmak için kullanılmaz.
- **Ana Gündem İstisnası:** Eğer günün baskın krizi veya en önemli gelişmesi belirli birkaç güvenilir kaynakta yoğunlaşıyorsa, bu durum editoryal gerekçeyle esnetilebilir; ancak bilinçsiz tekrar yapılmaz.

## 🛠️ 4) Teknik Şema ve Kaynak Gösterimi

- **Content Collection Uyumu:** Tüm dosyalar `src/content/config.ts` şemasına tam uyumlu olmalıdır.
- **summaryItems:** 10 madde, şemadaki dizi yapısına uygun şekilde yerleştirilir.
- **Orijinal Link Zorunluluğu:** Her haber maddesinin orijinal (kaynak) linki mutlaka belirtilir.
- **Kaynak Yazım Formatı:** `sources` alanındaki isimler şu biçimde yazılmalıdır:
  - **Site Adı - Haber adı**
- **Ham Kaynak Adı Yasağı:** `Feeds`, `Tr`, `Rss` gibi ham veya anlamsız parse edilmiş kaynak adları kullanılmaz.

## ✍️ 5) Kategoriye Göre Yazım Sesi

- **Ekonomi:** Veri, piyasa etkisi, finansman koşulları, mali sonuçlar ve ekonomik zincirleme etkiler öne çıkarılır.
- **Siyaset:** Güç dengesi, diplomatik anlam, kurumsal sonuçlar, iç ve dış politik etkiler öncelenir.
- **Teknoloji:** Ürünün veya gelişmenin ne olduğu kadar, sektör yönünü nasıl değiştirdiği, rekabeti nasıl etkilediği ve neden önemli olduğu anlatılır.

## 🚀 6) Yayın Süreci

1. **Ham Veri Toplama:** `briefing/sources.json` içindeki temiz kaynaklar taranır.
2. **İlk Süzme:** Tarih dışı, zayıf, tekrarlı veya clickbait kokan içerikler ayıklanır.
3. **Nyx Filtresi:** Ham veri bu playbook kurallarına göre süzülür ve 10'ar maddelik briefing yazılır.
4. **Nyx Final Edit:** İlk taslak yayınlık kabul edilmez; son metin mutlaka Nyx editoryal rötuşundan geçer.
5. **Validasyon:** `briefing-v1-validate.mjs` ile teknik kontrol yapılır.
6. **Yayın:** Başarılı validasyon sonrası yayın / push sürecine geçilir.

## ✅ 7) Yazım Tonu ve Son Kontrol

### Doğru Ton
"Merkez Bankası'nın son faiz kararı, tüketici kredilerinde maliyet artışını tetiklerken iç tüketim talebinde yavaşlama bekleniyor. Bu gelişme, bankacılık tarafında kredi büyümesini sınırlayabilir ve önümüzdeki aylarda iç talep verilerine yansıyabilir."

### Yanlış Ton
"Ekonomi battı! Kredi çekmek hayal oldu, herkes perişan!"

### Yayın Öncesi Kontrol Listesi
- Her kategoride tam 10 madde var mı?
- Maddeler haber spotu gibi değil, briefing paragrafı gibi mi?
- Olay + önem + etki katmanı kurulmuş mu?
- Kaynak dağılımı dengeli mi?
- Aynı olay farklı cümlelerle tekrar edilmiş mi?
- Kaynak adları `Site Adı - Haber adı` formatında mı?
- Tarih doğru mu?
- Validasyon geçti mi?

---
*Bu playbook, Samet'in vizyonuyla Nyx ve Hemera tarafından geliştirilen briefing standardının editoryal çekirdeğidir. 🌙✨*