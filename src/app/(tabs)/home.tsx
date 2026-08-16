import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LineChartCard } from '@/components/charts/LineChartCard';
import { CompanyCard } from '@/components/cards/CompanyCard';
import { LessonCard } from '@/components/cards/LessonCard';
import { SavedAnnouncementCard } from '@/components/cards/SavedAnnouncementCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { companies } from '@/data/companies';
import { currencies } from '@/data/currencies';
import { companyPriceHistory, marketIndexHistory } from '@/data/history';
import { lessons } from '@/data/lessons';
import { marketSummary } from '@/data/market';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { advisoryDisclaimer, colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getCompanyPriceHistory, getMarketIndexHistory } from '@/services/marketDataService';
import { getContinueLearningLesson } from '@/services/learningService';
import {
  getCompanies,
  getCurrencyRates,
  getLatestMarketSummary,
  getLessons,
  getOfficialUpdates,
} from '@/services/sharepathData';

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const companiesState = useAsyncData(getCompanies, companies, []);
  const lessonsState = useAsyncData(getLessons, lessons, []);
  const marketState = useAsyncData(getLatestMarketSummary, marketSummary, []);
  const currencyState = useAsyncData(getCurrencyRates, currencies, []);
  const updatesState = useAsyncData(getOfficialUpdates, [], []);
  const featuredCompany = companiesState.data[0] ?? companies[0];
  const aspiHistoryState = useAsyncData(
    () => getMarketIndexHistory('ASPI', '6M'),
    marketIndexHistory.filter((item) => item.indexCode === 'ASPI'),
    []
  );
  const featuredPriceState = useAsyncData(
    () => getCompanyPriceHistory(featuredCompany.symbol, '6M'),
    companyPriceHistory.filter((item) => item.companySymbol === featuredCompany.symbol),
    [featuredCompany.symbol]
  );
  const continueLessonState = useAsyncData(
    () => getContinueLearningLesson(user?.id),
    { lesson: lessons[0], hasProgress: false },
    [user?.id]
  );
  const lesson = continueLessonState.data.lesson ?? lessonsState.data[0] ?? lessons[0];
  const isLoading =
    companiesState.isLoading ||
    lessonsState.isLoading ||
    continueLessonState.isLoading ||
    marketState.isLoading ||
    aspiHistoryState.isLoading ||
    featuredPriceState.isLoading ||
    currencyState.isLoading ||
    updatesState.isLoading;
  const isFallback =
    companiesState.isFallback ||
    lessonsState.isFallback ||
    continueLessonState.isFallback ||
    marketState.isFallback ||
    aspiHistoryState.isFallback ||
    featuredPriceState.isFallback ||
    currencyState.isFallback ||
    updatesState.isFallback;

  return (
    <AppScreen bottomInset={88}>
      <PageHeader
        eyebrow={profile?.displayName ? `Good morning, ${profile.displayName}` : 'Good morning'}
        title="SharePath LK"
        subtitle="Understand before you invest."
        rightSlot={
          <Pressable
            onPress={() => router.push(isAuthenticated ? routes.account : routes.login)}
            style={({ pressed }) => [styles.avatar, pressed && styles.pressedAvatar]}>
            <Text style={styles.avatarText}>{profile?.displayName?.slice(0, 1).toUpperCase() ?? 'A'}</Text>
          </Pressable>
        }
      />
      {isAuthLoading ? <LoadingState message="Checking your account..." /> : null}

      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle}>Understand before you invest.</Text>
        <Text style={styles.heroText}>
          Learn market basics, explore company history, and follow official updates in a simple way.
        </Text>
        <Text style={styles.disclaimer}>{advisoryDisclaimer}</Text>
      </AppCard>
      {isLoading ? <LoadingState message="Loading today's overview..." /> : null}
      {!isLoading && isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}

      <SectionHeader title="Today's Market Snapshot" subtitle="Sample historical summary data for layout preview." />
      <Text style={styles.sectionLabel}>Historical market snapshot</Text>
      <View style={styles.grid}>
        <StatCard label="ASPI" value={marketState.data.aspi} />
        <StatCard label="S&P SL20" value={marketState.data.spSL20} />
        <StatCard label="Turnover" value={marketState.data.turnover} />
        <StatCard label="Traded companies" value={`${marketState.data.tradedCompanies}`} />
      </View>
      <LineChartCard
        title="ASPI Mini Trend"
        subtitle="Compact historical preview."
        data={aspiHistoryState.data.map((item) => ({ label: item.tradeDate.slice(5), value: item.closeValue }))}
        sourceLabel={aspiHistoryState.data[0]?.sourceLabel ?? 'Sample data'}
        isLoading={aspiHistoryState.isLoading}
      />

      <SectionHeader title="Currency Watch" />
      <View style={styles.grid}>
        {currencyState.data.map((currency) => (
          <StatCard key={currency.code} label={currency.pair} value={currency.rate} note={currency.movement} />
        ))}
      </View>
      <InfoBox>Rates shown here are sample data for now.</InfoBox>

      <SectionHeader title="Continue Learning" />
      <LessonCard lesson={lesson} onPress={() => router.push(routes.lesson(lesson.id))} />
      <PrimaryButton variant="secondary" onPress={() => router.push(routes.lesson(lesson.id))}>
        {continueLessonState.data.hasProgress ? 'Continue Learning' : 'Start Learning'}
      </PrimaryButton>

      <SectionHeader title="Company to Understand" />
      <LineChartCard
        title={`${featuredCompany.symbol} Price Preview`}
        subtitle="Historical closing prices for learning context."
        data={featuredPriceState.data.map((item) => ({ label: item.tradeDate.slice(5), value: item.closePrice }))}
        sourceLabel={featuredPriceState.data[0]?.sourceLabel ?? 'Sample data'}
        isLoading={featuredPriceState.isLoading}
      />
      <CompanyCard
        company={featuredCompany}
        onPress={() => router.push(routes.company(featuredCompany.symbol))}
      />
      <PrimaryButton
        variant="secondary"
        onPress={() => router.push(routes.company(featuredCompany.symbol))}>
        View Summary
      </PrimaryButton>

      <SectionHeader title="Latest Official Updates" />
      {updatesState.data.length > 0 ? (
        updatesState.data.map((update) => (
          <SavedAnnouncementCard key={update.id ?? update.title} update={update} />
        ))
      ) : (
        <InfoBox>No official update summaries are available in the sample data.</InfoBox>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.softBlue,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressedAvatar: {
    opacity: 0.72,
  },
  avatarText: {
    color: colors.primary,
    fontFamily: typography.bold,
    fontSize: 15,
  },
  hero: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: radii.xl,
    paddingVertical: 28,
  },
  heroTitle: {
    color: colors.card,
    fontFamily: typography.bold,
    fontSize: 24,
    lineHeight: 30,
  },
  heroText: {
    color: colors.primaryMuted,
    fontFamily: typography.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  disclaimer: {
    color: colors.goldSoft,
    fontFamily: typography.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.gold,
    fontFamily: typography.semiBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
