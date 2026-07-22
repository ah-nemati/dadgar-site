'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { BlogFormState } from './actions';
import type { BlogPost } from '@/types/content';

interface BlogFormProps {
  action: (prevState: BlogFormState | undefined, formData: FormData) => Promise<BlogFormState>;
  post?: BlogPost;
  submitLabel: string;
}

const CATEGORIES = ['حقوق ملک', 'دعاوی چک', 'حقوق خانواده'];

export default function BlogForm({ action, post, submitLabel }: BlogFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [slug, setSlug] = useState(post?.slug ?? '');

  return (
    <form action={formAction} className="bg-card border border-border rounded-sm p-6 md:p-8 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">نامک (slug) — بخشی از آدرس صفحه</Label>
        <Input
          id="slug"
          name="slug"
          dir="ltr"
          style={{ textAlign: 'right' }}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">دسته‌بندی *</Label>
        <select
          id="category"
          name="category"
          defaultValue={post?.category ?? CATEGORIES[0]}
          required
          className="w-full h-11 px-4 rounded-sm text-sm bg-card border border-input focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">خلاصه (در لیست مطالب نمایش داده می‌شود) *</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">متن کامل مطلب * (هر پاراگراف را با یک خط خالی از پاراگراف بعدی جدا کنید)</Label>
        <Textarea id="content" name="content" rows={14} defaultValue={post?.content} required />
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox id="published" name="published" defaultChecked={post?.published ?? false} />
        <Label htmlFor="published" className="font-normal cursor-pointer">
          منتشر شود (در غیر این صورت به‌عنوان پیش‌نویس ذخیره می‌شود)
        </Label>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'در حال ذخیره...' : submitLabel}
      </Button>
    </form>
  );
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
