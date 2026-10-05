-- College Event Management System - Schema Setup

-- 1. Create students table
create table public.students (
    sid text primary key,
    name text not null,
    dept text not null,
    year text not null,
    section text not null,
    email text not null,
    phone text not null,
    password text not null,
    created_at timestamp with time zone default now()
);

-- 2. Create events table
create table public.events (
    id bigint primary key generated always as identity,
    name text not null,
    cat text not null,
    date text not null,
    time text not null,
    max integer not null,
    count integer not null default 0,
    venue text not null,
    org text not null,
    img text,
    "desc" text not null,
    created_at timestamp with time zone default now()
);

-- 3. Create registrations table
create table public.registrations (
    id text primary key,
    sid text references public.students(sid) on delete cascade not null,
    name text not null,
    dept text not null,
    year text not null,
    section text not null,
    email text not null,
    phone text not null,
    eid bigint references public.events(id) on delete cascade not null,
    type text not null,
    team text,
    req text,
    date text not null,
    status text not null,
    created_at timestamp with time zone default now()
);

-- 4. Enable Row Level Security (RLS) and create public policies
-- (Since this app accesses Supabase anonymously from the browser)

alter table public.students enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- Allow all operations for anon role (public access)
create policy "Allow public select on students" on public.students for select using (true);
create policy "Allow public insert on students" on public.students for insert with check (true);
create policy "Allow public update on students" on public.students for update using (true);
create policy "Allow public delete on students" on public.students for delete using (true);

create policy "Allow public select on events" on public.events for select using (true);
create policy "Allow public insert on events" on public.events for insert with check (true);
create policy "Allow public update on events" on public.events for update using (true);
create policy "Allow public delete on events" on public.events for delete using (true);

create policy "Allow public select on registrations" on public.registrations for select using (true);
create policy "Allow public insert on registrations" on public.registrations for insert with check (true);
create policy "Allow public update on registrations" on public.registrations for update using (true);
create policy "Allow public delete on registrations" on public.registrations for delete using (true);
