import postgres from 'postgres';
import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (error) { if (error?.code !== 'ENOENT') throw error; }

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');
const sql = postgres(connectionString, {
  ssl: process.env.DATABASE_SSL === 'false' ? false : 'require',
  max: 1,
  prepare: false,
});

const posts = [
  {
    slug: 'راهنمای-اولیه-مشاوره-حقوقی',
    title: 'برای جلسه نخست مشاوره حقوقی چه مدارکی همراه داشته باشیم؟',
    category: 'راهنمای حقوقی',
    excerpt: 'چک‌لیستی کوتاه برای آماده‌سازی مدارک، قراردادها و پرسش‌های جلسه مشاوره.',
    content: 'برای استفاده بهتر از زمان جلسه، اصل یا تصویر خوانای قراردادها، مکاتبات، ابلاغیه‌ها و یک خط زمانی کوتاه از رویدادها را همراه داشته باشید. همچنین پرسش‌های اصلی خود را از قبل یادداشت کنید.',
  },
];

for (const post of posts) {
  await sql`
    insert into blog_posts (slug, title, category, excerpt, content, published, featured)
    values (${post.slug}, ${post.title}, ${post.category}, ${post.excerpt}, ${post.content}, true, true)
    on conflict (slug) do nothing
  `;
}
console.log('Seed completed.');
await sql.end();
