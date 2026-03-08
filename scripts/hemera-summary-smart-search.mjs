/**
 * Hemera Smart Search (summaryItems)
 *
 * Kullanım:
 *   const search = createSummarySmartSearch(summaryItems);
 *   const results = search("ekonomi faiz");
 */

const TR_CHAR_MAP = {
  ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u',
};

function normalizeText(value = '') {
  return String(value)
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıİöşü]/g, (ch) => TR_CHAR_MAP[ch] || ch)
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value = '') {
  return normalizeText(value)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function tokenMatch(tokens, queryToken) {
  if (tokens.includes(queryToken)) return true;
  // 3+ karakterde prefix eşleşme: "eko" -> "ekonomi"
  if (queryToken.length >= 3) return tokens.some((t) => t.startsWith(queryToken));
  return false;
}

/**
 * summaryItems için performanslı arama fonksiyonu üretir.
 * Index bir kez hazırlanır; her sorguda yeniden tokenize edilmez.
 */
export function createSummarySmartSearch(summaryItems = []) {
  const index = summaryItems.map((text, i) => ({
    id: i,
    original: text,
    normalized: normalizeText(text),
    tokens: tokenize(text),
  }));

  return function search(query = '') {
    const q = normalizeText(query);
    if (!q) return index.map((x) => x.original);
    if (q.length < 2) return [];

    const qTokens = tokenize(q);

    const scored = [];

    for (const item of index) {
      let score = 0;
      let allMatched = true;

      for (const qt of qTokens) {
        const inTokens = tokenMatch(item.tokens, qt);
        const inText = item.normalized.includes(qt);

        if (!(inTokens || inText)) {
          allMatched = false;
          break;
        }

        if (inTokens) score += 3;
        if (inText) score += 1;
      }

      if (allMatched) scored.push({ ...item, score });
    }

    scored.sort((a, b) => b.score - a.score || a.id - b.id);
    return scored.map((x) => x.original);
  };
}

/*
Neden bu yöntem?
1) Performans: tokenize/normalize işlemi her aramada değil, index oluşturulurken 1 kez yapılır.
2) Akıllı eşleşme: hem tam token hem prefix (3+ harf) desteklenir; kullanıcı kısmi yazsa da sonuç bulur.
3) Dayanıklılık: Türkçe karakter normalizasyonu ile büyük/küçük harf ve diakritik farklarını tolere eder.
*/
