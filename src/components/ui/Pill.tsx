import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type PillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Pill({ label, active = false, onPress }: PillProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, active && styles.active, pressed && styles.pressed]}>
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  active: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.78,
  },
  text: {
    color: colors.text,
    fontFamily: typography.medium,
    fontSize: 13,
  },
  activeText: {
    color: colors.primary,
  },
});
