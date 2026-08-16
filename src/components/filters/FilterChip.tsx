import { Pill } from '@/components/ui/Pill';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return <Pill label={label} active={active} onPress={onPress} />;
}
