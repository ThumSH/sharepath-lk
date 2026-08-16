import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <AppScreen scroll={false}>
      <View style={styles.wrapper}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sri Lankan Market Guide</Text>
          </View>
          <View style={styles.brandMark}>
            <Text style={styles.brandInitials}>LK</Text>
          </View>
          <Text style={styles.appName}>SharePath LK</Text>
          <Text style={styles.tagline}>Understand before you invest.</Text>
          <Text style={styles.description}>
            A simple guide to help you understand Sri Lankan companies, market history, currency
            movement, and investment basics.
          </Text>
        </View>
        <PrimaryButton onPress={() => router.push(routes.knowledgeLevel)}>Get Started</PrimaryButton>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  hero: {
    backgroundColor: colors.primary,
    borderColor: colors.primarySoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.goldSoft,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.gold,
    fontFamily: typography.semiBold,
    fontSize: 12,
  },
  brandMark: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: radii.lg,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  brandInitials: {
    color: colors.primary,
    fontFamily: typography.bold,
    fontSize: 22,
  },
  appName: {
    color: colors.textOnPrimary,
    fontFamily: typography.bold,
    fontSize: 40,
    letterSpacing: 0,
  },
  tagline: {
    color: colors.textOnPrimary,
    fontFamily: typography.bold,
    fontSize: 25,
    lineHeight: 31,
  },
  description: {
    color: colors.primaryMuted,
    fontFamily: typography.regular,
    fontSize: 16,
    lineHeight: 24,
  },
});
