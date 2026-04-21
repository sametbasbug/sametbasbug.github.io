import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const HABER_CONTENT_DIR = '/Volumes/KIOXIA/haber-project/src/content/anlikHaber';
const NEWS_SITE_URL = 'https://haber.sametbasbug.dev';
const PAGE_SIZE = 20;
const PANEL_PAGE_SIZE = 10;

export async function getHaberSlugs() {
  const files = await readdir(HABER_CONTENT_DIR, { withFileTypes: true });
  return files
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
    .map((entry) => entry.name.replace(/\.(md|mdx)$/i, ''))
    .sort();
}

export async function getHaberPageNumbers(pageSize: number = PAGE_SIZE) {
  const slugs = await getHaberSlugs();
  const totalPages = Math.max(1, Math.ceil(slugs.length / pageSize));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 2);
}

export function getHaberHomeUrl() {
  return `${NEWS_SITE_URL}/`;
}

export function getHaberArticleUrl(slug: string) {
  return `${NEWS_SITE_URL}/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function getHaberPageUrl(page: number) {
  return page <= 1 ? `${NEWS_SITE_URL}/` : `${NEWS_SITE_URL}/sayfa/${page}/`;
}

export function getHaberPanelUrl(page: number) {
  return page <= 1 ? `${NEWS_SITE_URL}/icerik-paneli/` : `${NEWS_SITE_URL}/icerik-paneli/sayfa/${page}/`;
}

export const HABER_PAGE_SIZE = PAGE_SIZE;
export const HABER_PANEL_PAGE_SIZE = PANEL_PAGE_SIZE;
