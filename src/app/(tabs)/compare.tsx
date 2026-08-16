import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TermTooltip } from '@/components/education/TermTooltip';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BackButton } from '@/components/ui/BackButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pill } from '@/components/ui/Pill';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getComparisonData } from '@/services/comparisonService';
import type { CompanyComparisonData } from '@/types/comparison';

const emptyComparison: CompanyComparisonData = {
  companies: [],
  financialHistory: {},
  dividendHistory: {},
  factorSnapshots: {},
  metrics: [],
  sourceLabel: 'Sample data',
};

export default function CompareScreen() {
  const router = useRouter();
  const { symbols } = useLocalSearchParams<{ symbols?: string }>();
  const selectedSymbols = useMemo(
    () => (typeof symbols === 'string' ? symbols.split(',').filter(Boolean).slice(0, 3) : []),
    [symbols]
  );
  const comparisonState = useAsyncData(
    () => getComparisonData(selectedSymbols).then((data) => ({ data, isFallback: false })),
    emptyComparison,
    [symbols]
  );

  if (selectedSymbols.length < 2) {
    return (
      <AppScreen bottomInset={88}>
        <BackButton fallback={() => router.replace(routes.companies)} />
        <EmptyState
          title="Choose companies to compare"
          message="Select 2 to 3 company snapshots from the Companies page."
          actionLabel="Back to Companies"
          onAction={() => router.replace(routes.companies)}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen bottomInset={88}>
      <BackButton fallback={() => router.replace(routes.companies)} />
      <PageHeader title="Compare Companies" subtitle="Historical comparison for learning and research context." />
      <InfoBox>Comparison uses historical data only and does not provide financial advice.</InfoBox>
      {comparisonState.isLoading ? <LoadingState message="Loading comparison..." /> : null}
      <View style={styles.chips}>
        {selectedSymbols.map((symbol) => <Pill key={symbol} label={symbol} active />)}
      </View>

      <AppCard>
        <Text style={styles.sectionTitle}>Quick Facts Comparison</Text>
        {comparisonState.data.metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            {metric.label === 'Market capitalization' ? (
              <TermTooltip term="Market Capitalization">{metric.label}</TermTooltip>
            ) : (
              <Text style={styles.metricLabel}>{metric.label}</Text>
            )}
            <View style={styles.values}>
              {metric.values.map((item) => (
                <Text key={`${metric.label}-${item.symbol}`} style={styles.value}>
                  {item.symbol}: {item.value ?? 'Data unavailable'}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <SourceBadge label={comparisonState.data.sourceLabel} />
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Financial History Comparison</Text>
        <TermTooltip term="PAT">PAT</TermTooltip>
        {comparisonState.data.companies.map((company) => {
          const latest = comparisonState.data.financialHistory[company.symbol]?.at(-1);
          return (
            <Text key={company.symbol} style={styles.value}>
              {company.symbol}: Revenue {latest?.revenue ?? 'Data unavailable'}, PAT {latest?.profitAfterTax ?? 'Data unavailable'}, EPS {latest?.eps ?? 'Data unavailable'}
            </Text>
          );
        })}
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Dividend History Comparison</Text>
        <TermTooltip term="Dividend">Dividend</TermTooltip>
        {comparisonState.data.companies.map((company) => {
          const latest = comparisonState.data.dividendHistory[company.symbol]?.at(-1);
          return (
            <Text key={company.symbol} style={styles.value}>
              {company.symbol}: {latest?.dividendPerShare ? `${latest.dividendYear} - LKR ${latest.dividendPerShare}` : 'Data unavailable'}
            </Text>
          );
        })}
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Investment Factors Comparison</Text>
        {comparisonState.data.companies.map((company) => {
          const snapshot = comparisonState.data.factorSnapshots[company.symbol];
          return (
            <View key={company.symbol} style={styles.metric}>
              <Text style={styles.metricLabel}>{company.symbol}</Text>
              <Text style={styles.value}>{snapshot?.priceHistoryNote ?? 'Data unavailable'}</Text>
              <Text style={styles.value}>{snapshot?.concerns?.[0] ?? 'Review official updates before making decisions.'}</Text>
            </View>
          );
        })}
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 17,
  },
  metric: {
    gap: spacing.xs,
  },
  metricLabel: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  values: {
    gap: spacing.xs,
  },
  value: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
