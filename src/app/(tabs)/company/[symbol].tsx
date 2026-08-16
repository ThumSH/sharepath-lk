import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BarChartCard } from '@/components/charts/BarChartCard';
import { ChartRangeSelector } from '@/components/charts/ChartRangeSelector';
import { LineChartCard } from '@/components/charts/LineChartCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BackButton } from '@/components/ui/BackButton';
import { DisclaimerStrip } from '@/components/ui/DisclaimerStrip';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { companies } from '@/data/companies';
import { companyDividendHistory, companyFactorSnapshots, companyFinancialHistory, companyPriceHistory } from '@/data/history';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import {
  getCompanyDividendHistory,
  getCompanyFactorSnapshot,
  getCompanyFinancialHistory,
  getCompanyPriceHistory,
} from '@/services/marketDataService';
import { getCompanyAnnouncements, getCompanyBySymbol } from '@/services/sharepathData';
import {
  addCompanyToWatchlist,
  isCompanyInWatchlist,
  removeCompanyFromWatchlist,
} from '@/services/userDataService';
import type { ChartRange } from '@/types/history';

const checklist = [
  'Has revenue grown over time?',
  'Has profit been stable?',
  'Does the company pay dividends?',
  'Are there recent major announcements?',
  'Is the share actively traded?',
  'Is the sector risky or seasonal?',
];

