import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const glossaryDir = path.join(projectRoot, 'src', 'content', 'sozluk');

const SKIP_NODE_TYPES = new Set([
  'heading',
  'link',
  'linkReference',
  'definition',
  'code',
  'inlineCode',
  'yaml',
  'html',
]);

const BLOG_PATH_FRAGMENT = '/src/content/blog/';
const GLOSSARY_PATH_FRAGMENT = '/src/content/sozluk/';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeTerm(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR');
}

function parseFrontmatterBlock(raw = '') {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

function extractQuotedScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["'](.+?)["']\\s*$`, 'm'));
  return match ? match[1].trim() : '';
}

function extractStringList(frontmatter, key) {
  const blockMatch = frontmatter.match(new RegExp(`^${key}:\\s*\\r?\\n([\\s\\S]*?)(?=^\\S|$)`, 'm'));
  if (!blockMatch) return [];

  return blockMatch[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-\s*/, '').replace(/^['"]|['"]$/g, '').trim())
    .filter(Boolean);
}

function loadGlossaryTerms() {
  const files = fs.readdirSync(glossaryDir).filter((name) => name.endsWith('.md') || name.endsWith('.mdx'));
  const deduped = new Map();

  for (const fileName of files) {
    const slug = fileName.replace(/\.(md|mdx)$/i, '');
    const fullPath = path.join(glossaryDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const frontmatter = parseFrontmatterBlock(raw);
    const title = extractQuotedScalar(frontmatter, 'title');
    const aliases = extractStringList(frontmatter, 'aliases');
    const candidates = [title, ...aliases].filter(Boolean);

    for (const candidate of candidates) {
      const normalized = normalizeTerm(candidate);
      if (!normalized || normalized.length < 3) continue;
      if (deduped.has(normalized)) continue;

      deduped.set(normalized, {
        slug,
        label: candidate,
        normalized,
        regex: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(candidate)}(?![\\p{L}\\p{N}-])`, 'giu'),
      });
    }
  }

  return Array.from(deduped.values()).sort((a, b) => b.label.length - a.label.length);
}

const glossaryTerms = loadGlossaryTerms();

function createTextNode(value) {
  return { type: 'text', value };
}

function createGlossaryLinkNode(value, slug) {
  return {
    type: 'link',
    url: `/sozluk/${slug}/`,
    data: {
      hProperties: {
        className: ['glossary-auto-link'],
      },
    },
    children: [createTextNode(value)],
  };
}

function getFrontmatter(file) {
  return file?.data?.astro?.frontmatter || file?.data?.frontmatter || {};
}

function shouldProcessFile(file) {
  const filePath = String(file?.path || file?.history?.[0] || '').replace(/\\/g, '/');
  const frontmatter = getFrontmatter(file);

  if (filePath.includes(GLOSSARY_PATH_FRAGMENT)) return false;
  if (filePath.includes(BLOG_PATH_FRAGMENT)) return true;

  return Boolean(frontmatter?.pubDate);
}

function findNextMatch(text, terms, usedSlugs, excludedTerms, cursor) {
  let bestMatch = null;

  for (const term of terms) {
    if (usedSlugs.has(term.slug)) continue;
    if (excludedTerms.has(term.normalized)) continue;

    term.regex.lastIndex = cursor;
    const match = term.regex.exec(text);
    if (!match) continue;

    const candidate = {
      slug: term.slug,
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    };

    if (!bestMatch || candidate.start < bestMatch.start || (candidate.start === bestMatch.start && candidate.text.length > bestMatch.text.length)) {
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

function linkifyText(value, terms, usedSlugs, excludedTerms) {
  let cursor = 0;
  const nodes = [];
  let changed = false;

  while (cursor < value.length) {
    const match = findNextMatch(value, terms, usedSlugs, excludedTerms, cursor);
    if (!match) break;

    if (match.start > cursor) {
      nodes.push(createTextNode(value.slice(cursor, match.start)));
    }

    nodes.push(createGlossaryLinkNode(match.text, match.slug));
    usedSlugs.add(match.slug);
    cursor = match.end;
    changed = true;
  }

  if (!changed) return null;
  if (cursor < value.length) {
    nodes.push(createTextNode(value.slice(cursor)));
  }

  return nodes;
}

function walkChildren(parent, state) {
  if (!parent || !Array.isArray(parent.children)) return;

  for (let index = 0; index < parent.children.length; index += 1) {
    const node = parent.children[index];
    const skip = state.skip || SKIP_NODE_TYPES.has(node.type);

    if (node.type === 'text' && !skip) {
      const replacement = linkifyText(node.value, state.terms, state.usedSlugs, state.excludedTerms);
      if (replacement) {
        parent.children.splice(index, 1, ...replacement);
        index += replacement.length - 1;
      }
      continue;
    }

    if (Array.isArray(node.children)) {
      walkChildren(node, { ...state, skip });
    }
  }
}

export default function remarkAutoGlossaryLinks() {
  return function transformer(tree, file) {
    if (!shouldProcessFile(file)) return tree;

    const frontmatter = getFrontmatter(file);
    if (frontmatter?.autoGlossaryLinks === false) return tree;

    const excludedTerms = new Set(
      Array.isArray(frontmatter?.autoGlossaryExclude)
        ? frontmatter.autoGlossaryExclude.map((item) => normalizeTerm(item)).filter(Boolean)
        : []
    );

    const usedSlugs = new Set();

    walkChildren(tree, {
      skip: false,
      terms: glossaryTerms,
      usedSlugs,
      excludedTerms,
    });

    return tree;
  };
}
