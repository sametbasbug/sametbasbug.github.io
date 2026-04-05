# BRIEFING_SYSTEM.md

Bu dosya, günlük bülten sisteminin **tek ana anayasasıdır**.

Amaç:
- operasyon akışını tek yerde toplamak
- editoryal kaliteyi tek yerde tanımlamak
- cron / izole session / manuel kullanım sırasında kafa karışıklığını azaltmak

---

## 1) Sistem ne üretir?

Her gün 3 kategori için günlük özet hazırlanır:
- ekonomi
- siyaset
- teknoloji

Çıktı dosyaları:
- `src/content/gunlukOzet/YYYY-MM-DD-ekonomi.md`
- `src/content/gunlukOzet/YYYY-MM-DD-siyaset.md`
- `src/content/gunlukOzet/YYYY-MM-DD-teknoloji.md`

Hazırlık klasörü:
- `briefing/YYYY-MM-DD/`

Ana çalışma dosyaları:
- `briefing/YYYY-MM-DD/ham-veri.md`
- `briefing/YYYY-MM-DD/nyx-prompt.md`
- `briefing/YYYY-MM-DD/validate-report.md`

---

## 2) Tek cümlelik iş tanımı

Önce temiz kaynak havuzundan ham veri toplanır; sonra taslak üretilir; sonra Nyx final edit yapılır; en sonda teknik validasyon geçmeden briefing tamamlanmış sayılmaz.

---

## 3) En önemli ilke

**Draft final değildir.**

`briefing:v1:draft` yalnızca iskelet üretir.
Yayınlık kalite, ancak Nyx final edit + validate sonrası oluşur.

Bir briefing şu üç koşul birlikte sağlanmadan **tamamlandı** sayılmaz:
1. üç kategori dosyası gerçekten yazılmış olacak
2. içerikler editoryal olarak final hale gelmiş olacak
3. validate başarılı geçmiş olacak

---

## 4) Editoryal ilkeler

1. **Gürültüden arındırma:** Clickbait, gereksiz tekrar, magazinleşme ve boş dramatizasyon ayıklanır.
2. **Bilgi yoğunluğu:** Her madde yalnız başlık özeti değil, olay + önem + olası etki katmanı taşımalıdır.
3. **Tarafsız ton:** Kişisel kanaat, slogan dili ve manipülatif çerçeve kullanılmaz.
4. **Tarih disiplini:** Yalnız günün haberleri işlenir.
5. **Kategori sesi korunur:**
   - ekonomi → piyasa, maliyet, finansman, zincirleme ekonomik etki
   - siyaset → güç dengesi, diplomatik anlam, kurumsal sonuç
   - teknoloji → ürün/gelişme + sektör yönü + rekabet / altyapı etkisi
6. **Havuz medyası yasağı:** Sabah, Hürriyet, Milliyet, A Haber, TRT Haber, Yeni Şafak vb. briefing kaynağı olarak kullanılmaz.
7. **Referans kalite:** Hedef seviye 09.03.2026 briefing standardıdır.

---

## 5) Madde kuralları

Her kategori için:
- **tam 10 madde** olacak
- her madde **2-3 cümlelik briefing paragrafı** olacak
- mümkünse şu üç soruya cevap verecek:
  - olay nedir?
  - neden önemlidir?
  - etkisi ne olabilir?

Yasaklar:
- tek cümlelik yüzeysel spot dili
- aynı olayın farklı cümlelerle şişirilmesi
- sırf sayıyı doldurmak için zayıf haber eklemek
- teyitsiz ya da spekülatif bilgi üretmek

---

## 6) Kaynak kuralları — sert sürüm

Bu bölüm artık öneri değil, **çekirdek kalite kuralıdır**.

Her kategori için:
- **en az 5 farklı kaynak** görünmeli
- **tek bir kaynaktan maksimum 3 haber** kullanılabilir
- ideal hedef: tek kaynaktan en fazla 2 haber
- aynı kaynağa yaslanarak 10 madde doldurmak briefing kalitesini düşürür ve kabul edilmez

Ek kurallar:
- `sources` alanındaki isimler mutlaka şu formatta yazılır:
  - `Site Adı - Haber adı`
