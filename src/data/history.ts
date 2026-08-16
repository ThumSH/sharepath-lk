import type {
  CompanyDividendHistoryPoint,
  CompanyFactorSnapshot,
  CompanyFinancialHistoryPoint,
  CompanyPriceHistoryPoint,
  MarketIndexHistoryPoint,
  SectorSummary,
} from '@/types/history';

const sourceLabel = 'Sample data';

const priceSeeds = {
  'COMB.N0000': [101.2, 106.5, 111.8, 118.3, 124.7, 132.5],
  'JKH.N0000': [19.8, 20.6, 21.4, 22.2, 23.1, 23.8],
  'DIAL.N0000': [12.4, 12.1, 11.8, 11.5, 11.2, 11.4],
  'HAYL.N0000': [76.4, 80.2, 84.7, 87.5, 89.8, 91.2],
  'LOLC.N0000': [430, 462, 498, 521, 536, 548.75],
};

const dates = ['2026-03-16', '2026-04-16', '2026-05-16', '2026-06-16', '2026-07-16', '2026-08-14'];

export const companyPriceHistory: CompanyPriceHistoryPoint[] = Object.entries(priceSeeds).flatMap(
  ([companySymbol, values], companyIndex) =>
    values.map((closePrice, index) => ({
      companySymbol,
      tradeDate: dates[index],
      openPrice: Number((closePrice * 0.985).toFixed(2)),
      highPrice: Number((closePrice * 1.025).toFixed(2)),
      lowPrice: Number((closePrice * 0.965).toFixed(2)),
      closePrice,
      volume: 140000 + index * 18000 + companyIndex * 9000,
      turnover: Number((closePrice * (140000 + index * 18000 + companyIndex * 9000)).toFixed(2)),
      sourceLabel,
    }))
);

export const companyFinancialHistory: CompanyFinancialHistoryPoint[] = [
  ['COMB.N0000', '2022', 254.1, 24.8, 18.92, 160.4],
  ['COMB.N0000', '2023', 288.6, 29.4, 22.38, 176.2],
  ['COMB.N0000', '2024', 321.8, 33.2, 25.31, 189.7],
  ['COMB.N0000', '2025', 349.2, 36.9, 28.42, 201.3],
  ['JKH.N0000', '2022', 214.5, 13.2, 0.84, 27.1],
  ['JKH.N0000', '2023', 238.9, 17.8, 1.12, 29.4],
  ['JKH.N0000', '2024', 268.3, 20.5, 1.31, 30.6],
  ['JKH.N0000', '2025', 292.7, 22.1, 1.42, 31.8],
  ['DIAL.N0000', '2022', 154.7, 10.4, 1.26, 7.4],
  ['DIAL.N0000', '2023', 171.2, 12.8, 1.52, 8.0],
  ['DIAL.N0000', '2024', 184.6, 13.9, 1.68, 8.3],
  ['DIAL.N0000', '2025', 189.5, 14.3, 1.75, 8.6],
  ['HAYL.N0000', '2022', 398.4, 14.9, 19.84, 139.2],
  ['HAYL.N0000', '2023', 432.7, 16.1, 21.46, 148.5],
  ['HAYL.N0000', '2024', 463.8, 18.2, 24.28, 155.8],
  ['HAYL.N0000', '2025', 487.4, 19.8, 26.41, 162.1],
  ['LOLC.N0000', '2022', 241.9, 30.4, 64.12, 625.8],
  ['LOLC.N0000', '2023', 268.2, 33.8, 71.27, 662.4],
  ['LOLC.N0000', '2024', 291.4, 38.6, 81.43, 694.1],
  ['LOLC.N0000', '2025', 311.6, 41.7, 87.86, 716.4],
].map(([companySymbol, financialYear, revenue, profitAfterTax, eps, navPerShare]) => ({
  companySymbol: String(companySymbol),
  financialYear: String(financialYear),
  revenue: Number(revenue),
  profitAfterTax: Number(profitAfterTax),
  eps: Number(eps),
  navPerShare: Number(navPerShare),
  sourceLabel,
}));

