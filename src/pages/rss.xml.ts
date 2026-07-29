import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
import { site, authors } from "../site";

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    customData: `<language>tr</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/yazi/${post.id}/`,
      categories: [...post.data.tags],
      author: authors[post.data.author].name,
    })),
  });
}
