import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TermTooltip } from '@/components/education/TermTooltip';
import { LessonCard } from '@/components/cards/LessonCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { InfoBox } from '@/components/ui/InfoBox';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { lessonCategories, lessons } from '@/data/lessons';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getUserLessonProgress } from '@/services/learningService';
import { getLessons } from '@/services/sharepathData';

const pathDescriptions: Record<string, string> = {
  'Start Here': 'Build the basic language of investing before looking at company data.',
  'Understand Companies': 'Learn the financial terms used in reports and company summaries.',
  'Market Movement': 'Understand how broad market activity is summarized.',
  'Currency & Economy': 'Learn why exchange rates can matter for different companies.',
  'Before You Invest': 'Review account setup, habits, and beginner checks.',
};

export default function LearnScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const lessonsState = useAsyncData(getLessons, lessons, []);
  const progressState = useAsyncData(
    () => getUserLessonProgress(user?.id ?? '').then((result) => ({ data: result.data, isFallback: Boolean(result.errorMessage) })),
    [],
    [user?.id]
  );
  const categories = lessonCategories.filter((category) =>
    lessonsState.data.some((lesson) => lesson.category === category)
  );
  const completedCount = progressState.data.filter((item) => item.completedAt).length;
  const viewedCount = progressState.data.length;

  return (
    <AppScreen bottomInset={88}>
      <PageHeader title="Learn" subtitle="Short guides for understanding investing, companies, and market context." />
      <AppCard>
        <Text style={styles.pathTitle}>Investment Glossary</Text>
        <Text style={styles.pathDescription}>Understand common share market terms in simple language.</Text>
        <View style={styles.tooltipRow}>
          <TermTooltip term="EPS" />
          <TermTooltip term="NAV" />
          <TermTooltip term="ASPI" />
        </View>
        <PrimaryButton variant="secondary" onPress={() => router.push(routes.glossary)}>
          Open Glossary
        </PrimaryButton>
      </AppCard>
      <InfoBox>
        {isAuthenticated
          ? `${viewedCount} of ${lessonsState.data.length} lessons viewed. ${completedCount} completed.`
          : 'Sign in to track viewed and completed lessons separately from saved lessons.'}
      </InfoBox>
      {lessonsState.isLoading ? <InfoBox>Loading lessons...</InfoBox> : null}
      {!lessonsState.isLoading && lessonsState.isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}
      {categories.map((category) => {
        const categoryLessons = lessonsState.data.filter((lesson) => lesson.category === category);
        return (
          <View key={category} style={styles.path}>
            <AppCard style={styles.pathCard}>
              <View style={styles.pathMarker} />
              <View style={styles.pathCopy}>
                <Text style={styles.pathTitle}>{category}</Text>
                <Text style={styles.pathDescription}>{pathDescriptions[category]}</Text>
                <Text style={styles.lessonCount}>{categoryLessons.length} lessons</Text>
              </View>
            </AppCard>
            {categoryLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onPress={() => router.push(routes.lesson(lesson.id))}
              />
            ))}
          </View>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  path: {
    gap: spacing.sm,
  },
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathMarker: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 44,
    width: 44,
  },
  pathCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  pathTitle: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 17,
  },
  pathDescription: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  lessonCount: {
    color: colors.gold,
    fontFamily: typography.semiBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  tooltipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
