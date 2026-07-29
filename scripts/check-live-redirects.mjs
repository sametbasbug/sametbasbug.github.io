/**
 * Cloudflare bulk redirect listesindeki her kaydı CANLI sitede doğrular.
 *
 * check-redirects.mjs yerel dist/ çıktısına bakar; bu betik ondan sonraki
 * halkayı ölçer: kural açık mı, 301 doğru hedefe mi gidiyor, arada cache
 * kalıntısı var mı. Yeni bir yönlendirme ekledikten veya kuralı açıp
 * kapattıktan sonra çalıştır.
 *
 *   node scripts/check-live-redirects.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const csvPath = path.join(process.cwd(), "cloudflare", "bulk-redirects.csv");
const csv = await readFile(csvPath, "utf8");

// Başlıksız CSV: kaynak,hedef,kod,… (panelin ayrıştırıcısı başlık satırını
// veri sanıyor, o yüzden dosyada bilerek yok.)
const rows = csv
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [source, target] = line.split(",");
    return { source, target };
  });

let ok = 0;
const sorunlu = [];

for (const { source, target } of rows) {
  const res = await fetch(source, { redirect: "manual" });
  const location = res.headers.get("location");

  if (res.status === 301 && location === target) {
    ok++;
  } else {
    sorunlu.push({
      yol: new URL(source).pathname,
      kod: res.status,
      gitti: location ?? "—",
      beklenen: new URL(target).pathname,
      cache: res.headers.get("cf-cache-status") ?? "-",
    });
  }
}

console.log("Canlı yönlendirme kontrolü");
console.log("─".repeat(64));
console.log(`  kayıt       : ${rows.length}`);
console.log(`  doğru 301   : ${ok}`);
console.log(`  SORUNLU     : ${sorunlu.length}`);

for (const s of sorunlu) {
  console.log(`\n  ${s.yol}`);
  console.log(`    ${s.kod} → ${s.gitti}`);
  console.log(`    beklenen: ${s.beklenen}  (cf-cache: ${s.cache})`);
}

// Sorunlu kayıt varsa CI ya da kabuk fark etsin.
process.exit(sorunlu.length === 0 ? 0 : 1);
