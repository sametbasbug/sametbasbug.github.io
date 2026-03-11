# BRIEFING REHBERİ (Samet için)

Bu dosya, günlük haber özeti sistemini **unutmadan ve karışmadan** yönetebilmen için hazırlandı.

---

## 1) Sistem ne yapıyor?

Bu projede 3 kategori için günlük özet üretiyoruz:
- ekonomi
- siyaset
- teknoloji

Özetler şu yapıda yayınlanır:
- `/gunluk-ozet/ekonomi`
- `/gunluk-ozet/siyaset`
- `/gunluk-ozet/teknoloji`

İçerikler burada tutulur:
- `src/content/gunlukOzet/YYYY-MM-DD-kategori.md`

**Önemli ayrım:**
- `BRIEFING_REHBERI.md` = teknik ve operasyonel akış
- `NYX_BRIEFING_PLAYBOOK.md` = editoryal kalite standardı

Yani komutları ve sırayı bu rehber belirler; yazım kalitesini ve briefing standardını playbook belirler.

---

## 2) En önemli komutlar (kısa liste)

### Tek tek komutlar
- `npm run briefing:v1`
  - Günlük çalışma alanını hazırlar (ham veri + Nyx prompt + hedef dosyalar)

- `npm run briefing:v1:draft`
  - `ham-veri.md` dosyasından otomatik ilk taslak özet yazar

- `npm run briefing:v1:validate`
  - Yayın öncesi kalite kontrol yapar

- `npm run briefing:v1:report`
  - Validate sonuçlarını markdown raporuna yazar (`validate-report.md`)

- `npm run build`
  - Site build kontrolü

### Zincir komutlar
- `npm run briefing:v1:run`
  - prepare + draft + validate + build

- `npm run briefing:v1:run:ci`
  - CI odaklı akış: prepare + draft + validate + report + (geçerse build)

### Tek dosya oluşturma
- `npm run ozet:new -- --category ekonomi`
  - Seçilen kategori için günlük özet markdown şablonu oluşturur

---

## 3) Günlük kullanım (önerilen manuel rutin)

## Adım 1) Günü başlat
```bash
npm run briefing:v1 -- --date YYYY-MM-DD
```

Örnek:
```bash
npm run briefing:v1 -- --date 2026-03-08
```

Bu komut şunları hazırlar:
- `briefing/YYYY-MM-DD/ham-veri.md`
- `briefing/YYYY-MM-DD/nyx-prompt.md`
- kategori içerik dosyaları (`src/content/gunlukOzet/...`)

## Adım 2) Ham veriyi doldur
`ham-veri.md` içine gün içindeki haber başlıklarını ekle:
- saat
- başlık
- kısa spot
- link

Örnek satır:
```md
- [18:40] ABD enflasyon verisi açıklandı | Beklenti altı gelince risk iştahı arttı | https://ornek.com/haber
```

### Ham veri toplarken dikkat
- Aynı kaynaktan gereğinden fazla başlık yığma.
- Mümkün olduğunca farklı kaynaklardan veri topla.
- Aynı olayın farklı başlıklarla tekrar eden versiyonlarını erken aşamada ayıkla.
- Zayıf veya sadece dolgu işlevi görecek haberleri sırf 10 maddeyi tamamlamak için taşıma.

## Adım 3) İlk taslağı üret
```bash
npm run briefing:v1:draft -- --date YYYY-MM-DD
```

**Not:** Bu adımın çıktısı yayınlık final metin değildir. Bu yalnızca ilk iskelettir.

## Adım 4) Nyx editör rötuşu
- `nyx-prompt.md` dosyasını Nyx'e ver.
- Nyx, `summaryItems` ve `sources` alanlarını `NYX_BRIEFING_PLAYBOOK.md` talimatlarına göre editoryal olarak güçlendirir.
- Bu aşamada özellikle şunlar kontrol edilir:
  - 09.03.2026 standardına yakın briefing tonu
  - kaynak çeşitliliği ve denge
  - maddelerin olay + önem + etki katmanı taşıması
  - tekrar ve şişirme temizliği
  - `Site Adı - Haber adı` formatında kaynak yazımı

## Adım 5) Kalite kontrol
```bash
npm run briefing:v1:validate -- --date YYYY-MM-DD
```

