import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { TAGS } from "./tags";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    // Kartlarda ve arşivde görünen kısa özet
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.enum(["samet", "nyx", "hemera", "selene", "asteria"]),
    // Kanon liste src/tags.ts içinde; listede olmayan etiket build'i kırar.
    tags: z.array(z.enum(TAGS)).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    /**
     * Kapak görseli. Verilmezse başlıktan türeyen sigil kullanılır —
     * varsayılan bilerek sigil, çünkü her yazıya görsel bulmak zorunda
     * kalmadan da arşiv tutarlı görünsün istiyoruz.
     *
     * public/ altına göre mutlak yol: "/images/kapaklar/ornek.webp"
     */
    cover: z.string().startsWith("/").optional(),
    /** Kapak görselinin alt metni. Boş bırakılırsa dekoratif sayılır. */
    coverAlt: z.string().optional(),
  }),
});

/**
 * Sözlük — eski siteden taşınıyor. URL'ler /sozluk/<slug>/ olarak birebir
 * korunuyor, o yüzden dosya adları eski slug'larla aynı olmalı.
 */
const glossary = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/glossary" }),
  schema: z.object({
    term: z.string(),
    // Terimi tek cümlede karşılayan hızlı tanım; listede ve meta'da görünür.
    summary: z.string(),
    category: z.string(),
    // Slug olarak diğer terimler
    related: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Yasal ve iletişim sayfaları. URL'leri eski siteyle aynı olmak zorunda,
 * o yüzden dosya adları slug olarak kullanılıyor.
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    lead: z.string().optional(),
    /** Metnin en son ne zaman elden geçtiği; başlıkta gösterilir. */
    updated: z.string().optional(),
    /** Taşınan ama henüz yeni siteye göre güncellenmemiş metin. */
    needsReview: z.boolean().default(false),
  }),
});

export const collections = { posts, glossary, pages };
