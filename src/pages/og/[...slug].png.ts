import type { APIContext } from "astro";
import { getPosts } from "../../lib/posts";
import { renderOg } from "../../lib/og";
import { authors, formatDate, readingTime } from "../../site";

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export async function GET({ props }: APIContext) {
  const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
  const author = authors[post.data.author];

  const png = await renderOg({
    title: post.data.title,
    eyebrow: post.data.tags.length
      ? post.data.tags.map((tag) => `#${tag}`).join("  ")
      : "SAMET BAŞBUĞ · EQUINOX",
    meta: `${author.name} · ${formatDate(post.data.date)} · ${readingTime(post.body ?? "")} dk`,
    cover: post.data.cover,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
