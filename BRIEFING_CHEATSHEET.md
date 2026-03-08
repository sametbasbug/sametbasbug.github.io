# BRIEFING CHEAT SHEET

## Hızlı Akış (önerilen)
1) `npm run briefing:v1 -- --date YYYY-MM-DD`
2) `briefing/YYYY-MM-DD/ham-veri.md` doldur
3) `npm run briefing:v1:draft -- --date YYYY-MM-DD`
4) Nyx rötuş
5) `npm run briefing:v1:validate -- --date YYYY-MM-DD`
6) `npm run briefing:v1:report -- --date YYYY-MM-DD`
7) `npm run build`

---

## Tek komut seçenekleri
- Full local:
  - `npm run briefing:v1:run -- --date YYYY-MM-DD`
- CI tarzı local (rapor her zaman yazılır):
  - `npm run briefing:v1:run:ci -- --date YYYY-MM-DD`

---

## Komut ne işe yarar?
- `briefing:v1` → günlük klasör + ham veri şablonu + Nyx prompt + hedef dosyalar
- `briefing:v1:draft` → ham veriden ilk taslak summary oluşturur
- `briefing:v1:validate` → kalite kontrol (min 3 madde, geçerli source, placeholder kontrol)
- `briefing:v1:report` → `validate-report.md` üretir
- `build` → yayın öncesi teknik kontrol

---

## Karar Ağacı
- "Sıfırdan güne başlıyorum" → `briefing:v1`
- "Ham veriyi özet taslağa döndür" → `briefing:v1:draft`
- "Yayına hazır mı?" → `briefing:v1:validate`
- "Neden fail oldu görmek istiyorum" → `briefing:v1:report`
- "Uğraşmadan hepsini çalıştır" → `briefing:v1:run`

---

## Sık Hata / Çözüm
- `summaryItems sayısı düşük` → her kategoriye en az 3 madde yaz
- `placeholder metin kalmış` → `[Saat] ...` / `https://...` örneklerini sil
- `geçersiz source url` → tam URL kullan (`https://...`)

---

## GitHub Actions kısa kullanım
Actions > **Briefing V1 Pipeline** > Run workflow
- `run_full=true` → full pipeline
- `strict=true` → daha sert kontrol
- `auto_pr=true` → otomatik PR
