import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Astro 6 için loader eklendi

const blog = defineCollection({
	// type: 'content' kaldırıldı, yerine dosyaların yolunu gösteren loader eklendi
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
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
	// type: 'content' kaldırıldı, yerine loader eklendi
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/gunlukOzet" }),
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

const sozluk = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/sozluk" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(['teknik-terimler', 'komutlar-ve-araclar', 'ai-ve-otomasyon']),
		summary: z.string(),
		aliases: z.array(z.string()).optional(),
		related: z.array(z.string()).optional(),
		example: z.object({
			title: z.string().optional(),
			body: z.string(),
		}).optional(),
		confusedWith: z.array(z.object({
			slug: z.string(),
			title: z.string(),
			note: z.string(),
		})).optional(),
		isDraft: z.boolean().optional(),
	}),
});

export const collections = { blog, gunlukOzet, sozluk };