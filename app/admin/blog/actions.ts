'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createBlogPost,
  deleteBlogPost,
  removeBlogImage,
  slugify,
  updateBlogImageMetadata,
  updateBlogPost,
  uploadBlogImage,
  type BlogImageMetadata,
} from '@/lib/content/blog-admin';
import { requireAdmin } from '@/lib/session';
import { recordAudit } from '@/lib/audit';
import { normalizeBlogSlug } from '@/lib/blog-slug';

export interface BlogFormState {
  error?: string;
}

function baseForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();

  const canonicalSlug = slugify(normalizeBlogSlug(slugInput || title));

  return {
    title,
    slug: canonicalSlug,
    category: String(formData.get('category') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    published: ['on', 'true', '1'].includes(String(formData.get('published') ?? '')),
    featured: ['on', 'true', '1'].includes(String(formData.get('featured') ?? '')),
    imageAlt: String(formData.get('imageAlt') ?? '').trim() || null,
    authorName: String(formData.get('authorName') ?? '').trim() || null,
    reviewerName: String(formData.get('reviewerName') ?? '').trim() || null,
    sourceUrls: String(formData.get('sourceUrls') ?? '')
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean),
    seoTitle: String(formData.get('seoTitle') ?? '').trim().slice(0, 120) || null,
    seoDescription: String(formData.get('seoDescription') ?? '').trim().slice(0, 320) || null,
  };
}


function invalidSourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol !== 'https:' && parsed.protocol !== 'http:';
  } catch {
    return true;
  }
}

function mediaMetadata(base: ReturnType<typeof baseForm>): BlogImageMetadata {
  return {
    slug: base.slug,
    title: base.title,
    category: base.category,
    excerpt: base.excerpt,
    alt: base.imageAlt,
  };
}

function revalidateBlog(slug?: string, previousSlug?: string) {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
}

function formError(error: unknown): string {
  console.error('[Admin Blog Action Error]:', error);
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (message.includes('duplicate') || message.includes('unique') || message.includes('23505')) {
    return 'این نامک قبلاً استفاده شده است؛ نامک دیگری انتخاب کنید.';
  }
  if (message === 'INVALID_IMAGE_TYPE') return 'فایل انتخاب‌شده تصویر معتبر نیست.';
  if (message === 'IMAGE_TOO_LARGE') return 'حجم تصویر باید کمتر از ۵ مگابایت باشد.';
  if (message === 'EMPTY_UPLOAD_FILE') return 'فایل تصویر انتخاب‌شده نامعتبر یا خالی است.';
  if (message.includes('IMAGEKIT_PRIVATE_KEY') || message.includes('IMAGEKIT_URL_ENDPOINT')) {
    return 'متغیرهای ImageKit (کلید خصوصی یا آدرس Endpoint) در سرور یا کلادفلر تنظیم نشده‌اند.';
  }
  if (message.includes('AuthenticationError') || message.includes('401')) {
    return 'احراز هویت در ImageKit ناموفق بود. کلید IMAGEKIT_PRIVATE_KEY را بررسی کنید.';
  }
  if (message.includes('ImageKit') || message.includes('IMAGEKIT_')) {
    return 'ارتباط با سرویس ImageKit با خطا مواجه شد. اتصال و کلیدهای ImageKit را بررسی کنید.';
  }
  if (message.includes('relation') && message.includes('does not exist')) {
    return 'جدول‌های دیتابیس یافت نشدند. لطفاً مایگریشن‌های دیتابیس را اجرا کنید (npm run db:migrate).';
  }
  if (message.includes('column') && message.includes('does not exist')) {
    return 'ستون‌های جدول بلاگ در دیتابیس ناقص هستند. لطفاً مایگریشن 005_blog_editorial_metadata را اجرا کنید (npm run db:migrate).';
  }
  if (message.includes('ECONNREFUSED') || message.includes('timeout') || message.includes('ETIMEDOUT') || message.includes('connection')) {
    return 'ارتباط با پایگاه‌داده برقرار نشد. وضعیت Hyperdrive و دیتابیس را بررسی کنید.';
  }
  return `ذخیره مطلب با خطا مواجه شد (${message || 'خطای نامشخص'}). تنظیمات دیتابیس و ImageKit را بررسی کنید.`;
}

