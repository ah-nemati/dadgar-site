-- Authentication repair migration.
-- Run this migration (or re-run supabase/schema.sql) after deploying the auth fixes.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = case
      when profiles.full_name = '' then excluded.full_name
      else profiles.full_name
    end,
    phone = coalesce(profiles.phone, excluded.phone);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, email, phone)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  u.email,
  u.raw_user_meta_data->>'phone'
from auth.users u
on conflict (id) do update
set
  email = excluded.email,
  full_name = case
    when profiles.full_name = '' then excluded.full_name
    else profiles.full_name
  end,
  phone = coalesce(profiles.phone, excluded.phone);

create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  result public.profiles;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  insert into public.profiles (id, full_name, email, phone)
  select
    u.id,
    coalesce(u.raw_user_meta_data->>'full_name', ''),
    u.email,
    u.raw_user_meta_data->>'phone'
  from auth.users u
  where u.id = auth.uid()
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = case
      when profiles.full_name = '' then excluded.full_name
      else profiles.full_name
    end,
    phone = coalesce(profiles.phone, excluded.phone)
  returning * into result;

  return result;
end;
$$;

revoke all on function public.ensure_my_profile() from public;
grant execute on function public.ensure_my_profile() to authenticated;
