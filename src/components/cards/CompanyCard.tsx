import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Company } from '@/types/company';
import { colors, radii, spacing, typography } from '@/lib/constants';

type CompanyCardProps = {
  company: Company;
  onPress: () => void;
};

export function CompanyCard({ company, onPress }: CompanyCardProps) {
  const movementColor = company.oneYearMovement >= 0 ? colors.accent : colors.danger;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{company.name}</Text>
          <Text style={styles.symbol}>{company.symbol}</Text>
        </View>
        <Text style={styles.price}>LKR {company.currentPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.sector}>{company.sector}</Text>
        <Text style={[styles.movement, { color: movementColor }]}>
          {company.oneYearMovement >= 0 ? '+' : ''}
          {company.oneYearMovement}% 1Y history
        </Text>
      </View>
      <Text style={styles.updated}>Updated {company.lastUpdated}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: 20,
    boxShadow: '0 8px 20px rgba(11, 31, 51, 0.045)',
  },
  pressed: {
    opacity: 0.78,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 16,
    lineHeight: 21,
  },
  symbol: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 12,
  },
  price: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sector: {
    color: colors.secondary,
    fontFamily: typography.medium,
    fontSize: 13,
  },
  movement: {
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  updated: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 12,
  },
});
