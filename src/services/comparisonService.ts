import { getCompanyDividendHistory, getCompanyFactorSnapshot, getCompanyFinancialHistory } from '@/services/marketDataService';
import { getCompanyBySymbol } from '@/services/sharepathData';
import type { CompanyComparisonData, ComparisonMetric } from '@/types/comparison';

export async function getComparisonData(symbols: string[]): Promise<CompanyComparisonData> {
  const uniqueSymbols = Array.from(new Set(symbols)).slice(0, 3);
  const companyResults = await Promise.all(uniqueSymbols.map((symbol) => getCompanyBySymbol(symbol)));
  const companies = companyResults.flatMap((result) => (result.data ? [result.data] : []));
  const financialEntries = await Promise.all(uniqueSymbols.map(async (symbol) => [symbol, (await getCompanyFinancialHistory(symbol)).data] as const));
  const dividendEntries = await Promise.all(uniqueSymbols.map(async (symbol) => [symbol, (await getCompanyDividendHistory(symbol)).data] as const));
  const factorEntries = await Promise.all(uniqueSymbols.map(async (symbol) => [symbol, (await getCompanyFactorSnapshot(symbol)).data] as const));

  const metrics: ComparisonMetric[] = [
    { label: 'Current price', values: companies.map((company) => ({ symbol: company.symbol, value: `LKR ${company.currentPrice.toFixed(2)}` })) },
    { label: '1Y history', values: companies.map((company) => ({ symbol: company.symbol, value: `${company.oneYearMovement.toFixed(1)}%` })) },
    { label: 'Market capitalization', values: companies.map((company) => ({ symbol: company.symbol, value: company.marketCapLabel })) },
    { label: 'Sector', values: companies.map((company) => ({ symbol: company.symbol, value: company.sector })) },
  ];

  return {
    companies,
    financialHistory: Object.fromEntries(financialEntries),
    dividendHistory: Object.fromEntries(dividendEntries),
    factorSnapshots: Object.fromEntries(factorEntries),
    metrics,
    sourceLabel: 'Sample data',
  };
}
