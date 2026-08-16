import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type StatCardProps = {
  label: string;
  value: string;
  note?: string;
};

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 142,
    padding: spacing.md,
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontFamily: typography.medium,
    fontSize: 12,
  },
  value: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 17,
    lineHeight: 22,
  },
  note: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 12,
  },
});
