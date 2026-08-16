export type CompanySortOption =
  | 'name'
  | 'price'
  | 'oneYearMovement'
  | 'marketCap'
  | 'lastUpdated';

export type CompanyFilterState = {
  search: string;
  sector: string;
  sortBy: CompanySortOption;
  movement: 'all' | 'positive' | 'negative' | 'highMovement';
  dividend: 'all' | 'hasDividends' | 'noRecentDividends';
};
