
import { createPublicClient } from '@/lib/supabase/public';
import { formatJalaliDate, estimateReadTime } from '@/lib/format';
import type { BlogPost } from '@/types/content';
import { BLOG_POSTS } from '@/data/blog-posts';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  image_url: string | null;
  image_path: string | null;
  image_alt: string | null;
  created_at: string;
}

function toBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    published: row.published,
    featured: row.featured,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imageAlt: row.image_alt,
    date: formatJalaliDate(row.created_at),
    readTime: estimateReadTime(row.content),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return BLOG_POSTS;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select()
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as BlogPostRow[]).map(toBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured()) return BLOG_POSTS.find((post) => post.slug === slug && post.published);
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select()
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return data ? toBlogPost(data as BlogPostRow) : undefined;
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  return Array.from(new Set(posts.map((post) => post.category)));
}
