import { getCollection, type CollectionEntry } from "astro:content";

export type Term = CollectionEntry<"glossary">;

/** Yayınlanmış terimler, alfabetik. Taslaklar yalnızca geliştirmede görünür. */
export async function getGlossary(): Promise<Term[]> {
  const terms = await getCollection("glossary", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return terms.sort((a, b) => a.data.term.localeCompare(b.data.term, "tr"));
}

/** Kategoriye göre gruplanmış liste; kategoriler de alfabetik. */
export function glossaryByCategory(terms: Term[]): [string, Term[]][] {
  const groups = new Map<string, Term[]>();
  for (const term of terms) {
    const key = term.data.category;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(term);
  }
  return [...groups].sort((a, b) => a[0].localeCompare(b[0], "tr"));
}

/** related alanındaki slug'ları gerçek kayıtlara çevirir; bulunamayanı atar. */
export function relatedTerms(term: Term, all: Term[]): Term[] {
  const index = new Map(all.map((entry) => [entry.id, entry]));
  return term.data.related
    .map((slug) => index.get(slug))
    .filter((entry): entry is Term => Boolean(entry));
}
