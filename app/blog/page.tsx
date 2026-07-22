import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import BlogList from '@/components/BlogList';
import { getBlogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'وبلاگ حقوقی',
  description: 'یادداشت‌ها و مقالات حقوقی دفتر وکالت مجید سواری درباره دعاوی ملکی، چک و خانواده در اهواز.',
};

// CMS-managed content read from Supabase at request time — force-dynamic means
// the build never depends on reaching Supabase (robust if it's unreachable
// during a deploy) and content is always current. If this site grows enough
// traffic that the extra DB round-trip per request matters, swap this for
// `export const revalidate = 3600` (ISR) instead — the page code doesn't change.
export const dynamic = 'force-dynamic';

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
