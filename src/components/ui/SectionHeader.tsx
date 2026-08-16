import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/lib/constants';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  title: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 18,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
  },
});
