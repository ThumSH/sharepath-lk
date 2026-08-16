import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, typography } from '@/lib/constants';

type AnnouncementCardProps = {
  title?: string;
  summary: string;
  actionLabel?: string;
  onAction?: () => void;
  isActionDisabled?: boolean;
  helperText?: string | null;
};

export function AnnouncementCard({
  title = 'Official update summary',
  summary,
  actionLabel,
  onAction,
  isActionDisabled = false,
  helperText,
}: AnnouncementCardProps) {
  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton variant="secondary" onPress={onAction} disabled={isActionDisabled}>
            {actionLabel}
          </PrimaryButton>
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.gold,
    fontFamily: typography.semiBold,
    fontSize: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  summary: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  helper: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  action: {
    alignSelf: 'stretch',
  },
});
