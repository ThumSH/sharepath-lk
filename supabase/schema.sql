create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  symbol text unique not null,
  name text not null,
  sector text not null,
  current_price numeric,
  one_year_movement numeric,
  fifty_two_week_high numeric,
  fifty_two_week_low numeric,
  market_cap_label text,
  last_updated text,
  summary text,
  dividend_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.company_financials (
  id uuid primary key default gen_random_uuid(),
  company_symbol text references public.companies(symbol) on delete cascade,
  revenue text,
  profit_after_tax text,
  eps text,
  nav_per_share text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.company_announcements (
  id uuid primary key default gen_random_uuid(),
  company_symbol text references public.companies(symbol) on delete cascade,
  title text not null,
  category text,
  published_date text,
  summary text,
  source_label text default 'Sample data',
  created_at timestamptz default now()
);

create table if not exists public.lessons (
  id text primary key,
  title text not null,
  category text not null,
  reading_time text,
  description text,
  content text,
  key_points text[],
  remember text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.market_summaries (
  id uuid primary key default gen_random_uuid(),
  summary_date date not null default current_date,
  aspi text,
  sp_sl20 text,
  turnover text,
  traded_companies int,
  top_gainer text,
  top_loser text,
  most_traded text,
  source_label text default 'Sample data',
  created_at timestamptz default now()
);

create table if not exists public.currency_rates (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  pair text not null,
  rate text not null,
  movement text,
  source_label text default 'Sample data',
  updated_at text,
  created_at timestamptz default now()
);

create table if not exists public.official_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  published_date text,
  summary text,
  source_label text default 'Sample data',
  created_at timestamptz default now()
);

alter table public.companies enable row level security;
alter table public.company_financials enable row level security;
alter table public.company_announcements enable row level security;
alter table public.lessons enable row level security;
alter table public.market_summaries enable row level security;
alter table public.currency_rates enable row level security;
alter table public.official_updates enable row level security;

drop policy if exists "Public read companies" on public.companies;
create policy "Public read companies"
on public.companies for select
to anon, authenticated
using (true);

drop policy if exists "Public read company financials" on public.company_financials;
create policy "Public read company financials"
on public.company_financials for select
to anon, authenticated
using (true);

drop policy if exists "Public read company announcements" on public.company_announcements;
create policy "Public read company announcements"
on public.company_announcements for select
to anon, authenticated
using (true);

drop policy if exists "Public read lessons" on public.lessons;
create policy "Public read lessons"
on public.lessons for select
to anon, authenticated
using (true);

drop policy if exists "Public read market summaries" on public.market_summaries;
create policy "Public read market summaries"
on public.market_summaries for select
to anon, authenticated
using (true);

drop policy if exists "Public read currency rates" on public.currency_rates;
create policy "Public read currency rates"
on public.currency_rates for select
to anon, authenticated
using (true);

drop policy if exists "Public read official updates" on public.official_updates;
create policy "Public read official updates"
on public.official_updates for select
to anon, authenticated
using (true);
