import Link from "@/components/NoPrefetchLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getFirm } from "@/lib/content/firm";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content/blog";
import { blogPostPath } from "@/lib/blog-slug";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

// Pre-render articles known at build time, but allow newly published slugs to
// be generated on demand after an admin creates them.
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: blogPostPath(post.slug) },
    openGraph: post.imageUrl
      ? { images: [{ url: post.imageUrl, alt: post.imageAlt || post.title }] }
      : undefined,
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const firm = await getFirm();
  const breadcrumb = breadcrumbJsonLd([
    { name: "خانه", path: "/" },
    { name: "وبلاگ حقوقی", path: "/blog" },
    { name: post.title, path: blogPostPath(post.slug) },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    inLanguage: "fa-IR",
    mainEntityOfPage: new URL(blogPostPath(post.slug), firm.url).toString(),
    image: post.imageUrl || undefined,
    author: { "@type": "Person", name: firm.shortName },
    publisher: { "@type": "LegalService", name: firm.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-ink">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 text-parchment/85 hover:text-gold-light transition-colors"
          >
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به وبلاگ
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gold-light">
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs text-gold-light inline-flex items-center gap-1">
                <Star size={13} fill="currentColor" /> ویژه
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-parchment mt-3 mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-parchment/70">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      <article className="bg-parchment">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          {post.imageUrl && (
            <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl border border-border shadow-sm">
              <Image
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <p className="text-lg text-muted-foreground leading-9 border-r-4 border-gold pr-5 mb-10">
            {post.excerpt}
          </p>

          <div className="prose-legal">
            {post.content.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index} className="text-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground leading-7">
            این مطلب صرفاً جنبه اطلاع‌رسانی عمومی دارد و جایگزین مشاوره حقوقی
            اختصاصی نیست.
          </div>

          <div className="mt-10 dashboard-card p-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-foreground">
              سوالی درباره این موضوع دارید؟
            </p>
            <Button asChild>
              <Link href="/contact">
                درخواست مشاوره <ArrowLeft size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
