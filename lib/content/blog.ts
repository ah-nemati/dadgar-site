import { db } from '@/lib/db';
import { formatJalaliDate, estimateReadTime } from '@/lib/format';
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
  try {
    const [row] = await db<Row[]>`
      select id, slug, title, category, excerpt, content, published, featured,
             image_url, image_file_id, image_alt, created_at
      from blog_posts
      where slug = ${slug} and published = true
      limit 1
    `;
    return row ? map(row) : BLOG_POSTS.find((post) => post.slug === slug && post.published);
  } catch {
    return BLOG_POSTS.find((post) => post.slug === slug && post.published);
  }
}

export async function getBlogCategories(): Promise<string[]> {
  return Array.from(new Set((await getBlogPosts()).map((post) => post.category)));
}
