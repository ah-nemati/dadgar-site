create table if not exists content_overrides (
  key text primary key,
  data jsonb not null,
  updated_by text references users(id) on delete set null,
  updated_at timestamptz not null default now()
);
create index if not exists content_overrides_updated_idx on content_overrides(updated_at desc);

comment on table content_overrides is 'Admin-managed public site content and SEO settings. Static source files remain safe fallbacks.';
