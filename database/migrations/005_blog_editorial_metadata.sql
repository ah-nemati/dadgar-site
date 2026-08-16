alter table blog_posts add column if not exists author_name text;
alter table blog_posts add column if not exists reviewer_name text;
alter table blog_posts add column if not exists source_urls text[] not null default '{}';
alter table blog_posts add column if not exists seo_title text;
alter table blog_posts add column if not exists seo_description text;
