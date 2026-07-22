import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import BlogForm from '../BlogForm';
import { createPost } from '../actions';

export default function NewBlogPostPage() {
  return (
    <>
      <AdminHeader title="مطلب جدید" />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight size={16} aria-hidden="true" /> بازگشت به مطالب وبلاگ
        </Link>
        <h1 className="text-xl font-bold text-foreground mb-6">نوشتن مطلب جدید</h1>
        <BlogForm action={createPost} submitLabel="ثبت مطلب" />
      </main>
    </>
  );
}
