#!/usr/bin/env node
/**
 * src/redirects.ts içindeki haritayı Cloudflare'in beklediği biçimlere çevirir.
 *
 *   node scripts/cloudflare-redirects.mjs
 *
 * İki dosya üretir:
 *   cloudflare/bulk-redirects.csv  → Bulk Redirects listesine yüklenir
 *   cloudflare/redirect-rules.md   → panelde yapılacak adımlar
 *
 * Bütün adresler tek bir listeye giriyor ve tek bir Bulk Redirect Rule ile
 * devreye alınıyor. Wildcard'lı Single Redirect Rules yaklaşımı bırakıldı:
 * ücretsiz planda 10 kural kotasının tamamını yiyordu, oysa Bulk Redirects
 * kotası 5 liste / 10.000 kayıt.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { redirects, postSlugs } from "../src/redirects.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "cloudflare");
const ORIGIN = "https://sametbasbug.dev";

const entries = [
  ...Object.entries(redirects),
  // RSS akışı haritada değil (Astro trailingSlash'ı hedefe de ekliyordu),
  // ama Cloudflare tarafında sorun değil — buradan doğru kurulabiliyor.
  ["/blog/feed/", "/rss.xml"],
];

/* ---------------------------------------------------------------- CSV --- */

// Başlık satırı YOK: panelin sürükle-bırak ayrıştırıcısı onu atlamıyor,
// "source,target" diye bir yönlendirme kaydı olarak ekliyor. Kolon sırası
// source, target, status, preserve_query_string, include_subdomains,
// subpath_matching, preserve_path_suffix.
const csv = entries
  .map(([from, to]) => `${ORIGIN}${from},${ORIGIN}${to},301,false,false,false,false`)
  .join("\n");

/* -------------------------------------------------------------- Rules --- */

const rules = `# Cloudflare — yönlendirmelerin kurulumu

${entries.length} adresin tamamı tek bir **Bulk Redirect List** içinde ve tek bir
**Bulk Redirect Rule** ile devreye giriyor. Panelde elle kural yazılmıyor;
kaynak \`bulk-redirects.csv\`.

Neden böyle: ücretsiz planda Single Redirect Rules kotası 10 kural. Önceki
kurulumda wildcard'larla o kotanın tamamı doluydu ve yeni bir yönlendirme
eklemek imkânsızdı. Bulk Redirects kotası ise 5 liste / 10.000 kayıt —
${entries.length} adres yanında ciddi bir pay.

## Şu anki durum

Kurulum yapıldı. Panelde duran:

- Liste \`sametbasbug_2026_gecis\` — ${entries.length} kayıt
- Kural \`Eski URL yonlendirmeleri 2026\` — listeye bağlı, **kapalı**

Eski wildcard'lı Single Redirect Rules silindi; o kota (10) tamamen boş.
Geriye kalan tek iş: **3. adım**, yani kuralı doğru anda açmak.

---

## 1. Listeyi oluştur

**Rules → Settings → Bulk Redirects → Create Bulk Redirect List**

- Ad: \`sametbasbug_2026_gecis\`
- \`bulk-redirects.csv\` dosyasını sürükle-bırak ile yükle

Dosyada **başlık satırı yok**, bilerek: panelin ayrıştırıcısı başlığı
atlamıyor, \`source → target\` diye sahte bir kayıt olarak ekliyor.

Listeler hesap seviyesinde yaşıyor; aynı hesaptaki bütün alan adları
aynı listeyi görür.

## 2. Kuralı oluştur

Liste kaydedildikten sonra aynı sayfada **Create Bulk Redirect Rule**.
Listeyi seç, kural adını ver, **"Save and Deploy" değil "Save as Draft"**
düğmesine bas. Draft kural kapalı doğar; yanlış anda trafiğe girmez.

## 3. Sırayı bozma

Kuralı yalnızca yeni site yayına girdikten sonra aç. Aksi hâlde eski
adresler var olmayan hedeflere 301 verir ve yazılar erişilemez olur.
Bu bir kere yaşandı.

\`\`\`bash
# Önce hedefler ayakta mı?
for p in /yazilar/ /hakkinda/ /yazi/bu-blog-nasil-calisiyor/; do
  printf '%-40s %s\\n' "\$p" "\$(curl -sS -o /dev/null -w '%{http_code}' ${ORIGIN}\$p)"
done
\`\`\`

Üçü de \`200\` verdikten sonra kuralı aç, ardından cache purge et.

## 4. Doğrula

\`\`\`bash
curl -sSI ${ORIGIN}/blog/bu-blog-nasil-calisiyor/ | head -3
curl -sSI ${ORIGIN}/blog/feed/ | head -3
curl -sSI ${ORIGIN}/hakkimda/ | head -3
\`\`\`

Üçü de \`HTTP/2 301\` ve doğru \`location:\` satırı vermeli.

## Astro'nun ürettiği yönlendirme sayfaları ne olacak

Kalıyor. Cloudflare isteği kenarda yakaladığı için o sayfalara hiç
ulaşılmıyor. Bir gün Cloudflare kuralları silinirse meta refresh sayfaları
devreye girer — yedek olarak duruyorlar, çakışmıyorlar.
`;

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "bulk-redirects.csv"), `${csv}\n`, "utf8");
await writeFile(path.join(outDir, "redirect-rules.md"), rules, "utf8");

console.log(`cloudflare/bulk-redirects.csv   ${entries.length} satır (${postSlugs.length} yazı dahil)`);
console.log(`cloudflare/redirect-rules.md    kurulum adımları`);
console.log(`\ntoplam kapsanan: ${entries.length} adres`);
