"use client";

import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import { ImagePlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { BlogFormState } from "./actions";
import type { BlogPost } from "@/types/content";
import Image from "next/image";

interface BlogFormProps {
  action: (
    prevState: BlogFormState | undefined,
    formData: FormData,
  ) => Promise<BlogFormState>;
  post?: BlogPost;
  submitLabel: string;
}

const CATEGORIES = [
  "حقوق ملک",
  "دعاوی چک",
  "حقوق خانواده",
  "آموزش حقوقی",
  "اخبار حقوقی",
];

export default function BlogForm({ action, post, submitLabel }: BlogFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [preview, setPreview] = useState<string | null>(post?.imageUrl ?? null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form action={formAction} className="dashboard-card p-5 md:p-8 space-y-6">
      {post && (
        <>
          <input type="hidden" name="previousSlug" value={post.slug} />
          <input
            type="hidden"
            name="previousImageUrl"
            value={post.imageUrl ?? ""}
          />
          <input
            type="hidden"
            name="previousImageFileId"
            value={post.imageFileId ?? ""}
          />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">عنوان مطلب *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={post?.title}
            required
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">نامک (آدرس صفحه) *</Label>
          <Input
            id="slug"
            name="slug"
            dir="ltr"
            className="text-right"
            value={slug}
            required
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">دسته‌بندی *</Label>
          <Input
            id="category"
            name="category"
            list="blog-categories"
            defaultValue={post?.category ?? CATEGORIES[0]}
            required
          />
          <datalist id="blog-categories">
            {CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="image">تصویر شاخص</Label>
        <label
          htmlFor="image"
          className="block border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors bg-muted/30"
        >
          {preview ? (
            <Image
              src={preview}
              alt="پیش‌نمایش تصویر شاخص"
              width={1200}
              height={675}
              sizes="100vw"
              unoptimized
              className="blog-cover"
            />
          ) : (
            <span className="min-h-48 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <ImagePlus size={34} aria-hidden="true" />
              <span className="text-sm">برای انتخاب تصویر کلیک کنید</span>
              <span className="text-xs">
                JPG، PNG، WEBP یا GIF — حداکثر ۵ مگابایت
              </span>
            </span>
          )}
        </label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
          }}
        />
        <div className="space-y-2">
          <Label htmlFor="imageAlt">
            متن جایگزین تصویر (برای دسترس‌پذیری و سئو)
          </Label>
          <Input
            id="imageAlt"
            name="imageAlt"
            defaultValue={post?.imageAlt ?? ""}
          />
        </div>
        {post?.imageUrl && (
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Checkbox id="removeImage" name="removeImage" />
            حذف تصویر فعلی
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="authorName">نویسنده / تهیه‌کننده محتوا</Label>
          <Input id="authorName" name="authorName" defaultValue={post?.authorName ?? ""} placeholder="مثلاً مجید سواری" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewerName">بازبین حقوقی</Label>
          <Input id="reviewerName" name="reviewerName" defaultValue={post?.reviewerName ?? ""} placeholder="نام وکیل یا بازبین" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">خلاصه مطلب *</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={post?.excerpt}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sourceUrls">منابع رسمی و مستند</Label>
        <p className="text-xs text-muted-foreground">هر لینک را در یک خط وارد کنید؛ ترجیحاً قوانین، سامانه‌های رسمی و منابع مرجع.</p>
        <Textarea
          id="sourceUrls"
          name="sourceUrls"
          rows={4}
          dir="ltr"
          className="text-left"
          defaultValue={(post?.sourceUrls ?? []).join("\n")}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">متن کامل مطلب *</Label>
        <p className="text-xs text-muted-foreground">
          هر پاراگراف را با یک خط خالی از پاراگراف بعدی جدا کنید.
        </p>
        <Textarea
          id="content"
          name="content"
          rows={18}
          defaultValue={post?.content}
          required
          className="resize-y"
        />
      </div>

      <section className="rounded-lg border border-border p-4 space-y-4">
        <h3 className="font-semibold">SEO این مقاله</h3>
        <div className="space-y-2">
          <Label htmlFor="seoTitle">عنوان SEO (اختیاری)</Label>
          <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle ?? ""} maxLength={120} placeholder="اگر خالی باشد، عنوان مقاله استفاده می‌شود" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">توضیح متا (اختیاری)</Label>
          <Textarea id="seoDescription" name="seoDescription" rows={3} maxLength={320} defaultValue={post?.seoDescription ?? ""} placeholder="اگر خالی باشد، خلاصه مقاله استفاده می‌شود" />
        </div>
      </section>

      <div className="flex flex-wrap gap-5 rounded-lg bg-muted/45 p-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            id="published"
            name="published"
            defaultChecked={post?.published ?? false}
          />
          <span className="text-sm">انتشار عمومی مطلب</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            id="featured"
            name="featured"
            defaultChecked={post?.featured ?? false}
          />
          <span className="text-sm flex items-center gap-1.5">
            <Star size={15} aria-hidden="true" />
            مطلب ویژه
          </span>
        </label>
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription className="col-start-1">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <span className="button-spinner" aria-hidden="true" />
            در حال ذخیره...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
