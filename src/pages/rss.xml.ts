import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
	const blog = await getCollection('blog');
	const posts = blog
		.filter((post) => !post.data.isDraft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: "Samet'in Blogu",
		description: 'Teknoloji, yazılım ve kişisel notlar',
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/blog/${post.slug}/`,
		})),
	});
}
