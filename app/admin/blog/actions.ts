'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createBlogPost, updateBlogPost, deleteBlogPost, slugify } from '@/lib/content/blog-admin';

export interface BlogFormState {
  error?: string;
}

function readForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  return {
    title,
    slug: slugInput || slugify(title),
    category: String(formData.get('category') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    published: formData.get('published') === 'on',
  };
}

function revalidateBlog(slug?: string) {
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPost(_prevState: BlogFormState | undefined, formData: FormData): Promise<BlogFormState> {
  const input = readForm(formData);
  if (!input.title || !input.category || !input.excerpt || !input.content) {
    return { error: 'لطفاً همه فیلدهای الزامی را تکمیل کنید.' };
  }

  try {
    await createBlogPost(input);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('duplicate') || message.includes('unique')) {
      return { error: 'این نامک (slug) قبلاً استفاده شده؛ نامک دیگری انتخاب کنید.' };
    }
    return { error: 'ثبت مطلب با خطا مواجه شد.' };
  }

  revalidateBlog(input.slug);
  redirect('/admin/blog');
}

export async function editPost(
  id: number,
  _prevState: BlogFormState | undefined,
  formData: FormData
): Promise<BlogFormState> {
  const input = readForm(formData);
  if (!input.title || !input.category || !input.excerpt || !input.content) {
    return { error: 'لطفاً همه فیلدهای الزامی را تکمیل کنید.' };
  }

  try {
    await updateBlogPost(id, input);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('duplicate') || message.includes('unique')) {
      return { error: 'این نامک (slug) قبلاً استفاده شده؛ نامک دیگری انتخاب کنید.' };
    }
    return { error: 'ذخیره تغییرات با خطا مواجه شد.' };
  }

  revalidateBlog(input.slug);
  redirect('/admin/blog');
}

export async function removePost(id: number, slug: string) {
  await deleteBlogPost(id);
  revalidateBlog(slug);
}