export const companyDividendHistory: CompanyDividendHistoryPoint[] = [
  ['COMB.N0000', '2022', 6.5, 'Final'],
  ['COMB.N0000', '2023', 7.0, 'Final'],
  ['COMB.N0000', '2024', 8.0, 'Final'],
  ['JKH.N0000', '2023', 0.75, 'Interim'],
  ['JKH.N0000', '2024', 0.9, 'Final'],
  ['DIAL.N0000', '2022', 1.05, 'Final'],
  ['DIAL.N0000', '2023', 1.15, 'Final'],
  ['DIAL.N0000', '2024', 1.2, 'Final'],
  ['HAYL.N0000', '2023', 4.0, 'Final'],
  ['HAYL.N0000', '2024', 4.5, 'Final'],
].map(([companySymbol, dividendYear, dividendPerShare, dividendType]) => ({
  companySymbol: String(companySymbol),
  dividendYear: String(dividendYear),
  dividendPerShare: Number(dividendPerShare),
  dividendType: String(dividendType),
  sourceLabel,
}));

export const marketIndexHistory: MarketIndexHistoryPoint[] = [
  ['ASPI', '2026-03-16', 11280.44, 0.4],
  ['ASPI', '2026-04-16', 11642.1, 3.2],
  ['ASPI', '2026-05-16', 11905.73, 2.3],
  ['ASPI', '2026-06-16', 12112.88, 1.7],
  ['ASPI', '2026-07-16', 12340.51, 1.9],
  ['ASPI', '2026-08-14', 12486.42, 1.2],
  ['SPSL20', '2026-03-16', 3384.18, 0.2],
  ['SPSL20', '2026-04-16', 3476.8, 2.7],
  ['SPSL20', '2026-05-16', 3552.34, 2.2],
  ['SPSL20', '2026-06-16', 3630.48, 2.2],
  ['SPSL20', '2026-07-16', 3689.2, 1.6],
  ['SPSL20', '2026-08-14', 3721.09, 0.9],
].map(([indexCode, tradeDate, closeValue, changePercent]) => ({
  indexCode: indexCode as 'ASPI' | 'SPSL20',
  tradeDate: String(tradeDate),
  closeValue: Number(closeValue),
  changePercent: Number(changePercent),
  sourceLabel,
}));

export const sectorSummaries: SectorSummary[] = [
  { sectorName: 'Banking', summaryDate: '2026-08-14', turnover: 820, volume: 5800000, marketCapLabel: 'Large', changePercent: 1.8, companiesCount: 12, sourceLabel },
  { sectorName: 'Diversified Holdings', summaryDate: '2026-08-14', turnover: 740, volume: 4200000, marketCapLabel: 'Large', changePercent: 1.1, companiesCount: 18, sourceLabel },
  { sectorName: 'Telecommunication', summaryDate: '2026-08-14', turnover: 310, volume: 3900000, marketCapLabel: 'Large', changePercent: -0.4, companiesCount: 3, sourceLabel },
  { sectorName: 'Financial Services', summaryDate: '2026-08-14', turnover: 520, volume: 2100000, marketCapLabel: 'Large', changePercent: 0.9, companiesCount: 21, sourceLabel },
];

export const companyFactorSnapshots: CompanyFactorSnapshot[] = [
  {
    companySymbol: 'COMB.N0000',
    snapshotDate: '2026-08-14',
    revenueTrend: 'Revenue increased across the sample history period.',
    profitTrend: 'Profit after tax was higher in each sample year.',
    dividendStatus: 'Sample dividend history is available for recent years.',
    priceHistoryNote: 'Closing prices moved higher across the sample period.',
    announcementNote: 'Recent sample updates include financial reports and dividend notices.',
    liquidityNote: 'Sample volume indicates regular market activity.',
    strengths: ['Multi-year revenue growth in sample data', 'Recent dividend history is available'],
    concerns: ['Banking results can be affected by credit conditions and interest rates'],
    dataGaps: ['Cash flow and capital adequacy details are not included yet'],
    sourceLabel,
  },
  {
    companySymbol: 'JKH.N0000',
    snapshotDate: '2026-08-14',
    revenueTrend: 'Revenue increased across the sample history period.',
    profitTrend: 'Profit improved in the sample financial history.',
    dividendStatus: 'Some sample dividend entries are available.',
    priceHistoryNote: 'Closing prices moved gradually higher in the sample period.',
    announcementNote: 'Recent sample updates include financial reports and corporate disclosures.',
    liquidityNote: 'Sample volume indicates regular market activity.',
    strengths: ['Diversified business exposure', 'Improving sample earnings trend'],
    concerns: ['Group results can vary by sector and capital project cycle'],
    dataGaps: ['Segment-level cash flow data is not included yet'],
    sourceLabel,
  },
];
