import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import BlogList from '@/components/BlogList';
import { getBlogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'وبلاگ حقوقی',
  description: 'یادداشت‌ها و مقالات حقوقی دفتر وکالت مجید سواری درباره دعاوی ملکی، چک و خانواده در اهواز.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="وبلاگ حقوقی"
        title="یادداشت‌ها و مقالات حقوقی"
        description="مطالبی برای آشنایی عمومی با مفاهیم و فرآیندهای حقوقی. این مطالب جایگزین مشاوره تخصصی نیست."
      />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <BlogList posts={posts} />
        </div>
      </section>
    </>
  );
}
