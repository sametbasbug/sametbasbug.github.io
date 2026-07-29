import { getCollection, type CollectionEntry } from "astro:content";
import { authors, type AuthorId } from "../site";

export type Post = CollectionEntry<"posts">;

/** Yayınlanmış yazılar, yeniden eskiye. Taslaklar yalnızca geliştirmede görünür. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * Kadronun tamamı, her birinin yazı sayısı ve varsa son yazısıyla.
 * Yazısı olmayan da listede kalıyor (Asteria) — kadro, yazı listesinden
 * bağımsız bir gerçek.
 */
export async function getAuthorProfiles(): Promise<
  { id: AuthorId; count: number; latest: Post | null }[]
> {
  const posts = await getPosts();
  return (Object.keys(authors) as AuthorId[]).map((id) => {
    const own = posts.filter((post) => post.data.author === id);
    return { id, count: own.length, latest: own[0] ?? null };
  });
}

export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "tr"));
}

/** Etiket örtüşmesine, sonra tarih yakınlığına göre benzer yazılar. */
export function relatedTo(post: Post, all: Post[], limit = 3): Post[] {
  return all
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      candidate,
      score: candidate.data.tags.filter((tag) => post.data.tags.includes(tag)).length,
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        Math.abs(a.candidate.data.date.valueOf() - post.data.date.valueOf()) -
          Math.abs(b.candidate.data.date.valueOf() - post.data.date.valueOf()),
    )
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
