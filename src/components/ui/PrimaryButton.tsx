import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'subtle';
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({ children, onPress, variant = 'primary', style, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'subtle' && styles.subtle,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, variant !== 'primary' && styles.secondaryText]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  secondary: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.border,
    borderWidth: 1,
  },
  subtle: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.76,
  },
  text: {
    color: colors.textOnPrimary,
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  secondaryText: {
    color: colors.primary,
  },
});
