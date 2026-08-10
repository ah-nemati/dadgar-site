
import Link from '@/components/NoPrefetchLink';
import { ArrowRight } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import BlogForm from '../BlogForm';
import { createPost } from '../actions';

export default function NewBlogPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm mb-5 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowRight size={16} /> بازگشت به مطالب وبلاگ
      </Link>
      <AdminHeader title="نوشتن مطلب جدید" description="عنوان، متن و تصویر شاخص را وارد کنید و سپس پیش‌نویس یا نسخه منتشرشده را ذخیره کنید." />
      <BlogForm action={createPost} submitLabel="ثبت مطلب" />
    </div>
  );
}
