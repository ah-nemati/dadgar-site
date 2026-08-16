import Link from '@/components/NoPrefetchLink';
import { FileCheck2, FilePenLine, FileText, Plus, Search, Star } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import DeletePostButton from './DeletePostButton';
import { getAllBlogPostsForAdmin } from '@/lib/content/blog-admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { blogPostPath } from '@/lib/blog-slug';
import { toPersianDigits } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  const [{ q = '', status = '', category = '' }, posts] = await Promise.all([
    searchParams,
    getAllBlogPostsForAdmin(),
  ]);

  const query = q.trim().toLowerCase();
  const categories = Array.from(new Set(posts.map((post) => post.category))).sort((a, b) => a.localeCompare(b, 'fa'));
  const filtered = posts.filter((post) => {
    const matchesQuery = !query || [post.title, post.slug, post.category, post.excerpt, post.authorName ?? '', post.reviewerName ?? '']
      .join(' ')
      .toLowerCase()
      .includes(query);
    const matchesStatus = !status || (status === 'published' ? post.published : !post.published);
    const matchesCategory = !category || post.category === category;
    return matchesQuery && matchesStatus && matchesCategory;
  });

  const published = posts.filter((post) => post.published).length;
  const drafts = posts.length - published;
  const seoReady = posts.filter((post) => post.seoTitle && post.seoDescription).length;

  return (
    <div>
      <AdminHeader
        title="مدیریت وبلاگ"
        description="مقالات، پیش‌نویس‌ها، تصویر شاخص، نویسنده و تنظیمات SEO هر مطلب را مدیریت کنید."
        actions={
          <Button asChild>
            <Link href="/admin/blog/new"><Plus size={16} /> مطلب جدید</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <Stat label="همه مطالب" value={posts.length} icon={FileText} />
        <Stat label="منتشرشده" value={published} icon={FileCheck2} />
        <Stat label="پیش‌نویس" value={drafts} icon={FilePenLine} />
        <Stat label="SEO تکمیل" value={seoReady} icon={Search} />
      </div>

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-[1fr_12rem_14rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" />
          <Input name="q" defaultValue={q} className="pr-11" placeholder="جستجو در عنوان، نامک، دسته‌بندی یا نویسنده" />
        </div>
        <select name="status" defaultValue={status} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه وضعیت‌ها</option>
          <option value="published">منتشرشده</option>
          <option value="draft">پیش‌نویس</option>
        </select>
        <select name="category" defaultValue={category} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه دسته‌ها</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <Button type="submit" variant="secondary">اعمال فیلتر</Button>
      </form>

      {filtered.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <FileText size={34} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-5">مطلبی مطابق فیلتر پیدا نشد.</p>
          {posts.length === 0 && <Button asChild><Link href="/admin/blog/new"><Plus size={16} /> نوشتن اولین مطلب</Link></Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((post) => {
            const seoComplete = Boolean(post.seoTitle && post.seoDescription);
            return (
              <article key={post.id} className="dashboard-card overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-44 shrink-0 bg-muted/40">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      width={352}
                      height={220}
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="w-full h-44 sm:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 sm:h-full min-h-40 bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center text-sky-500"><FileText size={30} /></div>
                  )}
                </div>

                <div className="p-5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={post.published ? 'accent' : 'outline'}>{post.published ? 'منتشرشده' : 'پیش‌نویس'}</Badge>
                    {post.featured && <Badge variant="default"><Star size={12} fill="currentColor" /> ویژه</Badge>}
                    <Badge variant={seoComplete ? 'outline' : 'destructive'}>{seoComplete ? 'SEO کامل' : 'SEO ناقص'}</Badge>
                  </div>
                  <h2 className="font-bold leading-7 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-6">{post.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-3">
                    <span>{post.category}</span><span>·</span><span>{post.date}</span>
                    {post.authorName && <><span>·</span><span>نویسنده: {post.authorName}</span></>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-5">
                    <Button size="sm" variant="outline" asChild><Link href={`/admin/blog/${post.id}`}>ویرایش</Link></Button>
                    {post.published && <Button size="sm" variant="ghost" asChild><Link href={blogPostPath(post.slug)} target="_blank">مشاهده</Link></Button>}
                    <DeletePostButton id={post.id} slug={post.slug} title={post.title} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof FileText }) {
  return (
    <div className="dashboard-stat">
      <div className="flex justify-between gap-3">
        <div><p className="text-xs sm:text-sm text-muted-foreground">{label}</p><p className="text-2xl sm:text-3xl font-extrabold mt-2">{toPersianDigits(value)}</p></div>
        <Icon className="text-accent" size={20} />
      </div>
    </div>
  );
}
