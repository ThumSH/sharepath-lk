import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { EmptyChartState } from '@/components/charts/EmptyChartState';
import { AppCard } from '@/components/ui/AppCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { colors, typography } from '@/lib/constants';

type BarChartPoint = {
  label: string;
  value: number;
  frontColor?: string;
};

type BarChartCardProps = {
  title: string;
  subtitle?: string;
  data: BarChartPoint[];
  sourceLabel?: string;
  isLoading?: boolean;
};

export function BarChartCard({ title, subtitle, data, sourceLabel, isLoading = false }: BarChartCardProps) {
  const isWeb = Platform.OS === 'web';
  const chartData = data.map((point) => ({
    value: point.value,
    label: point.label,
    frontColor: point.frontColor ?? colors.accent,
  }));

  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {isLoading ? <LoadingState message="Loading chart data..." /> : null}
      {!isLoading && chartData.length === 0 ? <EmptyChartState /> : null}
      {!isLoading && chartData.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={chartData}
            barBorderRadius={5}
            barWidth={24}
            disablePress={isWeb}
            height={180}
            initialSpacing={14}
            isAnimated={!isWeb}
            noOfSections={4}
            spacing={28}
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
