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