export default function CompanyDetailsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [chartRange, setChartRange] = useState<ChartRange>('1Y');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isSavingWatchlist, setIsSavingWatchlist] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null);
  const routeSymbol = typeof symbol === 'string' ? symbol : '';
  const initialCompany = useMemo(() => companies.find((item) => item.symbol === routeSymbol), [routeSymbol]);
  const companyState = useAsyncData(
    () => getCompanyBySymbol(routeSymbol),
    initialCompany,
    [routeSymbol]
  );
  const announcementsState = useAsyncData(
    () => getCompanyAnnouncements(routeSymbol),
    [],
    [routeSymbol]
  );
  const priceHistoryState = useAsyncData(
    () => getCompanyPriceHistory(routeSymbol, chartRange),
    companyPriceHistory.filter((item) => item.companySymbol === routeSymbol),
    [routeSymbol, chartRange]
  );
  const financialHistoryState = useAsyncData(
    () => getCompanyFinancialHistory(routeSymbol),
    companyFinancialHistory.filter((item) => item.companySymbol === routeSymbol),
    [routeSymbol]
  );
  const dividendHistoryState = useAsyncData(
    () => getCompanyDividendHistory(routeSymbol),
    companyDividendHistory.filter((item) => item.companySymbol === routeSymbol),
    [routeSymbol]
  );
  const factorSnapshotState = useAsyncData(
    () => getCompanyFactorSnapshot(routeSymbol),
    companyFactorSnapshots.find((item) => item.companySymbol === routeSymbol) ?? {
      companySymbol: routeSymbol,
      snapshotDate: '2026-08-14',
      strengths: [],
      concerns: [],
      dataGaps: [
        'Not enough structured data is available yet. Review official reports and announcements before making any decision.',
      ],
      sourceLabel: 'Sample data',
    },
    [routeSymbol]
  );
  const company = companyState.data;
  const historySource =
    priceHistoryState.data[0]?.sourceLabel ??
    financialHistoryState.data[0]?.sourceLabel ??
    dividendHistoryState.data[0]?.sourceLabel ??
    'Sample data';

  useEffect(() => {
    let isMounted = true;

    if (!user || !routeSymbol) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setIsInWatchlist(false);
        }
      });
      return;
    }

    isCompanyInWatchlist(user.id, routeSymbol).then((result) => {
      if (isMounted) {
        setIsInWatchlist(result.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [routeSymbol, user]);

  async function toggleWatchlist() {
    setWatchlistMessage(null);

    if (!isAuthenticated || !user) {
      setWatchlistMessage('Sign in to save this company to your watchlist.');
      router.push(routes.login);
      return;
    }

    setIsSavingWatchlist(true);
    const result = isInWatchlist
      ? await removeCompanyFromWatchlist(user.id, routeSymbol)
      : await addCompanyToWatchlist(user.id, routeSymbol);

    if (result.errorMessage) {
      setWatchlistMessage(result.errorMessage);
    } else {
      setIsInWatchlist(!isInWatchlist);
      setWatchlistMessage(isInWatchlist ? 'Removed from watchlist.' : 'Saved to your watchlist.');
    }

    setIsSavingWatchlist(false);
  }

  if (!company) {
    return (
      <AppScreen>
        <BackButton fallback={() => router.replace(routes.companies)} />
        {companyState.isLoading ? <LoadingState message="Loading company details..." /> : null}
        <ErrorState
          title="Company not found"
          message="The selected company snapshot is not available right now."
          actionLabel="Back to Companies"
          onAction={() => router.replace(routes.companies)}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <BackButton fallback={() => router.replace(routes.companies)} />
      <PageHeader eyebrow="Historical company snapshot" title={company.name} subtitle={`${company.symbol} - ${company.sector}`} />
      <DisclaimerStrip text="Past performance does not predict future results." />
      <InfoBox tone="green">Save this company to revisit its historical summary later.</InfoBox>
      <PrimaryButton onPress={toggleWatchlist} disabled={isSavingWatchlist}>
        {isSavingWatchlist ? (isInWatchlist ? 'Removing...' : 'Saving...') : isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </PrimaryButton>
      {watchlistMessage ? <InfoBox tone="amber">{watchlistMessage}</InfoBox> : null}
      {companyState.isLoading || announcementsState.isLoading ? <LoadingState message="Loading company details..." /> : null}
      {!companyState.isLoading && companyState.isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}

      <SectionHeader title="Quick Facts" />
      <View style={styles.grid}>
        <StatCard label="Current price" value={`LKR ${company.currentPrice.toFixed(2)}`} />
        <StatCard label="52-week high" value={`LKR ${company.fiftyTwoWeekHigh.toFixed(2)}`} />
        <StatCard label="52-week low" value={`LKR ${company.fiftyTwoWeekLow.toFixed(2)}`} />
        <StatCard label="Market cap" value={company.marketCapLabel} />
        <StatCard label="Last updated" value={company.lastUpdated} />
      </View>

      <SectionHeader title="Historical Summary" subtitle={company.summary} />
      <ChartRangeSelector value={chartRange} onChange={setChartRange} />
      <LineChartCard
        title="Share Price History"
        subtitle="Historical closing prices. Past performance does not predict future results."
        data={priceHistoryState.data.map((item) => ({
          label: item.tradeDate.slice(5),
          value: item.closePrice,
        }))}
        sourceLabel={priceHistoryState.data[0]?.sourceLabel ?? historySource}
        isLoading={priceHistoryState.isLoading}
      />

      <SectionHeader title="Financial History" />
      <View style={styles.grid}>
        <StatCard label="Revenue" value={company.financials.revenue} />
        <StatCard label="Profit after tax" value={company.financials.profitAfterTax} />
        <StatCard label="EPS" value={company.financials.eps} />
        <StatCard label="NAV per share" value={company.financials.navPerShare} />
      </View>
      <BarChartCard
        title="Revenue and Profit History"
        subtitle="LKR billions in sample structured history."
        data={financialHistoryState.data.flatMap((item) => [
          {
            label: `${item.financialYear} Rev`,
            value: item.revenue ?? 0,
            frontColor: colors.primarySoft,
          },
          {
            label: `${item.financialYear} PAT`,
            value: item.profitAfterTax ?? 0,
            frontColor: colors.accent,
          },
        ])}
        sourceLabel={financialHistoryState.data[0]?.sourceLabel ?? historySource}
        isLoading={financialHistoryState.isLoading}
      />
      <LineChartCard
        title="Per Share Metrics"
        data={financialHistoryState.data.map((item) => ({
          label: item.financialYear,
          value: item.eps ?? 0,
        }))}
        sourceLabel={financialHistoryState.data[0]?.sourceLabel ?? historySource}
        subtitle="EPS history. NAV per share remains available in quick facts and structured data."
        isLoading={financialHistoryState.isLoading}
      />

      <SectionHeader title="Dividend History" />
      <BarChartCard
        title="Dividend History"
        subtitle="Past dividends do not guarantee future dividends."
        data={dividendHistoryState.data.map((item) => ({
          label: item.dividendYear,
          value: item.dividendPerShare ?? 0,
          frontColor: colors.gold,
        }))}
        sourceLabel={dividendHistoryState.data[0]?.sourceLabel ?? historySource}
        isLoading={dividendHistoryState.isLoading}
      />
      <InfoBox>{company.dividendNote}</InfoBox>

      <SectionHeader title="Investment Factors Review" />
      <AppCard>
        <Text style={styles.body}>{factorSnapshotState.data.revenueTrend ?? 'Revenue trend data unavailable.'}</Text>
        <Text style={styles.body}>{factorSnapshotState.data.profitTrend ?? 'Profit trend data unavailable.'}</Text>
        <Text style={styles.body}>{factorSnapshotState.data.dividendStatus ?? 'Dividend status data unavailable.'}</Text>
        <Text style={styles.factorTitle}>Historical strengths</Text>
        {factorSnapshotState.data.strengths.length > 0 ? (
          factorSnapshotState.data.strengths.map((item) => <Text key={item} style={styles.checkItem}>- {item}</Text>)
        ) : (
          <Text style={styles.safeNote}>Data unavailable.</Text>
        )}
        <Text style={styles.factorTitle}>Possible concerns</Text>
        {factorSnapshotState.data.concerns.length > 0 ? (
          factorSnapshotState.data.concerns.map((item) => <Text key={item} style={styles.checkItem}>- {item}</Text>)
        ) : (
          <Text style={styles.safeNote}>Data unavailable.</Text>
        )}
        <Text style={styles.factorTitle}>Data gaps</Text>
        {factorSnapshotState.data.dataGaps.length > 0 ? (
          factorSnapshotState.data.dataGaps.map((item) => <Text key={item} style={styles.checkItem}>- {item}</Text>)
        ) : (
          <Text style={styles.safeNote}>No additional data gaps listed.</Text>
        )}
        <Text style={styles.source}>Source: {factorSnapshotState.data.sourceLabel}</Text>
        <Text style={styles.safeNote}>This review is educational only and does not provide financial advice.</Text>
      </AppCard>

      <SectionHeader title="Latest Announcements" />
      {(announcementsState.data.length > 0
        ? announcementsState.data.map((announcement) => announcement.title)
        : company.announcements
      ).map((announcement) => (
        <AppCard key={announcement}>
          <Text style={styles.announcement}>{announcement}</Text>
          <Text style={styles.safeNote}>Official update summary.</Text>
        </AppCard>
      ))}

      <SectionHeader title="Beginner Checklist" subtitle="Use this checklist to guide your own research." />
      <AppCard>
        {checklist.map((item) => (
          <Text key={item} style={styles.checkItem}>
            - {item}
          </Text>
        ))}
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  body: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  safeNote: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  announcement: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  factorTitle: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  source: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 11,
  },
  checkItem: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 24,
  },
});
