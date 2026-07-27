import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getFirm } from "@/lib/content/firm";
import { getBlogPostBySlug } from "@/lib/content/blog";

type Params = Promise<{ slug: string }>;

// CMS-managed content: rendered on demand rather than pre-built at build time
// (a new/edited post shouldn't need a redeploy to appear, and the build
// shouldn't depend on reaching Supabase). See app/(site)/blog/page.tsx for the
// ISR alternative if traffic ever makes the extra DB round-trip worth avoiding.
export const dynamic = "force-dynamic";

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
    { name: post.title, path: `/blog/${post.slug}` },
  ]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    author: { "@type": "Person", name: firm.shortName },
    publisher: { "@type": "Attorney", name: firm.shortName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <section className="bg-ink">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 text-parchment/85 hover:text-gold-light transition-colors"
          >
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به وبلاگ
          </Link>
          <span className="text-xs font-semibold text-gold-light">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-parchment mt-3 mb-4 leading-tight">
            {post.title}
          </h1>
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
              <p key={i} className="text-foreground leading-8">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
            این مطلب صرفاً جنبه اطلاع‌رسانی عمومی دارد و جایگزین مشاوره حقوقی
            اختصاصی نیست.
          </div>
          <div className="mt-10 bg-card border border-border rounded-sm p-6 flex flex-wrap items-center justify-between gap-4">
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
      </section>
    </>
  );
}
