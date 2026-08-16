import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BackButton } from '@/components/ui/BackButton';
import { DisclaimerStrip } from '@/components/ui/DisclaimerStrip';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pill } from '@/components/ui/Pill';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { companies } from '@/data/companies';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getCompanyAnnouncements, getCompanyBySymbol } from '@/services/sharepathData';
import {
  addCompanyToWatchlist,
  isCompanyInWatchlist,
  removeCompanyFromWatchlist,
} from '@/services/userDataService';

const periods = ['1 month', '6 months', '1 year', '5 years'];
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
  const [period, setPeriod] = useState(periods[2]);
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
  const company = companyState.data;

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
      <View style={styles.chips}>
        {periods.map((item) => (
          <Pill key={item} label={item} active={period === item} onPress={() => setPeriod(item)} />
        ))}
      </View>
      <InfoBox>
        {period} view: this placeholder will summarize past price and company context when verified historical data is connected.
      </InfoBox>

      <SectionHeader title="Financial History" />
      <View style={styles.grid}>
        <StatCard label="Revenue" value={company.financials.revenue} />
        <StatCard label="Profit after tax" value={company.financials.profitAfterTax} />
        <StatCard label="EPS" value={company.financials.eps} />
        <StatCard label="NAV per share" value={company.financials.navPerShare} />
      </View>

      <SectionHeader title="Dividend History" />
      <AppCard>
        <Text style={styles.body}>Last dividend: placeholder from static data.</Text>
        <Text style={styles.body}>{company.dividendNote}</Text>
        <Text style={styles.safeNote}>Past dividends do not guarantee future dividends.</Text>
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
  checkItem: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 24,
  },
});