- `Feeds`, `Tr`, `Rss` gibi ham/bozuk kaynak adları yasaktır
- mümkün olduğunda yerli + uluslararası + uzmanlaşmış kaynak dengesi kurulmalıdır
- kaynak havuzu zayıfsa briefing bunu **dürüstçe belirtmeli**, ama düşük kaliteyi gizlememelidir

Önemli karar:
> Kaynak çeşitliliği sağlanamıyorsa briefing teknik olarak yazılmış olsa bile editoryal olarak tamamlanmış sayılmaz.

---

## 7) Kaynak havuzu politikası

Ana havuz dosyası:
- `briefing/sources.json`

Havuz bakım ilkeleri:
- ölü / 403 / çalışmayan feed’ler düzenli temizlenir
- aynı çizgide birbirini kopyalayan kaynaklar gereksiz yere çoğaltılmaz
- her kategori için kaynak sayısı kadar **çalışabilirlik** de önemlidir
- mümkünse her kategoride hem Türkçe hem uluslararası omurga bulunur

---

## 8) Teknik şema kuralları

Dosyalar `src/content.config.ts` şemasına uymalıdır.

Zorunlular:
- `summaryItems` → 10 madde
- `sources` → geçerli URL içeren kaynak listesi
- placeholder kalmayacak
- tarih doğru olacak

---

## 9) Günlük operasyon akışı

### Adım 1 — hazırlık
```bash
npm run briefing:v1 -- --date YYYY-MM-DD
```

### Adım 2 — ham veriyi doldur
`briefing/YYYY-MM-DD/ham-veri.md`

Ham veri satırı örneği:
```md
- [18:40] Başlık | Kısa spot | https://example.com/haber
```

### Adım 3 — taslak üret
```bash
npm run briefing:v1:draft -- --date YYYY-MM-DD
```

### Adım 4 — Nyx final edit
Bu aşamada:
- 10 madde tam olacak
- kaynak yoğunlaşması temizlenecek
- briefing tonu güçlendirilecek
- `Site Adı - Haber adı` formatı düzeltilecek

### Adım 5 — validasyon
```bash
npm run briefing:v1:validate -- --date YYYY-MM-DD
```

Daha sert kontrol:
```bash
npm run briefing:v1:validate -- --date YYYY-MM-DD --strict
```

### Adım 6 — rapor
```bash
npm run briefing:v1:report -- --date YYYY-MM-DD
```

### Adım 7 — build (yalnız gerekirse)
```bash
npm run build
```

---

## 10) Cron / otomasyon kuralı

Cron ya da izole session şu sırayı izlemeli:
1. bu dosyayı oku
2. ham veriyi oluştur / doldur
3. draft üret
4. final edit yap
5. validate + report çalıştır
6. ancak bundan sonra özet ver

**Kritik kural:**
- Final içerik dosyaları yazılmadan ve validate başarılı geçmeden
  - “tamamlandı” denmez
  - “ilerliyorum, birazdan biter” gibi erken zafer özeti verilmez
- Süreç yarım kalırsa açıkça:
  - `tamamlanmadı`
  - `şu aşamada kaldı`
  - `şu hata oluştu`
  şeklinde rapor verilir

---

## 11) Validasyon beklentisi

Validator en az şunları kontrol etmelidir:
- 10 madde var mı?
- placeholder kaldı mı?
- URL’ler geçerli mi?
- kaynak adı formatı doğru mu?
- aynı kaynak 3’ü aşıyor mu?
- farklı kaynak sayısı yeterli mi?

Strict modda kaynak çeşitliliği kuralları daha sert uygulanır.

---

## 12) Hızlı karar tablosu

- "Sadece klasörü hazırlayayım" → `briefing:v1`
- "Ham veriden iskelet çıkar" → `briefing:v1:draft`
- "Yayına hazır mı bak" → `briefing:v1:validate`
- "Raporu dosyala" → `briefing:v1:report`
- "Her şey bitti mi?" → yalnız validate PASS ise evet

---

## 13) Kısa mantra

**Draft iskelet. Nyx edit kalite. Validate son kapı.**

Bu üçlü tamamlanmadan briefing tamamlanmış sayılmaz. 🌙✨
