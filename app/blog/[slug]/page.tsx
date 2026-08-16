import Link from "@/components/NoPrefetchLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getFirm } from "@/lib/content/firm";
import { getBlogPostBySlug } from "@/lib/content/blog";
import { blogPostPath } from "@/lib/blog-slug";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

// Blog posts are managed from PostgreSQL. Rendering dynamically prevents newly
// published Persian slugs from becoming 404s until the next deployment.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, firm] = await Promise.all([getBlogPostBySlug(slug), getFirm()]);
  if (!post) return {};

  const description = post.seoDescription || post.excerpt;
  const authorName = post.authorName || firm.shortName;

  return {
    title: post.seoTitle || post.title,
    description,
    authors: [{ name: authorName }],
    alternates: { canonical: blogPostPath(post.slug) },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [authorName],
      section: post.category,
      images: post.imageUrl
        ? [{ url: post.imageUrl, alt: post.imageAlt || post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
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
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { "@type": "Person", name: post.authorName || firm.shortName },
    reviewedBy: post.reviewerName ? { "@type": "Person", name: post.reviewerName } : undefined,
    citation: post.sourceUrls?.length ? post.sourceUrls : undefined,
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

      <section className="page-hero">
        <div className="relative mx-auto max-w-4xl px-6 py-14 md:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 text-sky-800/70 hover:text-sky-600 transition-colors"
          >
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به وبلاگ
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-sky-600">
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs text-sky-600 inline-flex items-center gap-1">
                <Star size={13} fill="currentColor" /> ویژه
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-sky-900 mt-4 mb-6 leading-[1.45]">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-sky-800/70">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
            <span>·</span>
            <span>نویسنده: {post.authorName || firm.shortName}</span>
            {post.reviewerName && <>
              <span>·</span>
              <span>بازبین حقوقی: {post.reviewerName}</span>
            </>}
          </div>
        </div>
      </section>

      <article>
        <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
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

          <p className="rounded-xl border border-gold/20 bg-gold/5 p-5 text-lg text-muted-foreground leading-9 mb-10">
            {post.excerpt}
          </p>

          <div className="prose-legal">
            {post.content.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index} className="text-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {(post.sourceUrls?.length ?? 0) > 0 && (
            <section className="mt-10 pt-6 border-t border-border" aria-labelledby="article-sources">
              <h2 id="article-sources" className="font-bold mb-4">منابع و مستندات</h2>
              <ul className="space-y-2 text-sm">
                {post.sourceUrls?.map((url, index) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 break-all">
                      منبع {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground leading-7">
            این مطلب صرفاً جنبه اطلاع‌رسانی عمومی دارد و جایگزین مشاوره حقوقی
            اختصاصی نیست.
          </div>

          <div className="mt-10 legal-card p-6 flex flex-wrap items-center justify-between gap-4">
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
