import type { MetadataRoute } from "next";
import { getFirm } from "@/lib/content/firm";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { getLawyers } from "@/lib/content/lawyers";
import { getBlogPosts } from "@/lib/content/blog";

// Blog routes come from Supabase; force-dynamic keeps the build independent of
// reaching it, matching app/blog/page.tsx.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();
  const lawyers = await getLawyers();

  // Defensive: a Supabase hiccup should omit blog URLs, not break the sitemap.
  const blogPosts = await getBlogPosts().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/practice-areas",
    "/lawyers",
    "/blog",
    "/faq",
    "/contact",
  ].map((path) => ({
    url: `${firm.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const practiceAreaRoutes: MetadataRoute.Sitemap = practiceAreas.map(
    (area) => ({
      url: `${firm.url}/practice-areas/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const lawyerRoutes: MetadataRoute.Sitemap = lawyers.map((lw) => ({
    url: `${firm.url}/lawyers/${lw.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${firm.url}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...practiceAreaRoutes,
    ...lawyerRoutes,
    ...blogRoutes,
  ];
}
