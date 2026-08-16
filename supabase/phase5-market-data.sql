create table if not exists public.company_price_history (
  id uuid primary key default gen_random_uuid(),
  company_symbol text not null references public.companies(symbol) on delete cascade,
  trade_date date not null,
  open_price numeric,
  high_price numeric,
  low_price numeric,
  close_price numeric,
  volume bigint,
  turnover numeric,
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(company_symbol, trade_date)
);

create table if not exists public.company_financial_history (
  id uuid primary key default gen_random_uuid(),
  company_symbol text not null references public.companies(symbol) on delete cascade,
  financial_year text not null,
  revenue numeric,
  profit_after_tax numeric,
  eps numeric,
  nav_per_share numeric,
  total_assets numeric,
  total_liabilities numeric,
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(company_symbol, financial_year)
);

create table if not exists public.company_dividend_history (
  id uuid primary key default gen_random_uuid(),
  company_symbol text not null references public.companies(symbol) on delete cascade,
  dividend_year text not null,
  dividend_per_share numeric,
  dividend_type text,
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(company_symbol, dividend_year, dividend_type)
);

create table if not exists public.market_index_history (
  id uuid primary key default gen_random_uuid(),
  index_code text not null,
  trade_date date not null,
  close_value numeric not null,
  change_value numeric,
  change_percent numeric,
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(index_code, trade_date)
);

create table if not exists public.sector_summaries (
  id uuid primary key default gen_random_uuid(),
  sector_name text not null,
  summary_date date not null default current_date,
  turnover numeric,
  volume bigint,
  market_cap_label text,
  change_percent numeric,
  companies_count int,
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(sector_name, summary_date)
);

create table if not exists public.company_factor_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_symbol text not null references public.companies(symbol) on delete cascade,
  snapshot_date date not null default current_date,
  revenue_trend text,
  profit_trend text,
  dividend_status text,
  price_history_note text,
  announcement_note text,
  liquidity_note text,
  strengths text[],
  concerns text[],
  data_gaps text[],
  source_label text default 'Sample data',
  created_at timestamptz default now(),
  unique(company_symbol, snapshot_date)
);

alter table public.company_price_history enable row level security;
alter table public.company_financial_history enable row level security;
alter table public.company_dividend_history enable row level security;
alter table public.market_index_history enable row level security;
alter table public.sector_summaries enable row level security;
alter table public.company_factor_snapshots enable row level security;

drop policy if exists "Public read company price history" on public.company_price_history;
create policy "Public read company price history"
on public.company_price_history for select
to anon, authenticated
using (true);

drop policy if exists "Public read company financial history" on public.company_financial_history;
create policy "Public read company financial history"
on public.company_financial_history for select
to anon, authenticated
using (true);

drop policy if exists "Public read company dividend history" on public.company_dividend_history;
create policy "Public read company dividend history"
on public.company_dividend_history for select
to anon, authenticated
using (true);

drop policy if exists "Public read market index history" on public.market_index_history;
create policy "Public read market index history"
on public.market_index_history for select
to anon, authenticated
using (true);

drop policy if exists "Public read sector summaries" on public.sector_summaries;
create policy "Public read sector summaries"
on public.sector_summaries for select
to anon, authenticated
using (true);

drop policy if exists "Public read company factor snapshots" on public.company_factor_snapshots;
create policy "Public read company factor snapshots"
on public.company_factor_snapshots for select
to anon, authenticated
using (true);
