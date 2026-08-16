import type {
  Company,
  CompanyAnnouncement,
  CompanyAnnouncementDbRow,
  CompanyDbRow,
  CompanyFinancialsDbRow,
} from '@/types/company';
import type { Lesson, LessonDbRow } from '@/types/lesson';
import type {
  CurrencyRate,
  CurrencyRateDbRow,
  MarketSummary,
  MarketSummaryDbRow,
  OfficialUpdate,
  OfficialUpdateDbRow,
} from '@/types/market';
import type {
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

function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function mapCompanyFromDb(
  company: CompanyDbRow,
  financials?: CompanyFinancialsDbRow | null,
  announcements: CompanyAnnouncementDbRow[] = []
): Company {
  return {
    symbol: company.symbol,
    name: company.name,
    sector: company.sector,
    currentPrice: toNumber(company.current_price),
    oneYearMovement: toNumber(company.one_year_movement),
    fiftyTwoWeekHigh: toNumber(company.fifty_two_week_high),
    fiftyTwoWeekLow: toNumber(company.fifty_two_week_low),
    marketCapLabel: company.market_cap_label ?? 'Not available',
    lastUpdated: company.last_updated ?? 'Not available',
    summary: company.summary ?? 'Historical company summary is not available yet.',
    financials: {
      revenue: financials?.revenue ?? 'Not available',
      profitAfterTax: financials?.profit_after_tax ?? 'Not available',
      eps: financials?.eps ?? 'Not available',
      navPerShare: financials?.nav_per_share ?? 'Not available',
    },
    dividendNote: company.dividend_note ?? 'Dividend history is not available yet.',
    announcements: announcements.map((announcement) => announcement.title),
  };
}

export function mapLessonFromDb(lesson: LessonDbRow): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    category: lesson.category,
    readingTime: lesson.reading_time ?? '3 min',
    description: lesson.description ?? '',
    content: lesson.content ?? undefined,
    keyPoints: lesson.key_points ?? [],
    remember: lesson.remember ?? '',
    sortOrder: lesson.sort_order ?? 0,
  };
}

export function mapMarketSummaryFromDb(summary: MarketSummaryDbRow): MarketSummary {
  return {
    aspi: summary.aspi ?? 'Not available',
    spSL20: summary.sp_sl20 ?? 'Not available',
    turnover: summary.turnover ?? 'Not available',
    tradedCompanies: summary.traded_companies ?? 0,
    topGainer: summary.top_gainer ?? 'Not available',
    topLoser: summary.top_loser ?? 'Not available',
    mostTraded: summary.most_traded ?? 'Not available',
  };
}

export function mapCurrencyRateFromDb(rate: CurrencyRateDbRow): CurrencyRate {
  return {
    code: rate.code,
    pair: rate.pair,
    rate: rate.rate,
    movement: rate.movement ?? 'No movement shown',
    sourceLabel: rate.source_label ?? 'Sample data',
    updatedAt: rate.updated_at ?? undefined,
  };
}

export function mapOfficialUpdateFromDb(update: OfficialUpdateDbRow): OfficialUpdate {
  return {
    id: update.id,
    title: update.title,
    category: update.category ?? undefined,
    publishedDate: update.published_date ?? undefined,
    summary: update.summary ?? 'Official update summary is not available yet.',
    sourceLabel: update.source_label ?? 'Sample data',
  };
}

export function mapCompanyAnnouncementFromDb(announcement: CompanyAnnouncementDbRow): CompanyAnnouncement {
  return {
    id: announcement.id,
    companySymbol: announcement.company_symbol,
    title: announcement.title,
    category: announcement.category ?? undefined,
    publishedDate: announcement.published_date ?? undefined,
    summary: announcement.summary ?? 'Official update summary is not available yet.',
    sourceLabel: announcement.source_label ?? 'Sample data',
  };
}

function optionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  return toNumber(value);
}

export function mapCompanyPriceHistoryFromDb(row: CompanyPriceHistoryDbRow): CompanyPriceHistoryPoint {
  return {
    id: row.id,
    companySymbol: row.company_symbol,
    tradeDate: row.trade_date,
    openPrice: optionalNumber(row.open_price),
    highPrice: optionalNumber(row.high_price),
    lowPrice: optionalNumber(row.low_price),
    closePrice: toNumber(row.close_price),
    volume: optionalNumber(row.volume),
    turnover: optionalNumber(row.turnover),
    sourceLabel: row.source_label ?? 'Sample data',
  };
}

export function mapCompanyFinancialHistoryFromDb(row: CompanyFinancialHistoryDbRow): CompanyFinancialHistoryPoint {
  return {
    id: row.id,
    companySymbol: row.company_symbol,
    financialYear: row.financial_year,
    revenue: optionalNumber(row.revenue),
    profitAfterTax: optionalNumber(row.profit_after_tax),
    eps: optionalNumber(row.eps),
    navPerShare: optionalNumber(row.nav_per_share),
    totalAssets: optionalNumber(row.total_assets),
    totalLiabilities: optionalNumber(row.total_liabilities),
    sourceLabel: row.source_label ?? 'Sample data',
  };
}

export function mapCompanyDividendHistoryFromDb(row: CompanyDividendHistoryDbRow): CompanyDividendHistoryPoint {
  return {
    id: row.id,
    companySymbol: row.company_symbol,
    dividendYear: row.dividend_year,
    dividendPerShare: optionalNumber(row.dividend_per_share),
    dividendType: row.dividend_type ?? undefined,
    sourceLabel: row.source_label ?? 'Sample data',
  };
}

export function mapMarketIndexHistoryFromDb(row: MarketIndexHistoryDbRow): MarketIndexHistoryPoint {
  return {
    id: row.id,
    indexCode: row.index_code,
    tradeDate: row.trade_date,
    closeValue: toNumber(row.close_value),
    changeValue: optionalNumber(row.change_value),
    changePercent: optionalNumber(row.change_percent),
    sourceLabel: row.source_label ?? 'Sample data',
  };
}

export function mapSectorSummaryFromDb(row: SectorSummaryDbRow): SectorSummary {
  return {
    id: row.id,
    sectorName: row.sector_name,
    summaryDate: row.summary_date,
    turnover: optionalNumber(row.turnover),
    volume: optionalNumber(row.volume),
    marketCapLabel: row.market_cap_label ?? undefined,
    changePercent: optionalNumber(row.change_percent),
    companiesCount: row.companies_count ?? undefined,
    sourceLabel: row.source_label ?? 'Sample data',
  };
}

export function mapCompanyFactorSnapshotFromDb(row: CompanyFactorSnapshotDbRow): CompanyFactorSnapshot {
  return {
    id: row.id,
    companySymbol: row.company_symbol,
    snapshotDate: row.snapshot_date,
    revenueTrend: row.revenue_trend ?? undefined,
    profitTrend: row.profit_trend ?? undefined,
    dividendStatus: row.dividend_status ?? undefined,
    priceHistoryNote: row.price_history_note ?? undefined,
    announcementNote: row.announcement_note ?? undefined,
    liquidityNote: row.liquidity_note ?? undefined,
    strengths: row.strengths ?? [],
    concerns: row.concerns ?? [],
    dataGaps: row.data_gaps ?? [],
    sourceLabel: row.source_label ?? 'Sample data',
  };
}
