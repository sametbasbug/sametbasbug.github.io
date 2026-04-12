# Heartbeat Runbook

Bu dosya heartbeat sırasında news pipeline için izlenecek en sade operasyon akışını tanımlar.

## Amaç

Heartbeat tetiklendiğinde tek hedef şudur:
- yeni haberleri içeri almak
- queue'yu güncellemek
- önemli aday varsa kısa özet vermek
- yoksa sessiz kalmak

## Tek komutluk akış

```bash
cd /Volumes/KIOXIA/blog-project && bash news_pipeline/scripts/heartbeat-cycle.sh
```

## Script içinde ne çalışır?

1. `news-pipeline collect`
2. `news-pipeline process`
3. `news-pipeline queue summary`
4. `news-pipeline autopublish --limit 1 --min-score 0.68`
5. `news-pipeline queue review`
6. `news-pipeline queue list --status new`

## Heartbeat karar kuralı

### Kullanıcıya yaz
Yalnız şu durumlardan biri varsa:
- yeni `manual-review` kaydı çıktıysa
- güçlü ve yayınlanabilir yeni aday oluştuysa
- aynı olay birden fazla kaynakla güçlendiyse
- yayınlanmaya değer 1-3 temiz haber belirdiyse

### Sessiz kal
Şu durumlarda `HEARTBEAT_OK`:
- sadece gürültü/tekrar ayıklandıysa
- yeni anlamlı aday yoksa
- yalnız zayıf skorlar geldiyse
- son update çok yakın zamanda verildiyse

## Editoryal yetki

Varsayılan mod: **otonom publish açık**.

Nyx normal akışta şu kararları kendisi verebilir:
- yayınla
- beklet
- reddet

Ama şu durumlarda kullanıcıya danışır:
- hukuki riskli iddialar
- cinsel suç / kişisel suçlama
- tek kaynağa dayalı sert itham
- yüksek riskli Türkiye iç siyaset dosyaları
- itibar riski taşıyan gri alanlar
- `manual-review` işaretli kayıtlar

## Kısa mesaj formatı

Örnek:

- `2 güçlü aday çıktı, 1'i manual-review istiyor.`
- `Yeni yayın adayı: ...`
- `Manual-review kuyruğunda 1 hassas kayıt var.`

Uzun rapor dökme.

## Not

Bu runbook'ta publish kararı Nyx'in editoryal değerlendirmesinden sonra heartbeat içinde gelebilir.
Uygun aday bulunduğunda kayıt doğrudan canlı `src/content/anlikHaber/` klasörüne yazılır.
Ama `manual-review` veya kırmızı bayraklı kayıtlar otomatik publish edilmez.
İlk güvenli modda heartbeat başına en fazla 1 kayıt publish edilir.
