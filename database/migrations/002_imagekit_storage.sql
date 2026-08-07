-- Store ImageKit's immutable file identifiers separately from delivery paths.
alter table blog_posts add column if not exists image_file_id text;
alter table blog_posts drop column if exists image_path;
alter table client_documents add column if not exists file_id text;

create unique index if not exists blog_posts_image_file_id_idx
  on blog_posts(image_file_id)
  where image_file_id is not null;

create unique index if not exists client_documents_file_id_idx
  on client_documents(file_id)
  where file_id is not null;

comment on column blog_posts.image_file_id is 'ImageKit fileId used for update/delete operations';
comment on column client_documents.file_id is 'ImageKit fileId used for delete operations';
comment on column client_documents.file_path is 'ImageKit delivery path used to generate time-bound signed URLs';
