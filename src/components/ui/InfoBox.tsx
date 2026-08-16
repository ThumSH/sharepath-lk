import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type InfoBoxProps = {
  title?: string;
  children: ReactNode;
  tone?: 'blue' | 'green' | 'amber';
};

export function InfoBox({ title, children, tone = 'blue' }: InfoBoxProps) {
  return (
    <View style={[styles.box, tone === 'green' && styles.green, tone === 'amber' && styles.amber]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.softBlue,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  green: {
    backgroundColor: colors.softGreen,
    borderColor: colors.border,
  },
  amber: {
    backgroundColor: colors.softAmber,
    borderColor: colors.border,
  },
  title: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  text: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
