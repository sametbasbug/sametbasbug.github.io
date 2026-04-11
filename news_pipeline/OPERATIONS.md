# News Pipeline Operations

Bu dosya günlük kullanım ve ileride cron entegrasyonu için pratik operasyon rehberidir.

## Amaç

Pipeline'ı güvenli ve öngörülebilir biçimde çalıştırmak.

## Önerilen manuel akış

### 1. Topla
```bash
source news_pipeline/.venv/bin/activate
news-pipeline collect
```

### 2. İşle
```bash
news-pipeline process
```

### 3. Önce hassas kuyruğa bak
```bash
news-pipeline queue review
```

### 4. Sonra genel yeni kayıtları tara
```bash
news-pipeline queue list --status new
```

### 5. Gerekli kaydı aç
```bash
news-pipeline queue inspect <QUEUE_ID>
```

### 6. Onayla
```bash
news-pipeline queue approve <QUEUE_ID>
```

### 7. Taslağa çevir
```bash
news-pipeline publish <QUEUE_ID>
```

### 8. Son edit
- `src/content/anlikHaber/_drafts/` altındaki markdown dosyasını gözden geçir
- başlığı keskinleştir
- description'ı rafine et
- gerekiyorsa ikinci/üçüncü kaynak ekle
- ancak sonra canlı içerik klasörüne taşı

---

## Heartbeat için önerilen yaklaşım

Bu pipeline için ilk tercih cron değil, heartbeat akışıdır.

Neden?
- haber akışı tam saat bağımlı değil
- queue kontrolü daha doğal yapılır
- boş turda sessiz kalmak kolaydır
- editoryal karar akışı daha insani kalır

Önerilen heartbeat script'i:

```bash
cd /Volumes/KIOXIA/blog-project && bash news_pipeline/scripts/heartbeat-cycle.sh
```

Script şu adımları çalıştırır:

```bash
news-pipeline collect
news-pipeline process
news-pipeline queue review
news-pipeline queue list --status new
```

Detaylı çalışma notları için:

- `news_pipeline/HEARTBEAT_RUNBOOK.md`

## Neden?

Çünkü:
- düşük kaliteli veya hassas haberler ayıklanmalı
- hukuki risk taşıyan içeriklerde son karar insan gözüyle verilmeli
- rewrite katmanı yararlı ama nihai editör değil
- heartbeat boş turda sessiz kalabilir

---

## Otonom publish modu

Varsayılan mod artık kontrollü **otonom publish açık** çizgisidir.

Bu ne demek?
- Nyx düşük riskli ve temiz adaylarda publish kararı verebilir
- akışın durmaması hedeflenir
- ama `manual-review` ve kırmızı bayraklı kayıtlar kullanıcıya eskale edilir

Detaylı sınırlar için:

- `news_pipeline/AUTONOMOUS_PUBLISH_POLICY.md`

## Manual-review politikası

Şu tip içerikler ayrı dikkat ister:

- dava
- saldırı
- cinsel suç iddiası
- kişisel suçlama
- Epstein benzeri yüksek riskli politik/sosyal dosyalar

Bu içerikleri önce:

```bash
news-pipeline queue review
```

ile aç.

---

## Sağlık kontrolü

Kod değişikliğinden sonra hızlı doğrulama:

```bash
python3 -m compileall news_pipeline/news_pipeline
```

---

## Pratik not

Queue kalabalıklaşırsa önce bunlara bak:

```bash
news-pipeline queue review
news-pipeline queue list --status new
```

Reject etmekten çekinme. Gürültü biriktiren queue, işe yarayan queue değildir.
