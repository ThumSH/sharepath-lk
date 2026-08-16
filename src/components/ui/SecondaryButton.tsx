import type { ReactNode } from 'react';

import { PrimaryButton } from '@/components/ui/PrimaryButton';

type SecondaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
};

export function SecondaryButton({ children, onPress }: SecondaryButtonProps) {
  return (
    <PrimaryButton variant="secondary" onPress={onPress}>
      {children}
    </PrimaryButton>
  );
}
