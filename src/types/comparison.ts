import type { Company } from '@/types/company';
import type {
  CompanyDividendHistoryPoint,
  CompanyFactorSnapshot,
  CompanyFinancialHistoryPoint,
} from '@/types/history';

export type ComparisonMetric = {
  label: string;
  description?: string;
  values: {
    symbol: string;
    value: string | number | null;
  }[];
};

export type CompanyComparisonData = {
  companies: Company[];
  financialHistory: Record<string, CompanyFinancialHistoryPoint[]>;
  dividendHistory: Record<string, CompanyDividendHistoryPoint[]>;
  factorSnapshots: Record<string, CompanyFactorSnapshot>;
  metrics: ComparisonMetric[];
  sourceLabel: string;
};
