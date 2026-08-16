import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/lib/constants';

type SourceBadgeProps = {
  label?: string | null;
  status?: 'sample' | 'verified' | 'pending_review' | 'draft' | 'official';
};

function displayLabel(label?: string | null, status?: SourceBadgeProps['status']) {
  if (label) {
    return label;
  }

  if (status === 'verified') {
    return 'Verified data';
  }

  if (status === 'pending_review') {
    return 'Pending review';
  }

  if (status === 'official') {
    return 'Official source';
  }

  return 'Sample data';
}

export function SourceBadge({ label, status }: SourceBadgeProps) {
  const text = displayLabel(label, status);
  const isVerified = status === 'verified' || status === 'official' || text.toLowerCase().includes('official');
  const isPending = status === 'pending_review' || text.toLowerCase().includes('pending');

  return (
    <View style={[styles.badge, isVerified && styles.verified, isPending && styles.pending]}>
      <Text style={[styles.text, isVerified && styles.verifiedText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  verified: {
    backgroundColor: colors.softGreen,
    borderColor: colors.accent,
  },
  pending: {
    backgroundColor: colors.softAmber,
    borderColor: colors.warning,
  },
  text: {
    color: colors.muted,
    fontFamily: typography.semiBold,
    fontSize: 11,
  },
  verifiedText: {
    color: colors.primary,
  },
});
