import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type DisclaimerStripProps = {
  text: string;
};

export function DisclaimerStrip({ text }: DisclaimerStripProps) {
  return (
    <View style={styles.strip}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: colors.softAmber,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    color: colors.gold,
    fontFamily: typography.semiBold,
    fontSize: 13,
    lineHeight: 19,
  },
});
