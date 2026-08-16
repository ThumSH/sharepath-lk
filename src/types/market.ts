export type MarketSummary = {
  aspi: string;
  spSL20: string;
  turnover: string;
  tradedCompanies: number;
  topGainer: string;
  topLoser: string;
  mostTraded: string;
};

export type CurrencyRate = {
  code: string;
  pair: string;
  rate: string;
  movement: string;
  sourceLabel?: string;
  updatedAt?: string;
};

export type OfficialUpdate = {
  id?: string;
  title: string;
  category?: string;
  publishedDate?: string;
  summary: string;
  sourceLabel?: string;
};

export type MarketSummaryDbRow = {
  id?: string;
  summary_date: string;
  aspi: string | null;
  sp_sl20: string | null;
  turnover: string | null;
  traded_companies: number | null;
  top_gainer: string | null;
  top_loser: string | null;
  most_traded: string | null;
  source_label: string | null;
};

export type CurrencyRateDbRow = {
  id?: string;
  code: string;
  pair: string;
  rate: string;
  movement: string | null;
  source_label: string | null;
  updated_at: string | null;
};

export type OfficialUpdateDbRow = {
  id?: string;
  title: string;
  category: string | null;
  published_date: string | null;
  summary: string | null;
  source_label: string | null;
};
