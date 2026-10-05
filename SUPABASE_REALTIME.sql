-- College Event Management System
-- Supabase Realtime setup
-- Run this in Supabase Dashboard -> SQL Editor -> Run

-- Make the project tables eligible for Supabase Postgres Changes.
alter table if exists public.events replica identity full;
alter table if exists public.registrations replica identity full;
alter table if exists public.students replica identity full;

-- Add the tables to the Supabase realtime publication if they are not
-- already present. PostgreSQL will reject duplicate membership, so use
-- conditional DO blocks.

do $$
begin
  if to_regclass('public.events') is not null
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'events'
     ) then
    execute 'alter publication supabase_realtime add table public.events';
  end if;
end $$;

do $$
begin
  if to_regclass('public.registrations') is not null
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'registrations'
     ) then
    execute 'alter publication supabase_realtime add table public.registrations';
  end if;
end $$;

do $$
begin
  if to_regclass('public.students') is not null
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'students'
     ) then
    execute 'alter publication supabase_realtime add table public.students';
  end if;
end $$;

-- Verify the realtime tables after running the script.
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
  and schemaname = 'public'
  and tablename in ('events', 'registrations', 'students')
order by tablename;
