import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BackButton } from '@/components/ui/BackButton';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { lessons } from '@/data/lessons';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useAuth } from '@/hooks/useAuth';
import { colors, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getUserLessonProgress, markLessonCompleted, markLessonViewed } from '@/services/learningService';
import { getLessonById } from '@/services/sharepathData';
import { isLessonSaved, removeSavedLesson, saveLesson } from '@/services/userDataService';

export default function LessonDetailsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const routeId = typeof id === 'string' ? id : '';
  const lessonState = useAsyncData(
    () => getLessonById(routeId),
    lessons.find((item) => item.id === routeId),
    [routeId]
  );
  const lesson = lessonState.data;

  useEffect(() => {
    let isMounted = true;

    if (!user || !routeId) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setIsSaved(false);
        }
      });
      return;
    }

    isLessonSaved(user.id, routeId).then((result) => {
      if (isMounted) {
        setIsSaved(result.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [routeId, user]);

  useEffect(() => {
    if (!user || !routeId) {
      Promise.resolve().then(() => setIsCompleted(false));
      return;
    }

    void markLessonViewed(user.id, routeId);
    getUserLessonProgress(user.id).then((result) => {
      setIsCompleted(Boolean(result.data.find((item) => item.lessonId === routeId)?.completedAt));
    });
  }, [routeId, user]);

  async function toggleSavedLesson() {
    setSaveMessage(null);

    if (!isAuthenticated || !user) {
      setSaveMessage('Sign in to save this lesson for later.');
      router.push(routes.login);
      return;
    }

    setIsSaving(true);
    const result = isSaved ? await removeSavedLesson(user.id, routeId) : await saveLesson(user.id, routeId);

    if (result.errorMessage) {
      setSaveMessage(result.errorMessage);
    } else {
      setIsSaved(!isSaved);
      setSaveMessage(isSaved ? 'Removed saved lesson.' : 'Saved lesson for later.');
    }

    setIsSaving(false);
  }

  async function completeLesson() {
    setProgressMessage(null);

    if (!isAuthenticated || !user) {
      setProgressMessage('Sign in to track lesson progress.');
      router.push(routes.login);
      return;
    }

    const result = await markLessonCompleted(user.id, routeId);
    if (result.errorMessage) {
      setProgressMessage(result.errorMessage);
      return;
    }

    setIsCompleted(true);
    setProgressMessage('Completed. Saved lessons remain separate bookmarks.');
  }

  if (!lesson) {
    return (
      <AppScreen>
        <BackButton fallback={() => router.replace(routes.learn)} />
        {lessonState.isLoading ? <LoadingState message="Loading lesson details..." /> : null}
        <ErrorState
          title="Lesson not found"
          message="This learning guide is not available right now."
          actionLabel="Back to Learn"
          onAction={() => router.replace(routes.learn)}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <BackButton fallback={() => router.replace(routes.learn)} />
      <PageHeader eyebrow={lesson.category} title={lesson.title} subtitle={`${lesson.readingTime} read`} />
      <PrimaryButton onPress={toggleSavedLesson} disabled={isSaving}>
        {isSaving ? (isSaved ? 'Removing...' : 'Saving...') : isSaved ? 'Remove Saved Lesson' : 'Save Lesson'}
      </PrimaryButton>
      <PrimaryButton variant="secondary" onPress={completeLesson} disabled={isCompleted}>
        {isCompleted ? 'Completed' : 'Mark as Complete'}
      </PrimaryButton>
      {saveMessage ? <InfoBox tone="amber">{saveMessage}</InfoBox> : null}
      {progressMessage ? <InfoBox tone="green">{progressMessage}</InfoBox> : null}
      <InfoBox>Saved Lesson means bookmark. Completed Lesson means learning progress.</InfoBox>
      {lessonState.isLoading ? <LoadingState message="Loading lesson details..." /> : null}
      {!lessonState.isLoading && lessonState.isFallback ? <InfoBox>Showing sample data for now.</InfoBox> : null}

      <AppCard>
        <Text style={styles.description}>{lesson.description}</Text>
      </AppCard>

      <SectionHeader title="Key Points" />
      <AppCard>
        {lesson.keyPoints.map((point) => (
          <Text key={point} style={styles.point}>
            - {point}
          </Text>
        ))}
      </AppCard>

      <SectionHeader title="Remember" />
      <AppCard style={styles.rememberBox}>
        <Text style={styles.remember}>{lesson.remember}</Text>
      </AppCard>

      <PrimaryButton variant="secondary" onPress={() => router.push(routes.learn)}>
        Back to Learn
      </PrimaryButton>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  description: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  point: {
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 15,
    lineHeight: 25,
  },
  rememberBox: {
    backgroundColor: colors.softGreen,
    borderColor: colors.border,
  },
  remember: {
    color: colors.primary,
    fontFamily: typography.semiBold,
    fontSize: 15,
    lineHeight: 23,
  },
});
