import { StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { spacing } from '@/lib/constants';
import type { ChartRange } from '@/types/history';

const ranges: ChartRange[] = ['1M', '6M', '1Y', '5Y', 'ALL'];

type ChartRangeSelectorProps = {
  value: ChartRange;
  onChange: (range: ChartRange) => void;
};

export function ChartRangeSelector({ value, onChange }: ChartRangeSelectorProps) {
  return (
    <View style={styles.wrap}>
      {ranges.map((range) => (
        <Pill key={range} label={range} active={value === range} onPress={() => onChange(range)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
