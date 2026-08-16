import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Pill } from '@/components/ui/Pill';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';

const goals = [
  'Stock market basics',
  'How to study companies',
  'Currency and economy',
  'How to start investing carefully',
  'Explore market data',
];
const learningGoalKey = 'sharepath:onboarding:learningGoal';

export default function LearningGoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState(goals[0]);

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>What do you want to learn first?</Text>
        <Text style={styles.subtitle}>Choose one topic to begin with. You can explore everything later.</Text>
      </View>
      <View style={styles.options}>
        {goals.map((goal) => (
          <Pill key={goal} label={goal} active={selected === goal} onPress={() => setSelected(goal)} />
        ))}
      </View>
      <PrimaryButton
        onPress={async () => {
          await AsyncStorage.setItem(learningGoalKey, selected);
          router.push(routes.disclaimer);
        }}>
        Continue
      </PrimaryButton>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  step: {
    color: colors.accent,
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  title: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
