import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type ErrorStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({
  title = 'We could not load this right now.',
  message = 'Please try again.',
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? <PrimaryButton onPress={onAction}>{actionLabel}</PrimaryButton> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  title: {
    color: colors.danger,
    fontFamily: typography.bold,
    fontSize: 17,
  },
  message: {
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
