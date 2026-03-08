import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		isDraft: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const gunlukOzet = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		category: z.enum(['ekonomi', 'siyaset', 'teknoloji']),
		date: z.coerce.date(),
		isDraft: z.boolean().optional(),
		summaryItems: z.array(z.string()).min(1),
		sources: z.array(z.object({
			name: z.string(),
			url: z.string().url(),
		})).optional(),
	}),
});

export const collections = { blog, gunlukOzet };
