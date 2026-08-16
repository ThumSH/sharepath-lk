import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { colors, radii, spacing, typography } from '@/lib/constants';

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type SelectDropdownProps<T extends string> = {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

export function SelectDropdown<T extends string>({ label, value, options, onChange }: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <Pressable style={styles.button} onPress={() => setIsOpen(true)}>
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value} numberOfLines={1}>
            {selected?.label ?? value}
          </Text>
        </View>
        <Feather name="chevron-down" color={colors.primary} size={18} />
      </Pressable>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <AppCard style={styles.menu}>
            <Text style={styles.menuTitle}>{label}</Text>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.option, option.value === value && styles.activeOption]}
                onPress={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}>
                <Text style={[styles.optionText, option.value === value && styles.activeOptionText]}>{option.label}</Text>
              </Pressable>
            ))}
          </AppCard>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minHeight: 52,
    minWidth: 150,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  labelWrap: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 11,
  },
  value: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 14,
  },
  overlay: {
    backgroundColor: 'rgba(11, 31, 51, 0.24)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  menu: {
    maxWidth: 480,
    width: '100%',
  },
  menuTitle: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 17,
  },
  option: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  activeOption: {
    backgroundColor: colors.primaryMuted,
  },
  optionText: {
    color: colors.text,
    fontFamily: typography.medium,
    fontSize: 14,
  },
  activeOptionText: {
    color: colors.primary,
  },
});
