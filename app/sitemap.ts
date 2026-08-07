import type { MetadataRoute } from "next";
import { getFirm } from "@/lib/content/firm";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { getLawyers } from "@/lib/content/lawyers";
import { getBlogPosts } from "@/lib/content/blog";
import { blogPostPath } from "@/lib/blog-slug";

// Blog routes are read from PostgreSQL at request time.
export const dynamic = "force-static";
export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();
  const lawyers = await getLawyers();

  // A temporary database outage should omit blog URLs instead of breaking the sitemap.
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
    url: new URL(path || "/", firm.url).toString(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const practiceAreaRoutes: MetadataRoute.Sitemap = practiceAreas.map(
    (area) => ({
      url: new URL(`/practice-areas/${area.slug}`, firm.url).toString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const lawyerRoutes: MetadataRoute.Sitemap = lawyers.map((lw) => ({
    url: new URL(`/lawyers/${lw.slug}`, firm.url).toString(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: new URL(blogPostPath(post.slug), firm.url).toString(),
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
