import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import BlogForm from '../BlogForm';
import { editPost } from '../actions';
import { getBlogPostByIdForAdmin } from '@/lib/content/blog-admin';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostByIdForAdmin(Number(id));
  if (!post) notFound();

  const editPostWithId = editPost.bind(null, post.id);

  return (
    <>
      <AdminHeader title="ویرایش مطلب" />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight size={16} aria-hidden="true" /> بازگشت به مطالب وبلاگ
        </Link>
        <h1 className="text-xl font-bold text-foreground mb-6">ویرایش: {post.title}</h1>
        <BlogForm action={editPostWithId} post={post} submitLabel="ذخیره تغییرات" />
      </main>
    </>
  );
}
