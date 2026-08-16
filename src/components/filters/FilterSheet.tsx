import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { spacing } from '@/lib/constants';

type FilterSheetProps = {
  children: ReactNode;
  onClear: () => void;
  showClear?: boolean;
};

export function FilterSheet({ children, onClear, showClear = true }: FilterSheetProps) {
  return (
    <View style={styles.wrap}>
      {children}
      {showClear ? (
        <View style={styles.clear}>
          <SecondaryButton onPress={onClear}>Clear filters</SecondaryButton>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  clear: {
    alignSelf: 'flex-start',
  },
});
