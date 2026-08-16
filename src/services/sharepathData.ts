import { companies as fallbackCompanies } from '@/data/companies';
import { currencies as fallbackCurrencies } from '@/data/currencies';
import { lessons as fallbackLessons } from '@/data/lessons';
import { marketSummary as fallbackMarketSummary, officialUpdates as fallbackOfficialUpdates } from '@/data/market';
import {
  mapCompanyAnnouncementFromDb,
  mapCompanyFromDb,
  mapCurrencyRateFromDb,
  mapLessonFromDb,
  mapMarketSummaryFromDb,
  mapOfficialUpdateFromDb,
} from '@/lib/mappers';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
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

export type DataResult<T> = {
  data: T;
  isFallback: boolean;
};

function warnFallback(label: string, error?: unknown) {
  if (__DEV__) {
    console.warn(`Using sample fallback data for ${label}.`, error);
  }
}

function fallbackOfficialUpdateObjects(): OfficialUpdate[] {
  return fallbackOfficialUpdates.map((summary, index) => ({
    id: `sample-update-${index + 1}`,
    title: 'Official update summary',
    summary,
    sourceLabel: 'Sample data',
  }));
}

function fallbackCompanyAnnouncements(symbol: string): CompanyAnnouncement[] {
  const company = fallbackCompanies.find((item) => item.symbol === symbol);
  return (
    company?.announcements.map((title, index) => ({
      id: `${symbol}-sample-announcement-${index + 1}`,
      companySymbol: symbol,
      title,
      summary: 'Official update summary for educational review.',
      sourceLabel: 'Sample data',
    })) ?? []
  );
}

function withFallback<T>(label: string, data: T, error?: unknown): DataResult<T> {
  warnFallback(label, error);
  return { data, isFallback: true };
}

export async function getCompanies(): Promise<DataResult<Company[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('companies', fallbackCompanies);
  }

  try {
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (companiesError || !companies) {
      return withFallback('companies', fallbackCompanies, companiesError);
    }

    const symbols = (companies as CompanyDbRow[]).map((company) => company.symbol);
    const { data: financials, error: financialsError } = await supabase
      .from('company_financials')
      .select('*')
      .in('company_symbol', symbols);
    const { data: announcements, error: announcementsError } = await supabase
      .from('company_announcements')
      .select('*')
      .in('company_symbol', symbols)
      .order('created_at', { ascending: false });

    if (financialsError || announcementsError) {
      return withFallback('companies', fallbackCompanies, financialsError ?? announcementsError);
    }

    const financialRows = (financials ?? []) as CompanyFinancialsDbRow[];
    const announcementRows = (announcements ?? []) as CompanyAnnouncementDbRow[];

    return {
      data: (companies as CompanyDbRow[]).map((company) =>
        mapCompanyFromDb(
          company,
          financialRows.find((financial) => financial.company_symbol === company.symbol),
          announcementRows.filter((announcement) => announcement.company_symbol === company.symbol)
        )
      ),
      isFallback: false,
    };
  } catch (error) {
    return withFallback('companies', fallbackCompanies, error);
  }
}

export async function getCompanyBySymbol(symbol: string): Promise<DataResult<Company | undefined>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback(
      'company',
      fallbackCompanies.find((company) => company.symbol === symbol)
    );
  }

  try {
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('symbol', symbol)
      .maybeSingle();

    if (companyError || !company) {
      return withFallback(
        'company',
        fallbackCompanies.find((item) => item.symbol === symbol),
        companyError
      );
    }

    const { data: financials, error: financialsError } = await supabase
      .from('company_financials')
      .select('*')
      .eq('company_symbol', symbol)
      .maybeSingle();
    const { data: announcements, error: announcementsError } = await supabase
      .from('company_announcements')
      .select('*')
      .eq('company_symbol', symbol)
      .order('created_at', { ascending: false });

    if (financialsError || announcementsError) {
      return withFallback(
        'company',
        fallbackCompanies.find((item) => item.symbol === symbol),
        financialsError ?? announcementsError
      );
    }

    return {
      data: mapCompanyFromDb(
        company as CompanyDbRow,
        financials as CompanyFinancialsDbRow | null,
        (announcements ?? []) as CompanyAnnouncementDbRow[]
      ),
      isFallback: false,
    };
  } catch (error) {
    return withFallback(
      'company',
      fallbackCompanies.find((company) => company.symbol === symbol),
      error
    );
  }
}

