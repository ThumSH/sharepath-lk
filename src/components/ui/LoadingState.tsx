import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={styles.box}>
      <View style={styles.dot} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: colors.softBlue,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  dot: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  text: {
    color: colors.primary,
    flex: 1,
    fontFamily: typography.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
