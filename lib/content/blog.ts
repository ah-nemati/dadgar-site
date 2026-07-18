import { BLOG_POSTS } from '@/data/blog-posts';
import type { BlogPost } from '@/types/content';

/**
 * Returns every blog post. Reads from a static array today; swap the body for the
 * future CMS's query in Phase 2 — callers already `await` this.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export async function getBlogCategories(): Promise<string[]> {
  return Array.from(new Set(BLOG_POSTS.map((post) => post.category)));
}
