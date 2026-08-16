import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { FilterChip } from '@/components/filters/FilterChip';
import { FilterSheet } from '@/components/filters/FilterSheet';
import { SearchInput } from '@/components/filters/SearchInput';
import { SelectDropdown } from '@/components/filters/SelectDropdown';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { companies } from '@/data/companies';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getCompanies } from '@/services/sharepathData';
import type { CompanyFilterState, CompanySortOption } from '@/types/filters';

const defaultFilters: CompanyFilterState = {
  search: '',
  sector: 'All sectors',
  sortBy: 'name',
  movement: 'all',
  dividend: 'all',
};

const sortOptions: { label: string; value: CompanySortOption }[] = [
  { label: 'Sort by name', value: 'name' },
  { label: 'Price', value: 'price' },
  { label: '1Y history', value: 'oneYearMovement' },
  { label: 'Market cap', value: 'marketCap' },
  { label: 'Last updated', value: 'lastUpdated' },
];

function marketCapRank(label: string) {
  if (label.toLowerCase().includes('large')) {
    return 3;
  }

  if (label.toLowerCase().includes('mid')) {
    return 2;
  }

  return 1;
}

export default function CompaniesScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<CompanyFilterState>(defaultFilters);
  const companiesState = useAsyncData(getCompanies, companies, []);
  const sectorOptions = useMemo(
    () => [
      { label: 'All sectors', value: 'All sectors' },
      ...Array.from(new Set(companiesState.data.map((company) => company.sector))).map((sectorName) => ({
        label: sectorName,
        value: sectorName,
      })),
    ],
    [companiesState.data]
  );
  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return [...companiesState.data]
      .filter((company) => {
        const matchesSearch = `${company.name} ${company.symbol} ${company.sector}`.toLowerCase().includes(search);
        const matchesSector = filters.sector === 'All sectors' || company.sector === filters.sector;
        const matchesMovement =
          filters.movement === 'all' ||
          (filters.movement === 'positive' && company.oneYearMovement > 0) ||
          (filters.movement === 'negative' && company.oneYearMovement < 0) ||
          (filters.movement === 'highMovement' && Math.abs(company.oneYearMovement) >= 10);
        const dividendText = company.dividendNote.toLowerCase();
        const hasDividendHistory = dividendText.includes('dividend') && !dividendText.includes('not available');
        const matchesDividend =
          filters.dividend === 'all' ||
          (filters.dividend === 'hasDividends' && hasDividendHistory) ||
          (filters.dividend === 'noRecentDividends' && !hasDividendHistory);

        return matchesSearch && matchesSector && matchesMovement && matchesDividend;
      })
      .sort((left, right) => {
        if (filters.sortBy === 'price') {
          return right.currentPrice - left.currentPrice;
        }

        if (filters.sortBy === 'oneYearMovement') {
          return right.oneYearMovement - left.oneYearMovement;
        }

        if (filters.sortBy === 'marketCap') {
          return marketCapRank(right.marketCapLabel) - marketCapRank(left.marketCapLabel);
        }

        if (filters.sortBy === 'lastUpdated') {
          return right.lastUpdated.localeCompare(left.lastUpdated);
        }

        return left.name.localeCompare(right.name);
      });
  }, [companiesState.data, filters]);
  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(defaultFilters);

  return (
    <AppScreen bottomInset={88}>
      <PageHeader
        eyebrow="Company snapshots"
        title="Companies"
        subtitle="Explore historical company snapshots with beginner-friendly wording."
      />
      <FilterSheet onClear={() => setFilters(defaultFilters)} showClear={hasActiveFilters}>
        <SearchInput
          value={filters.search}
          onChangeText={(search) => setFilters((current) => ({ ...current, search }))}
          placeholder="Search name, symbol, or sector"
        />
        <View style={styles.dropdowns}>
          <SelectDropdown
            label="Sector"
            value={filters.sector}
            options={sectorOptions}
            onChange={(sector) => setFilters((current) => ({ ...current, sector }))}
          />
          <SelectDropdown
            label="Sort"
            value={filters.sortBy}
            options={sortOptions}
            onChange={(sortBy) => setFilters((current) => ({ ...current, sortBy }))}
          />
        </View>
        <View style={styles.chips}>
          <FilterChip label="All movement" active={filters.movement === 'all'} onPress={() => setFilters((current) => ({ ...current, movement: 'all' }))} />
          <FilterChip label="Positive 1Y history" active={filters.movement === 'positive'} onPress={() => setFilters((current) => ({ ...current, movement: 'positive' }))} />
          <FilterChip label="Negative 1Y history" active={filters.movement === 'negative'} onPress={() => setFilters((current) => ({ ...current, movement: 'negative' }))} />
          <FilterChip label="High movement" active={filters.movement === 'highMovement'} onPress={() => setFilters((current) => ({ ...current, movement: 'highMovement' }))} />
          <FilterChip label="All dividends" active={filters.dividend === 'all'} onPress={() => setFilters((current) => ({ ...current, dividend: 'all' }))} />
          <FilterChip label="Has dividend history" active={filters.dividend === 'hasDividends'} onPress={() => setFilters((current) => ({ ...current, dividend: 'hasDividends' }))} />
          <FilterChip label="No recent dividend data" active={filters.dividend === 'noRecentDividends'} onPress={() => setFilters((current) => ({ ...current, dividend: 'noRecentDividends' }))} />
        </View>
      </FilterSheet>
      <InfoBox>Historical data only. Use this information to guide your own research.</InfoBox>
      {companiesState.isLoading ? <InfoBox>Loading companies...</InfoBox> : null}
      {!companiesState.isLoading && companiesState.isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}
      <Text style={styles.resultCount}>{filtered.length} company snapshots</Text>
      {filtered.length > 0 ? (
        filtered.map((company) => (
          <CompanyCard
            key={company.symbol}
            company={company}
            onPress={() => router.push(routes.company(company.symbol))}
          />
        ))
      ) : (
        <EmptyState
          title="No companies found"
          message="Try searching by company name, symbol, or sector."
          actionLabel="Clear Search"
          onAction={() => {
            setFilters(defaultFilters);
          }}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  dropdowns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  resultCount: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 13,
  },
});
