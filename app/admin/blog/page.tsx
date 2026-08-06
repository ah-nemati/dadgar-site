
import Link from 'next/link';
import { FileText, Plus, Star } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import DeletePostButton from './DeletePostButton';
import { getAllBlogPostsForAdmin } from '@/lib/content/blog-admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <div>
      <AdminHeader
        title="مدیریت وبلاگ"
        description="مطلب جدید بنویسید، تصویر شاخص اضافه کنید و انتشار مطالب را مدیریت کنید."
        actions={<Button asChild><Link href="/admin/blog/new"><Plus size={16} /> مطلب جدید</Link></Button>}
      />

      {posts.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <FileText size={34} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-5">هنوز مطلبی ثبت نشده است.</p>
          <Button asChild><Link href="/admin/blog/new"><Plus size={16} /> نوشتن اولین مطلب</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {posts.map((post) => (
            <article key={post.id} className="dashboard-card overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-44 shrink-0">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.imageAlt || post.title} className="w-full h-40 sm:h-full object-cover" />
                ) : (
                  <div className="w-full h-40 sm:h-full min-h-36 bg-gradient-to-br from-ink to-ink-2 flex items-center justify-center text-parchment/70">
                    <FileText size={30} />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={post.published ? 'accent' : 'outline'}>{post.published ? 'منتشرشده' : 'پیش‌نویس'}</Badge>
                  {post.featured && <Badge variant="default"><Star size={12} fill="currentColor" /> ویژه</Badge>}
                </div>
                <h2 className="font-bold leading-7 line-clamp-2">{post.title}</h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span>{post.category}</span><span>·</span><span>{post.date}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <Button size="sm" variant="outline" asChild><Link href={`/admin/blog/${post.id}`}>ویرایش</Link></Button>
                  {post.published && <Button size="sm" variant="ghost" asChild><Link href={`/blog/${post.slug}`} target="_blank">مشاهده</Link></Button>}
                  <DeletePostButton id={post.id} slug={post.slug} title={post.title} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
