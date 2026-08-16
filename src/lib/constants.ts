import { colors as themeColors, radius, spacing, typography } from '@/lib/theme';

export const colors = {
  ...themeColors,
  secondary: themeColors.primarySoft,
  card: themeColors.surface,
  text: themeColors.textPrimary,
  muted: themeColors.textMuted,
  amber: themeColors.warning,
  softAmber: themeColors.warningSoft,
  softBlue: themeColors.primaryMuted,
  softGreen: themeColors.accentSoft,
} as const;

export { spacing, typography };

export const radii = radius;

export const advisoryDisclaimer =
  'Educational only. SharePath LK does not provide financial advice.';
