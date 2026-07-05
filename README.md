# Samet Başbuğ Blog

[![Astro](https://img.shields.io/badge/Astro-6.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github&logoColor=white)](https://pages.github.com)
[![Site](https://img.shields.io/badge/Live-sametbasbug.dev-0a66ff)](https://sametbasbug.dev)

Astro tabanlı, içerik odaklı ve Firebase destekli kişisel blog altyapısı.

Bu repo, <https://sametbasbug.dev> sitesinin kaynak kodunu içerir. Blog yazıları, sözlük yapısı ve Firebase destekli topluluk etkileşim katmanı aynı projede birleşir.

## Kısa özet

- **Canlı site:** <https://sametbasbug.dev>
- **Stack:** Astro, Firebase Auth, Firestore, GitHub Pages
- **Odak:** blog + sözlük + topluluk etkileşimi
- **İçerik modeli:** Markdown tabanlı yayın akışı ve content collections
- **Deploy:** GitHub Actions üzerinden otomatik yayın

## Özellikler

### İçerik tarafı
- Blog yazıları
- Etiketleme ve yazar sayfaları
- Teknik sözlük sistemi
- İçerik içinde otomatik glossary linkleme

### Topluluk tarafı
- Google ile giriş
- Firebase tabanlı yorum sistemi
- Beğeni sistemi
- Profil ve kullanıcı adı yönetimi
- Admin onay akışına uygun yorum moderasyonu

## Hızlı başlangıç

```bash
npm install
cp .env.example .env
npm run dev
```

Gerekli environment değişkenlerini doldurduktan sonra uygulama varsayılan olarak `http://localhost:4321` üzerinde açılır.

## Proje yapısı

```text
/
├── public/                     # Statik varlıklar
├── src/
│   ├── components/             # Arayüz bileşenleri
│   ├── content/
│   │   ├── blog/               # Blog yazıları
│   │   └── sozluk/             # Sözlük maddeleri
│   ├── data/                   # Yardımcı veri dosyaları
│   ├── layouts/                # Layout bileşenleri
│   ├── pages/                  # Sayfalar ve route'lar
│   └── firebase.js             # Firebase istemci yapılandırması
├── .github/workflows/          # CI / deploy tanımları
├── .env.example                # Ortam değişkeni şablonu
├── astro.config.mjs
└── package.json
```

## Komutlar

- `npm run dev` → lokal geliştirme sunucusunu başlatır
- `npm run build` → production build alır
- `npm run preview` → build çıktısını lokal önizler
- `npm run astro -- --help` → Astro CLI yardımını gösterir

## İçerik modeli

Bu repo iki temel içerik koleksiyonu kullanır:

- **`blog`** → ana blog yazıları
- **`sozluk`** → teknik terim ve kavram açıklamaları

## Lisans

Bu repodaki **kaynak kod**, `LICENSE` dosyasında yer alan **MIT License** kapsamında lisanslanmıştır.

Ancak aşağıdaki unsurlar MIT lisansının kapsamında değildir ve tüm hakları saklıdır:

- blog yazıları ve editoryal içerikler
- görseller, medya dosyaları ve özgün görsel kimlik unsurları
- proje adı, site kimliği ve marka değeri taşıyan özgün içerik katmanları

Detaylar için `CONTENT_LICENSE.md` dosyasına bakılabilir.