İstersen daha sert kontrol:
```bash
npm run briefing:v1:validate -- --date YYYY-MM-DD --strict
```

## Adım 6) Rapor al
```bash
npm run briefing:v1:report -- --date YYYY-MM-DD
```

Rapor burada oluşur:
- `briefing/YYYY-MM-DD/validate-report.md`

## Adım 7) Build kontrol
```bash
npm run build
```

---

## 4) Tek komutla çalışma

Eğer hızlı ilerlemek istiyorsan:
```bash
npm run briefing:v1:run -- --date YYYY-MM-DD
```

Bu komut hepsini sırasıyla dener.

Not: Validate fail olursa süreç durur.

**Ama dikkat:** Tek komut zinciri teknik akışı hızlandırır; editoryal kaliteyi garanti eden asıl belge yine `NYX_BRIEFING_PLAYBOOK.md` dosyasıdır.

---

## 5) GitHub Actions (UI üzerinden)

Workflow adı:
- **Briefing V1 Pipeline**

Yol:
- GitHub > Actions > Briefing V1 Pipeline > Run workflow

Inputlar:
- `date` (opsiyonel)
- `run_full` (true/false)
- `strict` (true/false)
- `auto_pr` (true/false)

### Önerilen kullanım
- Sadece hazırlık istiyorsan: `run_full=false`
- Tam pipeline istiyorsan: `run_full=true`
- Sıkı kontrol için: `strict=true`
- Otomatik PR açmak için: `auto_pr=true`

Workflow sonunda artifact gelir:
- `briefing/YYYY-MM-DD/`
- `src/content/gunlukOzet/YYYY-MM-DD-*.md`

PR açılırsa gövdesinde şunlar otomatik görünür:
- validate result
- error sayısı
- warning sayısı

---

## 6) Sık karşılaşılan hatalar ve çözüm

### Hata: `summaryItems sayısı düşük`
Çözüm:
- Her kategoriye tam 10 madde ekle

### Hata: `placeholder metin kalmış`
Çözüm:
- `[Saat] Başlık ...` veya `https://...` örnek satırlarını sil

### Hata: `geçersiz source url`
Çözüm:
- `https://example.com` gibi tam URL kullan

### Hata: kalite zayıf ama validate geçti
Çözüm:
1. Teknik hata yok diye içeriği yayınlık kabul etme
2. `NYX_BRIEFING_PLAYBOOK.md` kurallarına göre tekrar rötuş yap
3. Özellikle kaynak dengesi, briefing tonu ve tekrar kontrolünü yeniden gözden geçir

### Hata: build fail
Çözüm:
1. Önce `validate` çalıştır
2. Raporu oku (`validate-report.md`)
3. İçeriği düzeltip tekrar build al

---

## 7) Hangi durumda hangi komutu kullanayım?

- "Bugünün klasörünü hazırlayayım" → `briefing:v1`
- "Ham veriden otomatik taslak çıkar" → `briefing:v1:draft`
- "Yayın öncesi kontrol" → `briefing:v1:validate`
- "Kontrol raporunu dosyala" → `briefing:v1:report`
- "Hepsini birden çalıştır" → `briefing:v1:run`
- "CI mantığında çalıştır" → `briefing:v1:run:ci`

**Ek not:**
- Teknik sırayı bu rehberden takip et
- Editoryal kalite çıtasını `NYX_BRIEFING_PLAYBOOK.md` belirler

---

## 8) Önerilen pratik

En güvenli günlük akış:
1. `briefing:v1`
2. ham veri doldur
3. `briefing:v1:draft`
4. Nyx rötuş
5. `briefing:v1:validate`
6. `briefing:v1:report`
7. `npm run build`

Bu sırayı takip edersen sürpriz hata ihtimali çok düşer.

**Kısa özet:**
- Draft = iskelet
- Nyx rötuş = kalite
- Validate = teknik temizlik
- Build = yayın öncesi son kapı

---

## 9) Not

Bu rehberi güncel tut. Yeni komut/özellik eklendikçe bu dosyaya 1-2 satır eklemek yeterli.

Eğer editoryal kalite kuralı değişirse, önce `NYX_BRIEFING_PLAYBOOK.md` güncellenmelidir; bu rehber ise o akışın nasıl uygulanacağını anlatır.