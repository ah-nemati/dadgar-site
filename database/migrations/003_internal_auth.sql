-- Convert existing identity-provider profiles in-place so all foreign keys,
-- cases, messages, appointments and audit records keep their current owners.
do $$
begin
  if to_regclass('public.users') is null and to_regclass('public.profiles') is not null then
    alter table profiles rename to users;
  elsif to_regclass('public.users') is not null and to_regclass('public.profiles') is not null then
    raise exception 'Both users and profiles tables exist; resolve the duplicate identity tables before migration.';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'full_name'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'name'
  ) then
    alter table users rename column full_name to name;
  end if;
end;
$$;

alter table users add column if not exists password_hash text;
alter table users add column if not exists status text;
alter table users add column if not exists password_changed_at timestamptz;

alter table users drop constraint if exists profiles_role_check;
alter table users drop constraint if exists users_role_check;
alter table users drop constraint if exists users_status_check;

update users
set role = case lower(role)
  when 'admin' then 'ADMIN'
  when 'lawyer' then 'LAWYER'
  else 'CLIENT'
end;

update users
set email = 'legacy-' || md5(id) || '@invalid.local'
where email is null or btrim(email) = '';

update users set name = 'کاربر انتقال‌یافته' where name is null or btrim(name) = '';
update users set password_hash = '!RESET_REQUIRED!' where password_hash is null or password_hash = '';
update users set status = 'PASSWORD_RESET_REQUIRED' where status is null or status = '';

alter table users alter column email set not null;
alter table users alter column name set not null;
alter table users alter column password_hash set not null;
alter table users alter column role set default 'CLIENT';
alter table users alter column status set default 'ACTIVE';
alter table users alter column status set not null;

alter table users add constraint users_role_check
  check (role in ('ADMIN', 'LAWYER', 'CLIENT'));
alter table users add constraint users_status_check
  check (status in ('ACTIVE', 'DISABLED', 'PASSWORD_RESET_REQUIRED'));

drop index if exists profiles_email_lower_unique;
create unique index if not exists users_email_lower_unique on users(lower(email));
create index if not exists users_role_status_idx on users(role, status);

drop trigger if exists profiles_set_updated_at on users;
drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at before update on users
for each row execute function set_updated_at();

create table if not exists user_sessions (
  token_hash char(64) primary key,
  user_id text not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists user_sessions_user_idx on user_sessions(user_id);
create index if not exists user_sessions_expiry_idx on user_sessions(expires_at);

create table if not exists password_reset_tokens (
  token_hash char(64) primary key,
  user_id text not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  requested_at timestamptz not null default now()
);
create index if not exists password_reset_tokens_user_idx on password_reset_tokens(user_id);
create index if not exists password_reset_tokens_expiry_idx on password_reset_tokens(expires_at);

create table if not exists auth_rate_limits (
  identifier_hash char(64) not null,
  action text not null,
  attempts integer not null default 0,
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at timestamptz not null default now(),
  primary key (identifier_hash, action)
);
create index if not exists auth_rate_limits_cleanup_idx
  on auth_rate_limits(updated_at);

create table if not exists lawyer_profiles (
  user_id text primary key references users(id) on delete cascade,
  license_number text not null default '',
  education text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists lawyer_profiles_set_updated_at on lawyer_profiles;
create trigger lawyer_profiles_set_updated_at before update on lawyer_profiles
for each row execute function set_updated_at();
