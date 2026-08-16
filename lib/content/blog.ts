import { db } from '@/lib/db';
import { formatJalaliDate, estimateReadTime } from '@/lib/format';
import { normalizeBlogSlug } from '@/lib/blog-slug';
import type { BlogPost } from '@/types/content';
import { BLOG_POSTS } from '@/data/blog-posts';

interface Row {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  imageUrl: string | null;
  imageFileId: string | null;
  imageAlt: string | null;
  authorName: string | null;
  reviewerName: string | null;
  sourceUrls: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function normalizeSourceUrls(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== 'string') return [];
  const raw = value.trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      // Fall through to PostgreSQL-array/plain-text handling.
    }
  }

  if (raw.startsWith('{') && raw.endsWith('}')) {
    const body = raw.slice(1, -1);
    if (!body) return [];

    const values: string[] = [];
    let current = '';
    let quoted = false;
    let escaped = false;

    for (const char of body) {
      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }
      if (char === '\\' && quoted) {
        escaped = true;
        continue;
      }
      if (char === '"') {
        quoted = !quoted;
        continue;
      }
      if (char === ',' && !quoted) {
        const item = current.trim();
        if (item && item.toUpperCase() !== 'NULL') values.push(item);
        current = '';
        continue;
      }
      current += char;
    }

    const last = current.trim();
    if (last && last.toUpperCase() !== 'NULL') values.push(last);
    return values;
  }

  return raw
    .split(/\r?\n|\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function map(row: Row): BlogPost {
  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    published: row.published,
    featured: row.featured,
    imageUrl: row.imageUrl,
    imageFileId: row.imageFileId,
    imageAlt: row.imageAlt,
    authorName: row.authorName,
    reviewerName: row.reviewerName,
    sourceUrls: normalizeSourceUrls(row.sourceUrls),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    date: formatJalaliDate(row.createdAt.toISOString()),
    readTime: estimateReadTime(row.content),
  };
}

function findFallbackPost(slug: string): BlogPost | undefined {
  const normalized = normalizeBlogSlug(slug);
  return BLOG_POSTS.find(
    (post) => post.published && normalizeBlogSlug(post.slug) === normalized,
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await db<Row[]>`
      select id, slug, title, category, excerpt, content, published, featured,
             image_url, image_file_id, image_alt, author_name, reviewer_name,
             source_urls, seo_title, seo_description, created_at, updated_at
      from blog_posts
      where published = true
      order by featured desc, created_at desc
    `;
    return rows.map(map);
  } catch {
    return BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const normalizedSlug = normalizeBlogSlug(slug);
  if (!normalizedSlug) return undefined;

  try {
    const [row] = await db<Row[]>`
      select id, slug, title, category, excerpt, content, published, featured,
             image_url, image_file_id, image_alt, author_name, reviewer_name,
             source_urls, seo_title, seo_description, created_at, updated_at
      from blog_posts
      where slug = ${normalizedSlug} and published = true
      limit 1
    `;

    if (row) return map(row);

    const rows = await db<Row[]>`
      select id, slug, title, category, excerpt, content, published, featured,
             image_url, image_file_id, image_alt, author_name, reviewer_name,
             source_urls, seo_title, seo_description, created_at, updated_at
      from blog_posts
      where published = true
      order by created_at desc
    `;

    const normalizedRow = rows.find(
      (candidate) => normalizeBlogSlug(candidate.slug) === normalizedSlug,
    );

    return normalizedRow ? map(normalizedRow) : findFallbackPost(normalizedSlug);
  } catch {
    const posts = await getBlogPosts();
    return posts.find(
      (post) => post.published && normalizeBlogSlug(post.slug) === normalizedSlug,
    );
  }
}

export async function getBlogCategories(): Promise<string[]> {
  return Array.from(new Set((await getBlogPosts()).map((post) => post.category)));
}
