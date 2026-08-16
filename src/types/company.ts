export type Company = {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  oneYearMovement: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCapLabel: string;
  lastUpdated: string;
  summary: string;
  financials: {
    revenue: string;
    profitAfterTax: string;
    eps: string;
    navPerShare: string;
  };
  dividendNote: string;
  announcements: string[];
};

export type CompanyFinancials = Company['financials'];

export type CompanyAnnouncement = {
  id?: string;
  companySymbol?: string;
  title: string;
  category?: string;
  publishedDate?: string;
  summary: string;
  sourceLabel?: string;
};

export type CompanyDbRow = {
  id?: string;
  symbol: string;
  name: string;
  sector: string;
  current_price: number | string | null;
  one_year_movement: number | string | null;
  fifty_two_week_high: number | string | null;
  fifty_two_week_low: number | string | null;
  market_cap_label: string | null;
  last_updated: string | null;
  summary: string | null;
  dividend_note: string | null;
};

export type CompanyFinancialsDbRow = {
  id?: string;
  company_symbol: string;
  revenue: string | null;
  profit_after_tax: string | null;
  eps: string | null;
  nav_per_share: string | null;
};

export type CompanyAnnouncementDbRow = {
  id?: string;
  company_symbol: string;
  title: string;
  category: string | null;
  published_date: string | null;
  summary: string | null;
  source_label: string | null;
};
