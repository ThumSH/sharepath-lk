import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { EmptyChartState } from '@/components/charts/EmptyChartState';
import { AppCard } from '@/components/ui/AppCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { colors, typography } from '@/lib/constants';

type LineChartPoint = {
  label: string;
  value: number;
};

type LineChartCardProps = {
  title: string;
  subtitle?: string;
  data: LineChartPoint[];
  sourceLabel?: string;
  isLoading?: boolean;
};

export function LineChartCard({ title, subtitle, data, sourceLabel, isLoading = false }: LineChartCardProps) {
  const isWeb = Platform.OS === 'web';
  const chartData = data.map((point) => ({
    value: point.value,
    label: point.label,
  }));

  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {isLoading ? <LoadingState message="Loading chart data..." /> : null}
      {!isLoading && chartData.length === 0 ? <EmptyChartState /> : null}
      {!isLoading && chartData.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            color={colors.primarySoft}
            dataPointsColor={colors.accent}
            height={180}
            hideDataPoints={isWeb}
            initialSpacing={12}
            isAnimated={false}
            noOfSections={4}
            spacing={48}
            thickness={2}
            yAxisColor={colors.border}
            xAxisColor={colors.border}
            yAxisTextStyle={styles.axis}
            xAxisLabelTextStyle={styles.axis}
          />
        </ScrollView>
      ) : null}
      {sourceLabel ? <SourceBadge label={sourceLabel} /> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 17,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  axis: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 10,
  },
});
