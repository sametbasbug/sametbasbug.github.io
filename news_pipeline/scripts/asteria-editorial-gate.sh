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
root = Path('/Volumes/KIOXIA/blog-project/src/content/anlikHaber')
files = sorted(root.glob('*.md'), key=lambda p: p.stat().st_mtime, reverse=True)[:8]
source_re = re.compile(r'^\s*- name: "?(.*?)"?\s*$')
out = []
for path in files:
    source = '-'
    for line in path.read_text(encoding='utf-8').splitlines():
        m = source_re.match(line)
        if m:
            source = m.group(1)
            break
    out.append(f"- {path.stem}: {source}")
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
- bu koşuda git push yapma
- mümkünse kısa ve net çalış, gereksiz repo değişikliği yapma
- çıkan metin bülten maddesi, bullet summary veya genişletilmiş özet gibi durmasın; kısa ama gerçek haber yazısı gibi aksın
- gövdeyi mümkünse tercihen 5, gerekirse 4 ila 6 kısa paragraf halinde kur: güçlü bir açılış, net haber çerçevesi, somut detay, ek ayrıntı ve kısa ama organik bağlam
- gerektiğinde metni biraz daha uzun tut; aşırı kısalık yüzünden haber hissi kaybolmasın
- yorumcu, köşe yazarı veya analist tonuna kayma; haber tonu korunmalı
- "bu gelişme şunu gösteriyor", "haberin ana ağırlığı" veya "bağlam" başlıklı editör notu gibi görünen cümle ve bölümler yazma
- "adım olarak okunuyor", "zeminini hazırlıyor", "arka planını güçlendiriyor" gibi yarı-yorum kapanışlardan kaçın
- son paragraf kaynaklardan kopuk büyük çıkarım cümlesine dönüşmesin; mümkünse ek somut detay, resmi pozisyon, sonraki adım veya etkilenen taraf bilgisiyle bitsin
- kullanıcı özellikle istemedikçe gövdede madde işaretli liste kullanma
- kişisel suçlama, cinsel suç iddiası ve tek kaynaklı sert itham dosyalarında ekstra dikkat göster; ama siyaset başlığını sırf siyaset diye otomatik eleme
- kurumsal karar, yasa, diplomasi, seçim süreci, parlamento, parti, mahkeme veya resmi açıklama eksenli temiz ve çok kaynaklı siyaset haberlerini publish edilebilir aday olarak aktif biçimde değerlendir
- benzer güçte iki aday varsa, son 8 yayında daha az görünen kaynağı açıkça tercih et
- ama TechCrunch dahil hiçbir güçlü kaynağı sırf son dönemde sık kullanıldı diye otomatik dışlama; gerçekten en temiz ve güçlü aday ondaysa kullan
- bir koşuda iki kayıt publish edeceksen mümkünse aynı kaynağa yaslanma; yeterli kalite varsa iki farklı kaynak seç
- son 3 canlı yayının kaynağıyla aynı kaynağa yeniden yaslanacaksan bunun neden daha güçlü aday olduğunu bilinçli olarak değerlendir; otomatik tekrar yapma

Çıkışında kısa bir sonuç ver:
- kaç kayıt publish edildi
- varsa queue_id veya slug listesi
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
