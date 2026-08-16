import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { FilterChip } from '@/components/filters/FilterChip';
import { FilterSheet } from '@/components/filters/FilterSheet';
import { SearchInput } from '@/components/filters/SearchInput';
import { SelectDropdown } from '@/components/filters/SelectDropdown';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
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
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [compareMessage, setCompareMessage] = useState<string | null>(null);
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

  function toggleCompareSelection(symbol: string) {
    setCompareMessage(null);

    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols((current) => current.filter((item) => item !== symbol));
      return;
    }

    if (selectedSymbols.length >= 3) {
      setCompareMessage('You can compare up to 3 companies at a time.');
      return;
    }

    setSelectedSymbols((current) => [...current, symbol]);
  }

  return (
    <AppScreen bottomInset={88}>
      <PageHeader
        eyebrow="Company snapshots"
        title="Companies"
        subtitle="Explore historical company snapshots with beginner-friendly wording."
      />
      <View style={styles.actions}>
        <PrimaryButton
          variant={isCompareMode ? 'primary' : 'secondary'}
          onPress={() => {
            setIsCompareMode((current) => !current);
            setCompareMessage(null);
          }}>
          {isCompareMode ? 'Exit Compare' : 'Compare'}
        </PrimaryButton>
      </View>
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
      {compareMessage ? <InfoBox tone="amber">{compareMessage}</InfoBox> : null}
      <Text style={styles.resultCount}>{filtered.length} company snapshots</Text>
      {filtered.length > 0 ? (
        filtered.map((company) => (
          <View key={company.symbol} style={styles.companyWrap}>
            {isCompareMode ? (
              <Pressable
                style={[styles.selectBadge, selectedSymbols.includes(company.symbol) && styles.selectedBadge]}
                onPress={() => toggleCompareSelection(company.symbol)}>
                <Text style={[styles.selectText, selectedSymbols.includes(company.symbol) && styles.selectedText]}>
                  {selectedSymbols.includes(company.symbol) ? 'Selected' : 'Select'}
                </Text>
              </Pressable>
            ) : null}
            <CompanyCard
              company={company}
              onPress={() => (isCompareMode ? toggleCompareSelection(company.symbol) : router.push(routes.company(company.symbol)))}
            />
          </View>
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
      {isCompareMode && selectedSymbols.length >= 2 ? (
        <View style={styles.compareBar}>
          <Text style={styles.compareText}>Compare {selectedSymbols.length} companies</Text>
          <View style={styles.compareActions}>
            <PrimaryButton variant="secondary" onPress={() => setSelectedSymbols([])}>
              Clear
            </PrimaryButton>
            <PrimaryButton onPress={() => router.push(routes.compare(selectedSymbols))}>
              Compare
            </PrimaryButton>
          </View>
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignSelf: 'flex-start',
  },
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
  companyWrap: {
    gap: spacing.xs,
  },
  selectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  selectedBadge: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primarySoft,
  },
  selectText: {
    color: colors.muted,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  selectedText: {
    color: colors.primary,
  },
  compareBar: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    bottom: 88,
    gap: spacing.sm,
    left: spacing.md,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.md,
  },
  compareText: {
    color: colors.textOnPrimary,
    fontFamily: typography.bold,
    fontSize: 15,
  },
  compareActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
