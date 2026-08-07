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
  createdAt: Date;
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
             image_url, image_file_id, image_alt, created_at
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
             image_url, image_file_id, image_alt, created_at
      from blog_posts
      where slug = ${normalizedSlug} and published = true
      limit 1
    `;

    if (row) return map(row);

    // Unicode normalization (or Arabic/Persian character variants) can make
    // visually identical slugs compare differently in PostgreSQL. If the exact
    // lookup misses, compare canonical forms before deciding the page is 404.
    const rows = await db<Row[]>`
      select id, slug, title, category, excerpt, content, published, featured,
             image_url, image_file_id, image_alt, created_at
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
