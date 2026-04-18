#!/usr/bin/env bash
set -euo pipefail

ROOT="/Volumes/KIOXIA/blog-project"
cd "$ROOT"

if ! command -v openclaw >/dev/null 2>&1; then
  echo "error: openclaw CLI not found"
  exit 1
fi

RECENT_SOURCE_CONTEXT=$(news_pipeline/.venv/bin/python - <<'PY'
from pathlib import Path
import re
from collections import Counter

root = Path('/Volumes/KIOXIA/blog-project/src/content/anlikHaber')
files = sorted(root.glob('*.md'), key=lambda p: p.stat().st_mtime, reverse=True)
source_re = re.compile(r'^\s*- name: "?(.*?)"?\s*$')
rows = []
for path in files[:20]:
    source = '-'
    for line in path.read_text(encoding='utf-8').splitlines():
        m = source_re.match(line)
        if m:
            source = m.group(1)
            break
    rows.append((path.stem, source))

last8 = rows[:8]
counts = Counter(source for _, source in rows)

out = []
out.append('Son 8 yayın:')
for slug, source in last8:
    out.append(f"- {slug}: {source}")
out.append('')
out.append('Son 20 yayın kaynak sayımı:')
for source, count in counts.most_common():
    out.append(f"- {source}: {count}")
print('\n'.join(out))
PY
)

PROMPT_TEMPLATE=$(cat <<'EOF'
/Volumes/KIOXIA/blog-project içinde, özellikle news_pipeline queue durumunu ve src/content/anlikHaber yayın yüzeyini kontrol et.

Son 8 canlı yayının kaynak dağılımı:
__RECENT_SOURCE_CONTEXT__

Görevin:
1. yeni ve güçlü adayları değerlendir,
2. yeterli kalite varsa en fazla iki güçlü kaydı editoryal olarak temizleyip publish et,
3. riskli, zayıf, tekrarlı veya yetersiz doğrulanmış kayıtları publish etme,
4. yeterli publish kalitesi yoksa daha az sayıda kayıtla yetin.

Kurallar:
- direct autopublish kapalı, editoryal kapı sensin
- bir koşuda en fazla 2 kayıt publish et
- yalnızca Anlık Haber alanında çalış
- blog repo dışına taşma
- publish sonrası yalnız ilgili `src/content/anlikHaber` ve gerekliyse buna yakın `news_pipeline` değişiklikleriyle sınırlı dar kapsamlı git add, commit ve push varsayılan adımdır
- alakasız dosya, geniş repo diff'i, teknik blokaj veya riskli içerik görürsen push yapma; bunlar yoksa publish'i commit/push olmadan bırakma
- mümkünse kısa ve net çalış, gereksiz repo değişikliği yapma
- çıkan metin bülten maddesi, bullet summary veya genişletilmiş özet gibi durmasın; kısa ama gerçek haber yazısı gibi aksın
- gövdeyi mümkünse tercihen 5, gerekirse 4 ila 6 kısa paragraf halinde kur: güçlü bir açılış, net haber çerçevesi, somut detay, ek ayrıntı ve kısa ama organik bağlam
- gerektiğinde metni biraz daha uzun tut; aşırı kısalık yüzünden haber hissi kaybolmasın
- yorumcu, köşe yazarı veya analist tonuna kayma; haber tonu korunmalı
- metni yasak cümlelerden kaçınmaya çalışırken robotikleştirme; doğal ve akıcı Türkçe önceliklidir
- son paragraf kaynaklardan kopuk büyük çıkarım cümlesine dönüşmesin; mümkünse ek somut detay, resmi pozisyon, sonraki adım, zamanlama, etkilenen taraf ya da elde kalan açık soru ile bitsin
- `bu da ... gösteriyor`, `konumunu daha da güçlendirebilir`, `yatırımcı ilgisinin sürdüğünü gösteriyor` gibi otomatik kapanış reflekslerinden kaçın; son cümle haberden çıksın, şablondan değil
- opinion, review, hands-on veya birinci tekil deneyim ağırlıklı kaynakları düz haber gibi sertleştirme; gerekiyorsa tonu buna göre yumuşat ya da adayı ele
- editör notu gibi duran meta bölümlerden kaçın ama haber akışını boğacak kadar negatif kurala saplanma
- kullanıcı özellikle istemedikçe gövdede madde işaretli liste kullanma
- kişisel suçlama, cinsel suç iddiası ve tek kaynaklı sert itham dosyalarında ekstra dikkat göster; ama siyaset başlığını sırf siyaset diye otomatik eleme
- kurumsal karar, yasa, diplomasi, seçim süreci, parlamento, parti, mahkeme veya resmi açıklama eksenli temiz ve çok kaynaklı siyaset haberlerini publish edilebilir aday olarak aktif biçimde değerlendir
- benzer güçte iki aday varsa, son 20 yayında daha az görünen kaynağı açıkça tercih et
- son 20 yayında açık biçimde baskınlaşmış bir kaynağa yeniden yaslanacaksan, bunun neden bariz biçimde daha güçlü aday olduğunu bilinçli olarak değerlendir; küçük kalite farkı için aynı kaynağa dönme
- ama TechCrunch dahil hiçbir güçlü kaynağı sırf son dönemde sık kullanıldı diye otomatik dışlama; gerçekten açık ara en temiz ve güçlü aday ondaysa kullan
- bir koşuda iki kayıt publish edeceksen mümkünse aynı kaynağa yaslanma; yeterli kalite varsa iki farklı kaynak seç
- son 3 canlı yayının kaynağıyla aynı kaynağa yeniden yaslanacaksan bunu istisna say ve ancak belirgin kalite farkı varsa yap

Çıkışında kısa bir sonuç ver:
- kaç kayıt publish edildi
- varsa queue_id veya slug listesi
- commit/push yapıldıysa kısa hash veya özet, yapılmadıysa neden yapılmadığı
- kısa gerekçe
EOF
)

PROMPT=${PROMPT_TEMPLATE/__RECENT_SOURCE_CONTEXT__/$RECENT_SOURCE_CONTEXT}

SESSION_ID="asteria-editorial-gate-$(date +%s)"

echo "--- ASTERIA EDITORIAL GATE ---"
echo "session_id=${SESSION_ID}"
openclaw agent \
  --agent asteria \
  --session-id "$SESSION_ID" \
  --thinking high \
  --timeout 900 \
  --message "$PROMPT"