export async function createPost(
  _prevState: BlogFormState | undefined,
  formData: FormData
): Promise<BlogFormState> {
  const admin = await requireAdmin();
  const base = baseForm(formData);

  if (!base.title || !base.category || !base.excerpt || !base.content || !base.slug) {
    return { error: 'لطفاً همه فیلدهای الزامی را تکمیل کنید.' };
  }
  if (base.sourceUrls.some(invalidSourceUrl)) {
    return { error: 'نشانی منابع باید با http یا https شروع شود.' };
  }

  const image = formData.get('image');
  let uploaded: { fileId: string; path: string; url: string } | null = null;

  try {
    if (image instanceof File && image.size > 0) {
      uploaded = await uploadBlogImage(image, mediaMetadata(base));
    }

    const created = await createBlogPost({
      ...base,
      imageUrl: uploaded?.url ?? null,
      imageFileId: uploaded?.fileId ?? null,
    });
    await recordAudit(admin.id, 'blog.create', 'blog_post', created.id, { slug: created.slug, published: created.published });
  } catch (error) {
    if (uploaded) await removeBlogImage(uploaded.fileId).catch(() => undefined);
    return { error: formError(error) };
  }

  revalidateBlog(base.slug);
  redirect('/admin/blog');
}

export async function editPost(
  id: number,
  _prevState: BlogFormState | undefined,
  formData: FormData
): Promise<BlogFormState> {
  const admin = await requireAdmin();
  const base = baseForm(formData);

  if (!base.title || !base.category || !base.excerpt || !base.content || !base.slug) {
    return { error: 'لطفاً همه فیلدهای الزامی را تکمیل کنید.' };
  }
  if (base.sourceUrls.some(invalidSourceUrl)) {
    return { error: 'نشانی منابع باید با http یا https شروع شود.' };
  }

  const previousSlug = String(formData.get('previousSlug') ?? '');
  const previousImageUrl = String(formData.get('previousImageUrl') ?? '') || null;
  const previousImageFileId = String(formData.get('previousImageFileId') ?? '') || null;
  const removeImage = formData.get('removeImage') === 'on';
  const image = formData.get('image');

  let imageUrl = removeImage ? null : previousImageUrl;
  let imageFileId = removeImage ? null : previousImageFileId;
  let uploaded: { fileId: string; path: string; url: string } | null = null;

  try {
    if (image instanceof File && image.size > 0) {
      uploaded = await uploadBlogImage(image, mediaMetadata(base));
      imageUrl = uploaded.url;
      imageFileId = uploaded.fileId;
    } else if (imageFileId && !removeImage) {
      await updateBlogImageMetadata(imageFileId, mediaMetadata(base));
    }

    const updated = await updateBlogPost(id, { ...base, imageUrl, imageFileId });
    await recordAudit(admin.id, 'blog.update', 'blog_post', id, { slug: updated.slug, published: updated.published });

    if ((uploaded || removeImage) && previousImageFileId && previousImageFileId !== imageFileId) {
      await removeBlogImage(previousImageFileId);
    }
  } catch (error) {
    if (uploaded) await removeBlogImage(uploaded.fileId).catch(() => undefined);
    return { error: formError(error) };
  }

  revalidateBlog(base.slug, previousSlug);
  redirect('/admin/blog');
}

export async function removePost(id: number, slug: string) {
  const admin = await requireAdmin();
  await deleteBlogPost(id);
  await recordAudit(admin.id, 'blog.delete', 'blog_post', id, { slug });
  revalidateBlog(slug);
}
