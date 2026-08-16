import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import BlogList from '@/components/BlogList';
import { getBlogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'وبلاگ حقوقی',
  description: 'مقالات حقوقی دفتر وکالت مجید سواری درباره دعاوی حقوقی، کیفری، خانواده، املاک، چک، قراردادها، ارث و سایر موضوعات کاربردی.',
};

// On Workers Free, keep the public blog list build-time static so requests
// are served from Static Assets instead of invoking the NextServer.
export const dynamic = 'force-static';
export const revalidate = false;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="وبلاگ حقوقی"
        title="یادداشت‌ها و مقالات حقوقی"
        description="مطالبی برای آشنایی عمومی با مفاهیم و فرآیندهای حقوقی. این مطالب جایگزین مشاوره تخصصی نیست."
      />
      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <BlogList posts={posts} />
        </div>
      </section>
    </>
  );
}
