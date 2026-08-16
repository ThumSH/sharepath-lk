import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BarChartCard } from '@/components/charts/BarChartCard';
import { ChartRangeSelector } from '@/components/charts/ChartRangeSelector';
import { LineChartCard } from '@/components/charts/LineChartCard';
import { SavedAnnouncementCard } from '@/components/cards/SavedAnnouncementCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pill } from '@/components/ui/Pill';
import { StatCard } from '@/components/ui/StatCard';
import { currencies } from '@/data/currencies';
import { marketIndexHistory, sectorSummaries } from '@/data/history';
import { announcements, marketSummary } from '@/data/market';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors, spacing } from '@/lib/constants';
import { getMarketIndexHistory, getSectorSummaries } from '@/services/marketDataService';
import { getCurrencyRates, getLatestMarketSummary, getOfficialUpdates } from '@/services/sharepathData';
import type { ChartRange } from '@/types/history';

const sections = ['Stock Market', 'Currency', 'Official Updates'];

export default function MarketScreen() {
  const [section, setSection] = useState(sections[0]);
  const [chartRange, setChartRange] = useState<ChartRange>('1Y');
  const marketState = useAsyncData(getLatestMarketSummary, marketSummary, []);
  const aspiState = useAsyncData(
    () => getMarketIndexHistory('ASPI', chartRange),
    marketIndexHistory.filter((item) => item.indexCode === 'ASPI'),
    [chartRange]
  );
  const spSl20State = useAsyncData(
    () => getMarketIndexHistory('SPSL20', chartRange),
    marketIndexHistory.filter((item) => item.indexCode === 'SPSL20'),
    [chartRange]
  );
  const sectorState = useAsyncData(getSectorSummaries, sectorSummaries, []);
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
  const isLoading =
    marketState.isLoading ||
    aspiState.isLoading ||
    spSl20State.isLoading ||
    sectorState.isLoading ||
    currencyState.isLoading ||
    updatesState.isLoading;
  const isFallback =
    marketState.isFallback ||
    aspiState.isFallback ||
    spSl20State.isFallback ||
    sectorState.isFallback ||
    currencyState.isFallback ||
    updatesState.isFallback;

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
        <>
          <View style={styles.grid}>
            <StatCard label="ASPI" value={marketState.data.aspi} />
            <StatCard label="S&P SL20" value={marketState.data.spSL20} />
            <StatCard label="Turnover" value={marketState.data.turnover} />
            <StatCard label="Top gainer" value={marketState.data.topGainer} />
            <StatCard label="Top loser" value={marketState.data.topLoser} />
            <StatCard label="Most traded" value={marketState.data.mostTraded} />
          </View>
          <ChartRangeSelector value={chartRange} onChange={setChartRange} />
          <LineChartCard
            title="ASPI History"
            subtitle="Historical index closes for market context."
            data={aspiState.data.map((item) => ({ label: item.tradeDate.slice(5), value: item.closeValue }))}
            sourceLabel={aspiState.data[0]?.sourceLabel ?? 'Sample data'}
            isLoading={aspiState.isLoading}
          />
          <LineChartCard
            title="S&P SL20 History"
            subtitle="Historical index closes for large, liquid share context."
            data={spSl20State.data.map((item) => ({ label: item.tradeDate.slice(5), value: item.closeValue }))}
            sourceLabel={spSl20State.data[0]?.sourceLabel ?? 'Sample data'}
            isLoading={spSl20State.isLoading}
          />
          <BarChartCard
            title="Sector Comparison"
            subtitle="Turnover by sector in sample structured data."
            data={sectorState.data.map((item) => ({
              label: item.sectorName,
              value: item.turnover ?? 0,
              frontColor: (item.changePercent ?? 0) >= 0 ? colors.accent : colors.warning,
            }))}
            sourceLabel={sectorState.data[0]?.sourceLabel ?? 'Sample data'}
            isLoading={sectorState.isLoading}
          />
        </>
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
          <InfoBox>Currency history charts will be added after CBSL data sync is connected.</InfoBox>
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
