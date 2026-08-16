create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  knowledge_level text,
  learning_goal text,
  has_completed_onboarding boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_symbol text not null references public.companies(symbol) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, company_symbol)
);

create table if not exists public.saved_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.saved_announcements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  announcement_id uuid not null references public.official_updates(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, announcement_id)
);

alter table public.profiles enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.saved_lessons enable row level security;
alter table public.saved_announcements enable row level security;

drop policy if exists "Users can select own profile" on public.profiles;
create policy "Users can select own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can select own watchlist items" on public.watchlist_items;
create policy "Users can select own watchlist items"
on public.watchlist_items for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own watchlist items" on public.watchlist_items;
create policy "Users can insert own watchlist items"
on public.watchlist_items for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own watchlist items" on public.watchlist_items;
create policy "Users can delete own watchlist items"
on public.watchlist_items for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can select own saved lessons" on public.saved_lessons;
create policy "Users can select own saved lessons"
on public.saved_lessons for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved lessons" on public.saved_lessons;
create policy "Users can insert own saved lessons"
on public.saved_lessons for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved lessons" on public.saved_lessons;
create policy "Users can delete own saved lessons"
on public.saved_lessons for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can select own saved announcements" on public.saved_announcements;
create policy "Users can select own saved announcements"
on public.saved_announcements for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved announcements" on public.saved_announcements;
create policy "Users can insert own saved announcements"
on public.saved_announcements for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved announcements" on public.saved_announcements;
create policy "Users can delete own saved announcements"
on public.saved_announcements for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    now(),
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
