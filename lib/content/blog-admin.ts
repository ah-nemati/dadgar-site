import { db } from '@/lib/db';
import { deleteAsset, updateAssetMetadata, uploadAsset, type AssetMetadata } from '@/lib/storage/imagekit';
import { formatJalaliDate, estimateReadTime } from '@/lib/format';
import type { BlogPost } from '@/types/content';

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

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const rows = await db<Row[]>`
    select id, slug, title, category, excerpt, content, published, featured,
           image_url, image_file_id, image_alt, created_at
    from blog_posts
    order by featured desc, created_at desc
  `;
  return rows.map(map);
}

export async function getBlogPostByIdForAdmin(id: number): Promise<BlogPost | undefined> {
  const [row] = await db<Row[]>`
    select id, slug, title, category, excerpt, content, published, featured,
           image_url, image_file_id, image_alt, created_at
    from blog_posts
    where id = ${id}
    limit 1
  `;
  return row ? map(row) : undefined;
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
  imageFileId: string | null;
  imageAlt: string | null;
}

export interface BlogImageMetadata {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  alt: string | null;
}

function imageMetadata(input: BlogImageMetadata): AssetMetadata {
  const alt = input.alt?.trim() || input.title;
  const creator = 'دفتر وکالت مجید سواری';

  return {
    description: alt,
    tags: ['blog', 'legal-article', input.slug, input.category].filter(Boolean),
    customMetadata: {
      seoAlt: alt.slice(0, 180),
      seoTitle: input.title.slice(0, 100),
      caption: input.excerpt.slice(0, 300),
      imageRole: 'article',
      creator,
      creditText: creator,
      copyrightNotice: `© ${creator}`,
      publiclyVisible: true,
    },
  };
}

export async function uploadBlogImage(
  file: File,
  metadata: BlogImageMetadata
): Promise<{ fileId: string; path: string; url: string }> {
  if (!file.type.startsWith('image/')) throw new Error('INVALID_IMAGE_TYPE');
  if (file.size > 5 * 1024 * 1024) throw new Error('IMAGE_TOO_LARGE');

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const uploaded = await uploadAsset('public', file, {
    fileName: `${metadata.slug || crypto.randomUUID()}.${extension}`,
    folder: String(new Date().getFullYear()),
    ...imageMetadata(metadata),
  });

  return { fileId: uploaded.fileId, path: uploaded.filePath, url: uploaded.url };
}

export async function updateBlogImageMetadata(
  fileId: string | null,
  metadata: BlogImageMetadata
): Promise<void> {
  if (!fileId) return;
  await updateAssetMetadata(fileId, imageMetadata(metadata));
}

export async function removeBlogImage(fileId: string | null): Promise<void> {
  await deleteAsset(fileId);
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const [row] = await db<Row[]>`
    insert into blog_posts (
      slug, title, category, excerpt, content, published, featured,
      image_url, image_file_id, image_alt
    ) values (
      ${input.slug}, ${input.title}, ${input.category}, ${input.excerpt}, ${input.content},
      ${input.published}, ${input.featured}, ${input.imageUrl}, ${input.imageFileId}, ${input.imageAlt}
    )
    returning id, slug, title, category, excerpt, content, published, featured,
              image_url, image_file_id, image_alt, created_at
  `;
  return map(row);
}

export async function updateBlogPost(id: number, input: BlogPostInput): Promise<BlogPost> {
  const [row] = await db<Row[]>`
    update blog_posts set
      slug = ${input.slug},
      title = ${input.title},
      category = ${input.category},
      excerpt = ${input.excerpt},
      content = ${input.content},
      published = ${input.published},
      featured = ${input.featured},
      image_url = ${input.imageUrl},
      image_file_id = ${input.imageFileId},
      image_alt = ${input.imageAlt}
    where id = ${id}
    returning id, slug, title, category, excerpt, content, published, featured,
              image_url, image_file_id, image_alt, created_at
  `;
  return map(row);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const [row] = await db<{ imageFileId: string | null }[]>`
    delete from blog_posts where id = ${id} returning image_file_id
  `;
  await removeBlogImage(row?.imageFileId ?? null);
}

export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
