import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BarChartCard } from '@/components/charts/BarChartCard';
import { ChartRangeSelector } from '@/components/charts/ChartRangeSelector';
import { LineChartCard } from '@/components/charts/LineChartCard';
import { SavedAnnouncementCard } from '@/components/cards/SavedAnnouncementCard';
import { TermTooltip } from '@/components/education/TermTooltip';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pill } from '@/components/ui/Pill';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { StatCard } from '@/components/ui/StatCard';
import { currencies } from '@/data/currencies';
import { marketIndexHistory, sectorSummaries } from '@/data/history';
import { announcements, marketSummary } from '@/data/market';
import { topMovers } from '@/data/movers';
import { useAsyncData } from '@/hooks/useAsyncData';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getMarketIndexHistory, getSectorSummaries, getTodayTopMovers } from '@/services/marketDataService';
import { getCurrencyRates, getLatestMarketSummary, getOfficialUpdates } from '@/services/sharepathData';
import type { ChartRange } from '@/types/history';
import type { TopMover, TopMoverType } from '@/types/movers';

const sections = ['Stock Market', 'Currency', 'Official Updates'];

export default function MarketScreen() {
  const router = useRouter();
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
  const moversState = useAsyncData(getTodayTopMovers, topMovers, []);
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
    moversState.isLoading ||
    currencyState.isLoading ||
    updatesState.isLoading;
  const isFallback =
    marketState.isFallback ||
    aspiState.isFallback ||
    spSl20State.isFallback ||
    sectorState.isFallback ||
    moversState.isFallback ||
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
          </View>
          <View style={styles.tooltipRow}>
            <TermTooltip term="ASPI" />
            <TermTooltip term="S&P SL20" />
            <TermTooltip term="Turnover" />
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
          <MoverList title="Top Gainers" type="gainer" movers={moversState.data} onPress={(symbol) => router.push(routes.company(symbol))} />
          <MoverList title="Top Losers" type="loser" movers={moversState.data} onPress={(symbol) => router.push(routes.company(symbol))} />
          <MoverList title="Most Traded" type="most_traded" movers={moversState.data} onPress={(symbol) => router.push(routes.company(symbol))} />
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

function MoverList({
  title,
  type,
  movers,
  onPress,
}: {
  title: string;
  type: TopMoverType;
  movers: TopMover[];
  onPress: (symbol: string) => void;
}) {
  const rows = movers.filter((item) => item.movementType === type).slice(0, 5);

  if (rows.length === 0) {
    return <EmptyState title={title} message="Top movers data is not available yet." />;
  }

  return (
    <View style={styles.moverSection}>
      <Text style={styles.moverTitle}>{title}</Text>
      <Text style={styles.moverSubtitle}>Historical daily movement</Text>
      {rows.map((mover) => (
        <Pressable key={mover.id} style={styles.moverRow} onPress={() => onPress(mover.companySymbol)}>
          <View style={styles.moverCopy}>
            <Text style={styles.moverName}>{mover.companyName}</Text>
            <Text style={styles.moverMeta}>
              {mover.companySymbol}
              {mover.changePercent !== null && mover.changePercent !== undefined ? ` - ${mover.changePercent.toFixed(1)}%` : ''}
            </Text>
            <Text style={styles.moverMeta}>
              Volume {mover.tradedVolume ?? 'Data unavailable'} | Turnover {mover.turnover ?? 'Data unavailable'}
            </Text>
          </View>
          <SourceBadge label={mover.sourceLabel} />
        </Pressable>
      ))}
    </View>
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
  tooltipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  moverSection: {
    gap: spacing.sm,
  },
  moverTitle: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 17,
  },
  moverSubtitle: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 12,
  },
  moverRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  moverCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  moverName: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  moverMeta: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 12,
  },
});
