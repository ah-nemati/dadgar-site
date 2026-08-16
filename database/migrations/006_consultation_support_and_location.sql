-- Richer consultation workflow and secure lawyer/client conversation attachments.
alter table consultation_requests add column if not exists priority text not null default 'normal';
alter table consultation_requests add column if not exists admin_notes text;
alter table consultation_requests add column if not exists updated_at timestamptz not null default now();

alter table consultation_requests drop constraint if exists consultation_requests_priority_check;
alter table consultation_requests add constraint consultation_requests_priority_check
  check (priority in ('normal', 'high', 'urgent'));

drop trigger if exists consultation_requests_set_updated_at on consultation_requests;
create trigger consultation_requests_set_updated_at before update on consultation_requests
for each row execute function set_updated_at();

alter table support_threads add column if not exists practice_area text;

create table if not exists support_attachments (
  id bigserial primary key,
  message_id bigint not null references support_messages(id) on delete cascade,
  thread_id bigint not null references support_threads(id) on delete cascade,
  uploaded_by text not null references users(id) on delete cascade,
  file_id text not null,
  file_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create index if not exists support_attachments_thread_idx
  on support_attachments(thread_id, created_at);
create unique index if not exists support_attachments_file_id_idx
  on support_attachments(file_id);
