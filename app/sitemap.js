import { FIRM } from '@/data/firm';
import { PRACTICE_AREAS } from '@/data/practiceAreas';
import { LAWYERS } from '@/data/lawyers';
import { BLOG_POSTS } from '@/data/blogPosts';

export default function sitemap() {
  const staticRoutes = ['', '/about', '/practice-areas', '/lawyers', '/blog', '/faq', '/contact'].map((path) => ({
    url: `${FIRM.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const practiceAreaRoutes = PRACTICE_AREAS.map((area) => ({
    url: `${FIRM.url}/practice-areas/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const lawyerRoutes = LAWYERS.map((lw) => ({
    url: `${FIRM.url}/lawyers/${lw.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${FIRM.url}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...practiceAreaRoutes, ...lawyerRoutes, ...blogRoutes];
}
