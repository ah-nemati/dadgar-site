import PageHero from '@/components/PageHero';
import BlogList from '@/components/BlogList';
import { BLOG_POSTS } from '@/data/blogPosts';

export const metadata = {
  title: 'وبلاگ حقوقی',
  description: 'یادداشت‌ها و مقالات حقوقی موسسه حقوقی دادگر برای آشنایی عمومی با مفاهیم و فرآیندهای حقوقی.',
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="وبلاگ حقوقی"
        title="یادداشت‌ها و مقالات حقوقی"
        description="مطالبی برای آشنایی عمومی با مفاهیم و فرآیندهای حقوقی. این مطالب جایگزین مشاوره تخصصی نیست."
      />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <BlogList posts={BLOG_POSTS} />
        </div>
      </section>
    </>
  );
}
