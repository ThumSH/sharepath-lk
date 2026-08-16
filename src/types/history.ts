export type CompanyPriceHistoryPoint = {
  id?: string;
  companySymbol: string;
  tradeDate: string;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  closePrice: number;
  volume?: number;
  turnover?: number;
  sourceLabel: string;
};

export type CompanyFinancialHistoryPoint = {
  id?: string;
  companySymbol: string;
  financialYear: string;
  revenue?: number;
  profitAfterTax?: number;
  eps?: number;
  navPerShare?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  sourceLabel: string;
};

export type CompanyDividendHistoryPoint = {
  id?: string;
  companySymbol: string;
  dividendYear: string;
  dividendPerShare?: number;
  dividendType?: string;
  sourceLabel: string;
};

export type MarketIndexHistoryPoint = {
  id?: string;
  indexCode: 'ASPI' | 'SPSL20';
  tradeDate: string;
  closeValue: number;
  changeValue?: number;
  changePercent?: number;
  sourceLabel: string;
};

export type SectorSummary = {
  id?: string;
  sectorName: string;
  summaryDate: string;
  turnover?: number;
  volume?: number;
  marketCapLabel?: string;
  changePercent?: number;
  companiesCount?: number;
  sourceLabel: string;
};

export type CompanyFactorSnapshot = {
  id?: string;
  companySymbol: string;
  snapshotDate: string;
  revenueTrend?: string;
  profitTrend?: string;
  dividendStatus?: string;
  priceHistoryNote?: string;
  announcementNote?: string;
  liquidityNote?: string;
  strengths: string[];
  concerns: string[];
  dataGaps: string[];
  sourceLabel: string;
};

export type CompanyPriceHistoryDbRow = {
  id?: string;
  company_symbol: string;
  trade_date: string;
  open_price: number | string | null;
  high_price: number | string | null;
  low_price: number | string | null;
  close_price: number | string | null;
  volume: number | string | null;
  turnover: number | string | null;
  source_label: string | null;
};

export type CompanyFinancialHistoryDbRow = {
  id?: string;
  company_symbol: string;
  financial_year: string;
  revenue: number | string | null;
  profit_after_tax: number | string | null;
  eps: number | string | null;
  nav_per_share: number | string | null;
  total_assets: number | string | null;
  total_liabilities: number | string | null;
  source_label: string | null;
};

export type CompanyDividendHistoryDbRow = {
  id?: string;
  company_symbol: string;
  dividend_year: string;
  dividend_per_share: number | string | null;
  dividend_type: string | null;
  source_label: string | null;
};

export type MarketIndexHistoryDbRow = {
  id?: string;
  index_code: 'ASPI' | 'SPSL20';
  trade_date: string;
  close_value: number | string | null;
  change_value: number | string | null;
  change_percent: number | string | null;
  source_label: string | null;
};

export type SectorSummaryDbRow = {
  id?: string;
  sector_name: string;
  summary_date: string;
  turnover: number | string | null;
  volume: number | string | null;
  market_cap_label: string | null;
  change_percent: number | string | null;
  companies_count: number | null;
  source_label: string | null;
};

export type CompanyFactorSnapshotDbRow = {
  id?: string;
  company_symbol: string;
  snapshot_date: string;
  revenue_trend: string | null;
  profit_trend: string | null;
  dividend_status: string | null;
  price_history_note: string | null;
  announcement_note: string | null;
  liquidity_note: string | null;
  strengths: string[] | null;
  concerns: string[] | null;
  data_gaps: string[] | null;
  source_label: string | null;
};

export type ChartRange = '1M' | '6M' | '1Y' | '5Y' | 'ALL';
