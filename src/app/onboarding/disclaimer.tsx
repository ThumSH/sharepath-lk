import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { BackButton } from '@/components/ui/BackButton';
import { DisclaimerStrip } from '@/components/ui/DisclaimerStrip';
import { InfoBox } from '@/components/ui/InfoBox';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { updateOnboardingProfile } from '@/services/authService';

const knowledgeLevelKey = 'sharepath:onboarding:knowledgeLevel';
const learningGoalKey = 'sharepath:onboarding:learningGoal';
const onboardingCompleteKey = 'sharepath_has_completed_onboarding';

export default function DisclaimerScreen() {
  const router = useRouter();
  const { user, refreshAuth } = useAuth();

  async function finishOnboarding() {
    await AsyncStorage.setItem(onboardingCompleteKey, 'true');

    if (user) {
      const [knowledgeLevel, learningGoal] = await Promise.all([
        AsyncStorage.getItem(knowledgeLevelKey),
        AsyncStorage.getItem(learningGoalKey),
      ]);

      await updateOnboardingProfile({
        userId: user.id,
        knowledgeLevel,
        learningGoal,
      });
      await refreshAuth();
    }

    router.replace(routes.home);
  }

  return (
    <AppScreen scroll={false}>
      <BackButton fallback={() => router.replace(routes.learningGoal)} />
      <View style={styles.wrapper}>
        <Text style={styles.step}>Step 3 of 3</Text>
        <Text style={styles.title}>Education first</Text>
        <DisclaimerStrip text="Past performance does not predict future results." />
        <InfoBox tone="amber">
          SharePath LK is for education and historical market information only. We do not provide
          buy/sell recommendations, predictions, target prices, or financial advice.
        </InfoBox>
        <PrimaryButton onPress={finishOnboarding}>I Understand</PrimaryButton>
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
  step: {
    color: colors.accent,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  title: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 32,
  },
});
