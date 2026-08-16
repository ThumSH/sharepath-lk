import {
  companyDividendHistory,
  companyFactorSnapshots,
  companyFinancialHistory,
  companyPriceHistory,
  marketIndexHistory,
  sectorSummaries,
} from '@/data/history';
import {
  mapCompanyDividendHistoryFromDb,
  mapCompanyFactorSnapshotFromDb,
  mapCompanyFinancialHistoryFromDb,
  mapCompanyPriceHistoryFromDb,
  mapMarketIndexHistoryFromDb,
  mapSectorSummaryFromDb,
} from '@/lib/mappers';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { DataResult } from '@/services/sharepathData';
import type {
  ChartRange,
  CompanyDividendHistoryDbRow,
  CompanyDividendHistoryPoint,
  CompanyFactorSnapshot,
  CompanyFactorSnapshotDbRow,
  CompanyFinancialHistoryDbRow,
  CompanyFinancialHistoryPoint,
  CompanyPriceHistoryDbRow,
  CompanyPriceHistoryPoint,
  MarketIndexHistoryDbRow,
  MarketIndexHistoryPoint,
  SectorSummary,
  SectorSummaryDbRow,
} from '@/types/history';

function warnFallback(label: string, error?: unknown) {
  if (__DEV__) {
    console.warn(`Using sample fallback data for ${label}.`, error);
  }
}

function withFallback<T>(label: string, data: T, error?: unknown): DataResult<T> {
  warnFallback(label, error);
  return { data, isFallback: true };
}

function rangeStart(range: ChartRange = 'ALL') {
  if (range === 'ALL') {
    return undefined;
  }

  const date = new Date('2026-08-16T00:00:00.000Z');
  const monthsByRange: Record<Exclude<ChartRange, 'ALL'>, number> = {
    '1M': 1,
    '6M': 6,
    '1Y': 12,
    '5Y': 60,
  };

  date.setMonth(date.getMonth() - monthsByRange[range]);
  return date.toISOString().slice(0, 10);
}

function applyRange<T extends { tradeDate: string }>(items: T[], range: ChartRange = 'ALL') {
  const start = rangeStart(range);
  return start ? items.filter((item) => item.tradeDate >= start) : items;
}

function fallbackFactorSnapshot(symbol: string): CompanyFactorSnapshot {
  return (
    companyFactorSnapshots.find((item) => item.companySymbol === symbol) ?? {
      companySymbol: symbol,
      snapshotDate: '2026-08-14',
      strengths: [],
      concerns: [],
      dataGaps: [
        'Not enough structured data is available yet. Review official reports and announcements before making any decision.',
      ],
      sourceLabel: 'Sample data',
    }
  );
}

export async function getCompanyPriceHistory(
  symbol: string,
  range: ChartRange = '1Y'
): Promise<DataResult<CompanyPriceHistoryPoint[]>> {
  const fallback = applyRange(
    companyPriceHistory.filter((item) => item.companySymbol === symbol),
    range
  );

  if (!isSupabaseConfigured || !supabase) {
    return withFallback('company price history', fallback);
  }

  try {
    let query = supabase
      .from('company_price_history')
      .select('*')
      .eq('company_symbol', symbol)
      .order('trade_date', { ascending: true });
    const start = rangeStart(range);

    if (start) {
      query = query.gte('trade_date', start);
    }

    const { data, error } = await query;
    if (error || !data) {
      return withFallback('company price history', fallback, error);
    }

    return { data: (data as CompanyPriceHistoryDbRow[]).map(mapCompanyPriceHistoryFromDb), isFallback: false };
  } catch (error) {
    return withFallback('company price history', fallback, error);
  }
}

export async function getCompanyFinancialHistory(
  symbol: string
): Promise<DataResult<CompanyFinancialHistoryPoint[]>> {
  const fallback = companyFinancialHistory.filter((item) => item.companySymbol === symbol);

  if (!isSupabaseConfigured || !supabase) {
    return withFallback('company financial history', fallback);
  }

  try {
    const { data, error } = await supabase
      .from('company_financial_history')
      .select('*')
      .eq('company_symbol', symbol)
      .order('financial_year', { ascending: true });

    if (error || !data) {
      return withFallback('company financial history', fallback, error);
    }

    return { data: (data as CompanyFinancialHistoryDbRow[]).map(mapCompanyFinancialHistoryFromDb), isFallback: false };
  } catch (error) {
    return withFallback('company financial history', fallback, error);
  }
}

export async function getCompanyDividendHistory(
  symbol: string
): Promise<DataResult<CompanyDividendHistoryPoint[]>> {
  const fallback = companyDividendHistory.filter((item) => item.companySymbol === symbol);

  if (!isSupabaseConfigured || !supabase) {
    return withFallback('company dividend history', fallback);
  }

  try {
    const { data, error } = await supabase
      .from('company_dividend_history')
      .select('*')
      .eq('company_symbol', symbol)
      .order('dividend_year', { ascending: true });

    if (error || !data) {
      return withFallback('company dividend history', fallback, error);
    }

    return { data: (data as CompanyDividendHistoryDbRow[]).map(mapCompanyDividendHistoryFromDb), isFallback: false };
  } catch (error) {
    return withFallback('company dividend history', fallback, error);
  }
}

export async function getMarketIndexHistory(
  indexCode: 'ASPI' | 'SPSL20',
  range: ChartRange = '1Y'
): Promise<DataResult<MarketIndexHistoryPoint[]>> {
  const fallback = applyRange(
    marketIndexHistory.filter((item) => item.indexCode === indexCode),
    range
  );

  if (!isSupabaseConfigured || !supabase) {
    return withFallback('market index history', fallback);
  }

  try {
    let query = supabase
      .from('market_index_history')
      .select('*')
      .eq('index_code', indexCode)
      .order('trade_date', { ascending: true });
    const start = rangeStart(range);

    if (start) {
      query = query.gte('trade_date', start);
    }

    const { data, error } = await query;
    if (error || !data) {
      return withFallback('market index history', fallback, error);
    }

    return { data: (data as MarketIndexHistoryDbRow[]).map(mapMarketIndexHistoryFromDb), isFallback: false };
  } catch (error) {
    return withFallback('market index history', fallback, error);
  }
}

export async function getSectorSummaries(): Promise<DataResult<SectorSummary[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('sector summaries', sectorSummaries);
  }

  try {
    const { data, error } = await supabase
      .from('sector_summaries')
      .select('*')
      .order('turnover', { ascending: false });

    if (error || !data) {
      return withFallback('sector summaries', sectorSummaries, error);
    }

    return { data: (data as SectorSummaryDbRow[]).map(mapSectorSummaryFromDb), isFallback: false };
  } catch (error) {
    return withFallback('sector summaries', sectorSummaries, error);
  }
}

export async function getCompanyFactorSnapshot(symbol: string): Promise<DataResult<CompanyFactorSnapshot>> {
  const fallback = fallbackFactorSnapshot(symbol);

  if (!isSupabaseConfigured || !supabase) {
    return withFallback('company factor snapshot', fallback);
  }

  try {
    const { data, error } = await supabase
      .from('company_factor_snapshots')
      .select('*')
      .eq('company_symbol', symbol)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return withFallback('company factor snapshot', fallback, error);
    }

    return { data: mapCompanyFactorSnapshotFromDb(data as CompanyFactorSnapshotDbRow), isFallback: false };
  } catch (error) {
    return withFallback('company factor snapshot', fallback, error);
  }
}
