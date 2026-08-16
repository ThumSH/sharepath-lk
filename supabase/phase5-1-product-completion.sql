create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text unique not null,
  short_definition text not null,
  detailed_definition text,
  category text,
  related_lesson_id text references public.lessons(id) on delete set null,
  sort_order int default 0,
  source_label text default 'Educational content',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  last_viewed_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.top_movers (
  id uuid primary key default gen_random_uuid(),
  mover_date date not null default current_date,
  company_symbol text not null references public.companies(symbol) on delete cascade,
  company_name text not null,
  movement_type text not null check (movement_type in ('gainer', 'loser', 'most_traded')),
  change_percent numeric,
  traded_volume bigint,
  turnover numeric,
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(mover_date, company_symbol, movement_type)
);

alter table public.companies add column if not exists data_status text default 'sample';
alter table public.official_updates add column if not exists data_status text default 'sample';
alter table public.company_announcements add column if not exists data_status text default 'sample';
alter table public.company_factor_snapshots add column if not exists data_status text default 'sample';

alter table public.glossary_terms enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.top_movers enable row level security;

drop policy if exists "Public read glossary terms" on public.glossary_terms;
create policy "Public read glossary terms"
on public.glossary_terms for select
to anon, authenticated
using (true);

drop policy if exists "User read own lesson progress" on public.lesson_progress;
create policy "User read own lesson progress"
on public.lesson_progress for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "User insert own lesson progress" on public.lesson_progress;
create policy "User insert own lesson progress"
on public.lesson_progress for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "User update own lesson progress" on public.lesson_progress;
create policy "User update own lesson progress"
on public.lesson_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "User delete own lesson progress" on public.lesson_progress;
create policy "User delete own lesson progress"
on public.lesson_progress for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Public read top movers" on public.top_movers;
create policy "Public read top movers"
on public.top_movers for select
to anon, authenticated
using (true);
