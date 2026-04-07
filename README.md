# Samet Başbuğ Blog

[![Astro](https://img.shields.io/badge/Astro-6.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github&logoColor=white)](https://pages.github.com)
[![Site](https://img.shields.io/badge/Live-sametbasbug.dev-0a66ff)](https://sametbasbug.dev)

Astro tabanlı, içerik odaklı ve AI destekli kişisel yayın altyapısı.

Modern bir kişisel blogdan fazlası, yaşayan bir yayın sistemi.

Bu repo, <https://sametbasbug.dev> sitesinin kaynak kodunu içerir. Blog yazıları, günlük bülten akışı, sözlük yapısı ve Firebase destekli topluluk etkileşim katmanı aynı projede birleşir.

## Kısa özet

- **Canlı site:** <https://sametbasbug.dev>
- **Stack:** Astro, Firebase Auth, Firestore, GitHub Pages
- **Odak:** blog + günlük briefing + sözlük + topluluk etkileşimi
- **İçerik modeli:** Markdown tabanlı yayın akışı, content collections, editoryal otomasyon
- **Deploy:** GitHub Actions üzerinden otomatik yayın

## Öne çıkanlar

- Hızlı, sade ve statik ön yüz mimarisi
- Markdown tabanlı blog yayın akışı
- Günlük briefing / bülten üretim hattı
- Sözlük sistemi ve içerik içi otomatik kavram linkleme
- Firebase destekli giriş, yorum ve beğeni altyapısı
- GitHub Actions ile otomatik build ve deploy

## Canlı site

**Website:** <https://sametbasbug.dev>

## Neden dikkat çekici?

Bu repo, klasik bir kişisel blog temasından ibaret değil. İçerik üretimi, editoryal düzen, AI destekli briefing akışı ve topluluk etkileşimi aynı kod tabanında birleşiyor.

Yani mesele sadece yazı yayınlamak değil, yaşayan bir yayın sistemi kurmak.

## Bu proje ne yapıyor?

Bu repo klasik bir kişisel blogdan biraz daha fazlası.

İçinde şunlar birlikte çalışır:
- **Blog altyapısı** → uzun form içerikler ve editoryal yazılar
- **Günlük özet sistemi** → ekonomi, siyaset ve teknoloji için düzenli briefing üretimi
- **Sözlük katmanı** → teknik kavramlar için açıklayıcı içerik ağı
- **Topluluk özellikleri** → kullanıcı girişi, yorumlar, beğeniler ve profil akışı

Kısacası bu repo, içerik üretimi, editoryal düzen ve topluluk etkileşimini tek çatı altında topluyor.

## Teknoloji yığını

- **Framework:** Astro
- **Dil:** JavaScript / TypeScript
- **İçerik sistemi:** Markdown, Astro Content Collections
- **Backend servisleri:** Firebase Auth, Firestore
- **Dağıtım:** GitHub Pages
- **Otomasyon:** GitHub Actions, briefing scriptleri

## Özellikler

### İçerik tarafı
- Blog yazıları
- Günlük bülten / briefing akışı
- Etiketleme ve yazar sayfaları
- Teknik sözlük sistemi
- İçerik içinde otomatik glossary linkleme

### Topluluk tarafı
- Google ile giriş
- Firebase tabanlı yorum sistemi
- Beğeni sistemi
- Profil ve kullanıcı adı yönetimi
- Admin onay akışına uygun yorum moderasyonu

### Operasyon tarafı
- İçerik üretim scriptleri
- Validasyon raporları
- CI odaklı briefing akışı
- GitHub Pages deploy pipeline'ı

## Öne çıkan yetenekler

### 01. Hızlı yayın akışı
Yeni içerikler Markdown tabanlı yapı üzerinden doğrudan repo içinde yönetilir. Bu sayede yazı üretimi, düzenleme ve yayınlama süreci gereksiz panel karmaşasına düşmez.

### 02. Günlük briefing sistemi
Proje sadece blog yazısı yayınlamaz, aynı zamanda ekonomi, siyaset ve teknoloji için düzenli briefing üretim hattı içerir. Taslak, validasyon ve raporlama adımları aynı repo içinde yönetilir.

### 03. Topluluk etkileşimi
Firebase tabanlı giriş, yorum ve beğeni sistemi sayesinde site statik görünse de tek yönlü değildir. Okur etkileşimi doğrudan ürünün parçasıdır.

### 04. Sözlük destekli içerik ağı
Teknik kavramlar yalnız ayrı sayfalarda durmaz, içeriklerin içine de bağlanır. Böylece site zamanla kendi bağlamsal bilgi ağını kurar.

### 05. Hafif ama yaşayan mimari
Astro'nun statik gücü korunurken, gerektiği yerde dinamik katmanlar eklenir. Yani proje ya kuru bir içerik vitrini ya da gereksiz şişmiş bir uygulama olmadan aradaki iyi noktayı yakalar.

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
├── scripts/                    # Briefing ve içerik otomasyon scriptleri
├── briefing/                   # Günlük briefing çalışma klasörleri
├── src/
│   ├── components/             # Arayüz bileşenleri
│   ├── content/
│   │   ├── blog/               # Blog yazıları
│   │   ├── gunlukOzet/         # Günlük özet içerikleri
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

## Lokal kurulum

Lokal kurulum için temel akış yukarıdaki hızlı başlangıç bölümündeki gibidir.

Ek olarak:
- `.env.example` dosyasını baz al
- Firebase değişkenlerini eksiksiz gir
- deploy ortamında aynı değerleri GitHub Actions secret olarak tanımla

## Ortam değişkenleri

Bu proje istemci tarafında Firebase kullandığı için Astro kuralları gereği değişkenler `PUBLIC_` ile başlar.

Gerekli değişkenler:

```env
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=
PUBLIC_CONTACT_FORM_URL=
```

> `.env` dosyası repoya girmez. Canlı ortamda bu değerler GitHub Actions secrets üzerinden sağlanmalıdır.

## Komutlar

### Temel geliştirme

- `npm run dev` → lokal geliştirme sunucusunu başlatır
- `npm run build` → production build alır
- `npm run preview` → build çıktısını lokal önizler
- `npm run astro -- --help` → Astro CLI yardımını gösterir

### İçerik ve briefing akışı

- `npm run ozet:new -- --category ekonomi` → günlük özet şablonu oluşturur
- `npm run briefing:v1` → briefing hazırlık akışını başlatır
- `npm run briefing:v1:draft` → ilk taslağı üretir
- `npm run briefing:v1:validate` → briefing içeriğini doğrular
- `npm run briefing:v1:report` → doğrulama raporu üretir
- `npm run briefing:v1:run -- --date YYYY-MM-DD` → prepare + draft + validate akışını çalıştırır
- `npm run briefing:v1:run:ci -- --date YYYY-MM-DD` → CI odaklı briefing akışı çalıştırır

## Deploy

Site, GitHub Actions üzerinden build edilip GitHub Pages'e yayınlanır.

Deploy pipeline'ı için gerekli GitHub Actions secret'ları:

- `PUBLIC_CONTACT_FORM_URL`
- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

GitHub yolu:

**Repository Settings → Secrets and variables → Actions**

## İçerik modeli

Bu repo üç temel içerik koleksiyonu kullanır:

- **`blog`** → ana blog yazıları
- **`gunlukOzet`** → günlük briefing / özet içerikleri
- **`sozluk`** → teknik terim ve kavram açıklamaları

Bu yapı sayesinde içerik, taksonomi ve editoryal otomasyon aynı sistem içinde yönetilir.

## Geliştirme notları

- Firebase yapılandırması `src/firebase.js` içinde `import.meta.env` üzerinden okunur.
- Gerçek ortam değişkenleri `.env` içinde tutulur, repoya girmez.
- Deploy ortamında aynı değerler GitHub Actions secret olarak tanımlanmalıdır.
- Küçük içerik ve stil değişikliklerinden sonra her zaman build almak şart değildir; deploy öncesi ihtiyaç bazlı kontrol tercih edilir.
- Briefing akışında editoryal kalite, yalnız script çıktısıyla değil final kontrol ve validasyonla tamamlanmış sayılır.

## Katkı ve bakım

Bu repo şu an kişisel proje omurgasında ilerliyor. Yine de yapısal bir katkı yapılacaksa en güvenli yaklaşım şudur:

- dar ve net değişiklik yap
- içerik, briefing ve deploy akışlarını birlikte düşün
- environment değişkeni gerektiren işlerde `.env.example` dosyasını güncel tut
- canlıya çıkmadan önce GitHub Actions tarafındaki secret eşleşmelerini kontrol et

## Lisans

Bu repo için henüz ayrı bir lisans dosyası tanımlanmadı.
