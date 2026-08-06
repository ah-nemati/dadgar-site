
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createBlogPost,
  deleteBlogPost,
  removeBlogImage,
  slugify,
  updateBlogPost,
  uploadBlogImage,
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

function revalidateBlog(slug?: string, previousSlug?: string) {
  revalidatePath('/');
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
  return 'ذخیره مطلب با خطا مواجه شد. تنظیمات دیتابیس و Storage را بررسی کنید.';
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
  let uploaded: { path: string; url: string } | null = null;

  try {
    if (image instanceof File && image.size > 0) uploaded = await uploadBlogImage(image);

    await createBlogPost({
      ...base,
      imageUrl: uploaded?.url ?? null,
      imagePath: uploaded?.path ?? null,
    });
  } catch (error) {
    if (uploaded) await removeBlogImage(uploaded.path);
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
  const previousImagePath = String(formData.get('previousImagePath') ?? '') || null;
  const removeImage = formData.get('removeImage') === 'on';
  const image = formData.get('image');

  let imageUrl = removeImage ? null : previousImageUrl;
  let imagePath = removeImage ? null : previousImagePath;
  let uploaded: { path: string; url: string } | null = null;

  try {
    if (image instanceof File && image.size > 0) {
      uploaded = await uploadBlogImage(image);
      imageUrl = uploaded.url;
      imagePath = uploaded.path;
    }

    await updateBlogPost(id, { ...base, imageUrl, imagePath });

    if ((uploaded || removeImage) && previousImagePath && previousImagePath !== imagePath) {
      await removeBlogImage(previousImagePath);
    }
  } catch (error) {
    if (uploaded) await removeBlogImage(uploaded.path);
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
