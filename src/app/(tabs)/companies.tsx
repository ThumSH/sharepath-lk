import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { Pill } from '@/components/ui/Pill';
import { companies } from '@/data/companies';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getCompanies } from '@/services/sharepathData';

export default function CompaniesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const companiesState = useAsyncData(getCompanies, companies, []);
  const sectors = useMemo(
    () => ['All', ...Array.from(new Set(companiesState.data.map((company) => company.sector)))],
    [companiesState.data]
  );
  const filtered = companiesState.data.filter((company) => {
    const matchesSearch = `${company.name} ${company.symbol}`.toLowerCase().includes(query.toLowerCase());
    const matchesSector = sector === 'All' || company.sector === sector;
    return matchesSearch && matchesSector;
  });

  return (
    <AppScreen bottomInset={88}>
      <PageHeader
        eyebrow="Company snapshots"
        title="Companies"
        subtitle="Explore historical company snapshots with beginner-friendly wording."
      />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search company or symbol"
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      <View style={styles.chips}>
        {sectors.map((item) => (
          <Pill key={item} label={item} active={sector === item} onPress={() => setSector(item)} />
        ))}
      </View>
      <InfoBox>Historical data only. Use this information to guide your own research.</InfoBox>
      {companiesState.isLoading ? <InfoBox>Loading companies...</InfoBox> : null}
      {!companiesState.isLoading && companiesState.isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}
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
            setQuery('');
            setSector('All');
          }}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
