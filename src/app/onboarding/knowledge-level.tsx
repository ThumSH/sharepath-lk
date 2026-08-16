import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { AppCard } from '@/components/ui/AppCard';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';

const options = ['I am completely new', 'I know the basics', 'I already invest', 'I just want to explore'];
const knowledgeLevelKey = 'sharepath:onboarding:knowledgeLevel';

export default function KnowledgeLevelScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>();

  async function choose(option: string) {
    setSelected(option);
    await AsyncStorage.setItem(knowledgeLevelKey, option);
    router.push(routes.learningGoal);
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>How familiar are you with investing?</Text>
        <Text style={styles.subtitle}>This only shapes the learning path later. No account setup is needed now.</Text>
      </View>
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable key={option} onPress={() => choose(option)}>
            <AppCard style={selected === option ? styles.selectedCard : undefined}>
              <Text style={styles.optionText}>{option}</Text>
            </AppCard>
          </Pressable>
        ))}
      </View>
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
    gap: spacing.sm,
  },
  selectedCard: {
    borderColor: colors.accent,
    backgroundColor: colors.softGreen,
  },
  optionText: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
});
