import { createClient } from '@/lib/supabase/server';
import { formatJalaliDate, estimateReadTime } from '@/lib/format';
import type { BlogPost } from '@/types/content';

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
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
    date: formatJalaliDate(row.created_at),
    readTime: estimateReadTime(row.content),
  };
}

/** Every post — including drafts — newest first. For /admin/blog only. */
export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select().order('created_at', { ascending: false });
  if (error) throw error;
  return (data as BlogPostRow[]).map(toBlogPost);
}

export async function getBlogPostByIdForAdmin(id: number): Promise<BlogPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select().eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toBlogPost(data as BlogPostRow) : undefined;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').insert(input).select().single();
  if (error) throw error;
  return toBlogPost(data as BlogPostRow);
}

export async function updateBlogPost(id: number, input: BlogPostInput): Promise<BlogPost> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').update(input).eq('id', id).select().single();
  if (error) throw error;
  return toBlogPost(data as BlogPostRow);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
}

/** Turns "my title here" into "my-title-here"; also strips characters slugs can't use. */
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
