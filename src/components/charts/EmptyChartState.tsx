import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type EmptyChartStateProps = {
  message?: string;
};

export function EmptyChartState({ message = 'Data unavailable for this chart.' }: EmptyChartStateProps) {
  return (
    <View style={styles.empty}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 160,
    padding: spacing.md,
  },
  text: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 13,
    textAlign: 'center',
  },
});
