import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '@/lib/constants';

type BackButtonProps = {
  fallback?: () => void;
  label?: string;
  style?: ViewStyle;
};

export function BackButton({ fallback, label = 'Back', style }: BackButtonProps) {
  const router = useRouter();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    fallback?.();
  }

  return (
    <Pressable onPress={goBack} style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Ionicons name="chevron-back" size={18} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.72,
  },
  label: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
});