export async function getLessons(): Promise<DataResult<Lesson[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('lessons', fallbackLessons);
  }

  try {
    const { data, error } = await supabase.from('lessons').select('*').order('sort_order', { ascending: true });

    if (error || !data) {
      return withFallback('lessons', fallbackLessons, error);
    }

    return { data: (data as LessonDbRow[]).map(mapLessonFromDb), isFallback: false };
  } catch (error) {
    return withFallback('lessons', fallbackLessons, error);
  }
}

export async function getLessonById(id: string): Promise<DataResult<Lesson | undefined>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback(
      'lesson',
      fallbackLessons.find((lesson) => lesson.id === id)
    );
  }

  try {
    const { data, error } = await supabase.from('lessons').select('*').eq('id', id).maybeSingle();

    if (error || !data) {
      return withFallback(
        'lesson',
        fallbackLessons.find((lesson) => lesson.id === id),
        error
      );
    }

    return { data: mapLessonFromDb(data as LessonDbRow), isFallback: false };
  } catch (error) {
    return withFallback(
      'lesson',
      fallbackLessons.find((lesson) => lesson.id === id),
      error
    );
  }
}

export async function getLatestMarketSummary(): Promise<DataResult<MarketSummary>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('market summary', fallbackMarketSummary);
  }

  try {
    const { data, error } = await supabase
      .from('market_summaries')
      .select('*')
      .order('summary_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return withFallback('market summary', fallbackMarketSummary, error);
    }

    return { data: mapMarketSummaryFromDb(data as MarketSummaryDbRow), isFallback: false };
  } catch (error) {
    return withFallback('market summary', fallbackMarketSummary, error);
  }
}

export async function getCurrencyRates(): Promise<DataResult<CurrencyRate[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('currency rates', fallbackCurrencies);
  }

  try {
    const { data, error } = await supabase.from('currency_rates').select('*').order('code', { ascending: true });

    if (error || !data) {
      return withFallback('currency rates', fallbackCurrencies, error);
    }

    return { data: (data as CurrencyRateDbRow[]).map(mapCurrencyRateFromDb), isFallback: false };
  } catch (error) {
    return withFallback('currency rates', fallbackCurrencies, error);
  }
}

export async function getOfficialUpdates(): Promise<DataResult<OfficialUpdate[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('official updates', fallbackOfficialUpdateObjects());
  }

  try {
    const { data, error } = await supabase
      .from('official_updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return withFallback('official updates', fallbackOfficialUpdateObjects(), error);
    }

    return { data: (data as OfficialUpdateDbRow[]).map(mapOfficialUpdateFromDb), isFallback: false };
  } catch (error) {
    return withFallback('official updates', fallbackOfficialUpdateObjects(), error);
  }
}

export async function getCompanyAnnouncements(symbol: string): Promise<DataResult<CompanyAnnouncement[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('company announcements', fallbackCompanyAnnouncements(symbol));
  }

  try {
    const { data, error } = await supabase
      .from('company_announcements')
      .select('*')
      .eq('company_symbol', symbol)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return withFallback('company announcements', fallbackCompanyAnnouncements(symbol), error);
    }

    return { data: (data as CompanyAnnouncementDbRow[]).map(mapCompanyAnnouncementFromDb), isFallback: false };
  } catch (error) {
    return withFallback('company announcements', fallbackCompanyAnnouncements(symbol), error);
  }
}
