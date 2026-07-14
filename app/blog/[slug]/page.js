import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS, getBlogPostBySlug } from '@/data/blogPosts';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <section className="bg-ink">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 text-parchment/85 hover:text-gold-light transition-colors">
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به وبلاگ
          </Link>
          <span className="text-xs font-semibold text-gold-light">{post.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-parchment mt-3 mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3 text-xs text-parchment/70">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>
      <section className="bg-parchment">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="flex flex-col gap-5">
            {post.content.map((para, i) => (
              <p key={i} className="text-charcoal leading-8">{para}</p>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-sand text-xs text-muted">
            این مطلب صرفاً جنبه اطلاع‌رسانی عمومی دارد و جایگزین مشاوره حقوقی اختصاصی نیست.
          </div>
          <div className="mt-10 bg-card border border-sand rounded-sm p-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-charcoal">سوالی درباره این موضوع دارید؟</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-5 py-2.5 rounded-sm text-sm transition-colors"
            >
              درخواست مشاوره <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
