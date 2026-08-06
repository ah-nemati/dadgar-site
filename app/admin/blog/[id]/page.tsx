
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

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm mb-5 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowRight size={16} /> بازگشت به مطالب وبلاگ
      </Link>
      <AdminHeader title={`ویرایش: ${post.title}`} />
      <BlogForm action={editPost.bind(null, post.id)} post={post} submitLabel="ذخیره تغییرات" />
    </div>
  );
}
