import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import AdminHeader from '../AdminHeader';
import DeletePostButton from './DeletePostButton';
import { getAllBlogPostsForAdmin } from '@/lib/content/blog-admin';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <>
      <AdminHeader title="مدیریت وبلاگ" />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">مطالب وبلاگ</h1>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus size={16} aria-hidden="true" /> مطلب جدید
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-16 text-center">
            <FileText size={32} className="text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <p className="text-muted-foreground mb-5">هنوز مطلبی ثبت نشده است.</p>
            <Button asChild>
              <Link href="/admin/blog/new">
                <Plus size={16} aria-hidden="true" /> نوشتن اولین مطلب
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عنوان</TableHead>
                  <TableHead>دسته‌بندی</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>اقدام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Badge variant={post.published ? 'accent' : 'outline'}>
                        {post.published ? 'منتشرشده' : 'پیش‌نویس'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-sm">{post.title}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{post.category}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{post.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/blog/${post.id}`}>ویرایش</Link>
                        </Button>
                        <DeletePostButton id={post.id} slug={post.slug} title={post.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </>
  );
}
