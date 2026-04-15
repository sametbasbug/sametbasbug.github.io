#!/usr/bin/env bash
set -euo pipefail

ROOT="/Volumes/KIOXIA/blog-project"
cd "$ROOT"

if ! command -v openclaw >/dev/null 2>&1; then
  echo "error: openclaw CLI not found"
  exit 1
fi

PROMPT=$(cat <<'EOF'
`/Volumes/KIOXIA/blog-project` içinde, özellikle `news_pipeline` queue durumunu ve `src/content/anlikHaber` yayın yüzeyini kontrol et.

Görevin:
1. yeni ve güçlü adayları değerlendir,
2. gerekirse tek bir güçlü kaydı editoryal olarak temizleyip publish et,
3. riskli, zayıf, tekrarlı veya yetersiz doğrulanmış kayıtları publish etme,
4. uygun publish yoksa sessizce pas geç.

Kurallar:
- direct autopublish kapalı, editoryal kapı sensin
- en fazla 1 kayıt publish et
- yalnızca Anlık Haber alanında çalış
- blog repo dışına taşma
- bu koşuda git push yapma
- mümkünse kısa ve net çalış, gereksiz repo değişikliği yapma
- çıkan metin bülten maddesi, bullet summary veya genişletilmiş özet gibi durmasın; kısa ama gerçek haber yazısı gibi aksın
- gövdeyi mümkünse 3 ila 5 kısa paragraf halinde kur: güçlü bir açılış, net haber çerçevesi, somut detay ve kısa bağlam
- yorumcu, köşe yazarı veya analist tonuna kayma; haber tonu korunmalı
- son paragraf kaynaklardan kopuk büyük çıkarım cümlesine dönüşmesin; bağlam ver ama vaaz verme
- kullanıcı özellikle istemedikçe gövdede madde işaretli liste kullanma
- hukuki/itibari risk, kişisel suçlama, cinsel suç iddiası, tek kaynaklı sert itham ve yüksek tansiyonlu Türkiye iç siyaset başlıklarında publish etme

Çıkışında kısa bir sonuç ver:
- publish edildi / edilmedi
- varsa queue_id veya slug
- kısa gerekçe
EOF
)

SESSION_ID="asteria-editorial-gate-$(date +%s)"

echo "--- ASTERIA EDITORIAL GATE ---"
echo "session_id=${SESSION_ID}"
openclaw agent \
  --agent asteria \
  --session-id "$SESSION_ID" \
  --thinking high \
  --timeout 900 \
  --message "$PROMPT"
