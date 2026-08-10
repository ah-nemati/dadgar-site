create table if not exists schema_migrations (
  name text primary key,
  applied_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists users (
  id text primary key,
  email text not null,
  password_hash text not null,
  name text not null,
  phone text,
  role text not null default 'CLIENT' check (role in ('ADMIN', 'LAWYER', 'CLIENT')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'DISABLED', 'PASSWORD_RESET_REQUIRED')),
  password_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists users_role_status_idx on users(role, status);
create unique index if not exists users_email_lower_unique on users(lower(email));

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at before update on users
for each row execute function set_updated_at();

create table if not exists consultation_requests (
  id bigserial primary key,
  name text not null,
  phone text not null,
  email text,
  practice_area text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);
create index if not exists consultation_requests_status_created_idx on consultation_requests(status, created_at desc);

create table if not exists blog_posts (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text not null,
  content text not null,
  published boolean not null default false,
  featured boolean not null default false,
  image_url text,
  image_file_id text,
  image_alt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blog_posts_public_idx on blog_posts(published, featured desc, created_at desc);

drop trigger if exists blog_posts_set_updated_at on blog_posts;
create trigger blog_posts_set_updated_at before update on blog_posts
for each row execute function set_updated_at();

create table if not exists client_cases (
  id bigserial primary key,
  client_id text not null references users(id) on delete cascade,
  case_number text not null unique,
  title text not null,
  court text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'waiting', 'closed')),
  description text,
  next_action text,
  next_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, client_id)
);
create index if not exists client_cases_client_idx on client_cases(client_id, updated_at desc);
create index if not exists client_cases_status_idx on client_cases(status);

drop trigger if exists client_cases_set_updated_at on client_cases;
create trigger client_cases_set_updated_at before update on client_cases
for each row execute function set_updated_at();

create table if not exists case_updates (
  id bigserial primary key,
  case_id bigint not null references client_cases(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists case_updates_case_idx on case_updates(case_id, created_at desc);

create table if not exists client_documents (
  id bigserial primary key,
  case_id bigint not null,
  client_id text not null,
  title text not null,
  file_id text,
  file_path text not null unique,
  file_name text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now(),
  foreign key (case_id, client_id) references client_cases(id, client_id) on delete cascade
);
create index if not exists client_documents_case_idx on client_documents(case_id, created_at desc);
create index if not exists client_documents_client_idx on client_documents(client_id);

create table if not exists support_threads (
  id bigserial primary key,
  client_id text not null references users(id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists support_threads_client_idx on support_threads(client_id, updated_at desc);
create index if not exists support_threads_status_idx on support_threads(status);

drop trigger if exists support_threads_set_updated_at on support_threads;
create trigger support_threads_set_updated_at before update on support_threads
for each row execute function set_updated_at();

create table if not exists support_messages (
  id bigserial primary key,
  thread_id bigint not null references support_threads(id) on delete cascade,
  sender_id text not null references users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists support_messages_thread_idx on support_messages(thread_id, created_at);

create table if not exists appointments (
  id bigserial primary key,
  client_id text not null references users(id) on delete cascade,
  subject text not null,
  requested_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists appointments_client_idx on appointments(client_id, requested_at desc);
create index if not exists appointments_status_idx on appointments(status, requested_at);

drop trigger if exists appointments_set_updated_at on appointments;
create trigger appointments_set_updated_at before update on appointments
for each row execute function set_updated_at();

create table if not exists audit_logs (
  id bigserial primary key,
  actor_id text references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_actor_created_idx on audit_logs(actor_id, created_at desc);
