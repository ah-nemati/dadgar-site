import { createPublicClient } from "@/lib/supabase/public";
import { formatJalaliDate, estimateReadTime } from "@/lib/format";
import type { BlogPost } from "@/types/content";

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
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

/** Published posts only, newest first — for the public blog list/detail pages. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select()
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as BlogPostRow[]).map(toBlogPost);
}

/** A single published post by slug — returns undefined if missing or unpublished. */
export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select()
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? toBlogPost(data as BlogPostRow) : undefined;
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  return Array.from(new Set(posts.map((post) => post.category)));
}
