
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

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select()
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as BlogPostRow[]).map(toBlogPost);
}

export async function getBlogPostByIdForAdmin(id: number): Promise<BlogPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select()
    .eq('id', id)
    .maybeSingle();

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
  featured: boolean;
  imageUrl: string | null;
  imagePath: string | null;
  imageAlt: string | null;
}

function toRow(input: BlogPostInput) {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    excerpt: input.excerpt,
    content: input.content,
    published: input.published,
    featured: input.featured,
    image_url: input.imageUrl,
    image_path: input.imagePath,
    image_alt: input.imageAlt,
  };
}

export async function uploadBlogImage(file: File): Promise<{ path: string; url: string }> {
  if (!file.type.startsWith('image/')) throw new Error('INVALID_IMAGE_TYPE');
  if (file.size > 5 * 1024 * 1024) throw new Error('IMAGE_TOO_LARGE');

  const supabase = await createClient();
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) throw error;
  const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function removeBlogImage(path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from('blog-images').remove([path]);
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(toRow(input))
    .select()
    .single();

  if (error) throw error;
  return toBlogPost(data as BlogPostRow);
}

export async function updateBlogPost(id: number, input: BlogPostInput): Promise<BlogPost> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .update(toRow(input))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toBlogPost(data as BlogPostRow);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('image_path')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;

  if (post?.image_path) {
    await supabase.storage.from('blog-images').remove([post.image_path]);
  }
}

export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
