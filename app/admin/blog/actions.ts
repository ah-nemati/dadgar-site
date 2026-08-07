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

export interface BlogFormState {
  error?: string;
}

function baseForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();

  return {
    title,
    slug: slugInput || slugify(title),
    category: String(formData.get('category') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
    imageAlt: String(formData.get('imageAlt') ?? '').trim() || null,
  };
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
  revalidatePath('/admin');
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
}

function formError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('duplicate') || message.includes('unique')) {
    return 'این نامک قبلاً استفاده شده است؛ نامک دیگری انتخاب کنید.';
  }
  if (message === 'INVALID_IMAGE_TYPE') return 'فایل انتخاب‌شده تصویر معتبر نیست.';
  if (message === 'IMAGE_TOO_LARGE') return 'حجم تصویر باید کمتر از ۵ مگابایت باشد.';
  if (message.includes('IMAGEKIT_') || message.includes('ImageKit')) {
    return 'ارتباط با ImageKit برقرار نشد. کلید خصوصی و URL Endpoint را بررسی کنید.';
  }
  return 'ذخیره مطلب با خطا مواجه شد. تنظیمات دیتابیس و ImageKit را بررسی کنید.';
}

export async function createPost(
  _prevState: BlogFormState | undefined,
  formData: FormData
): Promise<BlogFormState> {
  await requireAdmin();
  const base = baseForm(formData);

  if (!base.title || !base.category || !base.excerpt || !base.content || !base.slug) {
    return { error: 'لطفاً همه فیلدهای الزامی را تکمیل کنید.' };
  }

  const image = formData.get('image');
  let uploaded: { fileId: string; path: string; url: string } | null = null;

  try {
    if (image instanceof File && image.size > 0) {
      uploaded = await uploadBlogImage(image, mediaMetadata(base));
    }

    await createBlogPost({
      ...base,
      imageUrl: uploaded?.url ?? null,
      imageFileId: uploaded?.fileId ?? null,
    });
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
  await requireAdmin();
  const base = baseForm(formData);

  if (!base.title || !base.category || !base.excerpt || !base.content || !base.slug) {
    return { error: 'لطفاً همه فیلدهای الزامی را تکمیل کنید.' };
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

    await updateBlogPost(id, { ...base, imageUrl, imageFileId });

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
  await requireAdmin();
  await deleteBlogPost(id);
  revalidateBlog(slug);
}
