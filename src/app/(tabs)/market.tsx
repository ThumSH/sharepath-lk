import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SavedAnnouncementCard } from '@/components/cards/SavedAnnouncementCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pill } from '@/components/ui/Pill';
import { StatCard } from '@/components/ui/StatCard';
import { currencies } from '@/data/currencies';
import { announcements, marketSummary } from '@/data/market';
import { useAsyncData } from '@/hooks/useAsyncData';
import { spacing } from '@/lib/constants';
import { getCurrencyRates, getLatestMarketSummary, getOfficialUpdates } from '@/services/sharepathData';

const sections = ['Stock Market', 'Currency', 'Official Updates'];

export default function MarketScreen() {
  const [section, setSection] = useState(sections[0]);
  const marketState = useAsyncData(getLatestMarketSummary, marketSummary, []);
  const currencyState = useAsyncData(getCurrencyRates, currencies, []);
  const updatesState = useAsyncData(
    getOfficialUpdates,
    announcements.map((announcement, index) => ({
      id: `sample-market-update-${index + 1}`,
      title: announcement,
      summary: 'Official update summary for educational review.',
      sourceLabel: 'Sample data',
    })),
    []
  );
  const isLoading = marketState.isLoading || currencyState.isLoading || updatesState.isLoading;
  const isFallback = marketState.isFallback || currencyState.isFallback || updatesState.isFallback;

  return (
    <AppScreen bottomInset={88}>
      <PageHeader title="Market" subtitle="Static market summaries for education and layout preview." />
      <InfoBox>Market and currency values are sample data for now.</InfoBox>
      {isLoading ? <LoadingState message="Loading market summary..." /> : null}
      {!isLoading && isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}
      <View style={styles.chips}>
        {sections.map((item) => (
          <Pill key={item} label={item} active={section === item} onPress={() => setSection(item)} />
        ))}
      </View>

      {section === 'Stock Market' ? (
        <View style={styles.grid}>
          <StatCard label="ASPI" value={marketState.data.aspi} />
          <StatCard label="S&P SL20" value={marketState.data.spSL20} />
          <StatCard label="Turnover" value={marketState.data.turnover} />
          <StatCard label="Top gainer" value={marketState.data.topGainer} />
          <StatCard label="Top loser" value={marketState.data.topLoser} />
          <StatCard label="Most traded" value={marketState.data.mostTraded} />
        </View>
      ) : null}

      {section === 'Currency' ? (
        <>
          <View style={styles.grid}>
            {currencyState.data.map((currency) => (
              <StatCard key={currency.code} label={currency.pair} value={currency.rate} note={currency.movement} />
            ))}
          </View>
          <InfoBox tone="green">
            Currency changes can affect companies differently depending on imports, exports, foreign loans, and foreign income.
          </InfoBox>
        </>
      ) : null}

      {section === 'Official Updates'
        ? updatesState.data.length > 0
          ? updatesState.data.map((announcement) => (
              <SavedAnnouncementCard
                key={announcement.id ?? announcement.title}
                update={announcement}
              />
            ))
          : (
            <EmptyState title="No official updates" message="Official update summaries will appear here when sample data is added." />
          )
        : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
