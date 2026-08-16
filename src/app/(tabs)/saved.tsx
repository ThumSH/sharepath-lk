import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { LessonCard } from '@/components/cards/LessonCard';
import { SavedAnnouncementCard } from '@/components/cards/SavedAnnouncementCard';
import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { companies } from '@/data/companies';
import { lessons } from '@/data/lessons';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { getOfficialUpdates } from '@/services/sharepathData';
import { getSavedAnnouncements, getSavedLessons, getWatchlist } from '@/services/userDataService';
import type { OfficialUpdate } from '@/types/market';

export default function SavedScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [savedLessonIds, setSavedLessonIds] = useState<string[]>([]);
  const [savedAnnouncements, setSavedAnnouncements] = useState<OfficialUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setWatchlistSymbols([]);
          setSavedLessonIds([]);
          setSavedAnnouncements([]);
          setIsLoading(false);
        }
      });
      return;
    }

    Promise.resolve()
      .then(() => {
        if (isMounted) {
          setIsLoading(true);
        }
        return Promise.all([getWatchlist(user.id), getSavedLessons(user.id), getSavedAnnouncements(user.id), getOfficialUpdates()]);
      })
      .then(([watchlistResult, lessonsResult, announcementsResult, updatesResult]) => {
        if (!isMounted) {
          return;
        }

        const savedIds = new Set(announcementsResult.data.map((item) => item.announcementId));
        setWatchlistSymbols(watchlistResult.data.map((item) => item.companySymbol));
        setSavedLessonIds(lessonsResult.data.map((item) => item.lessonId));
        setSavedAnnouncements(updatesResult.data.filter((update) => update.id && savedIds.has(update.id)));
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const watchlistCompanies = companies.filter((company) => watchlistSymbols.includes(company.symbol));
  const savedLessons = lessons.filter((lesson) => savedLessonIds.includes(lesson.id));

  if (!isAuthenticated) {
    return (
      <AppScreen bottomInset={88}>
        <PageHeader title="Saved" subtitle="Save companies, lessons, and official updates after account setup." />
        <EmptyState
          title="Sign in to save companies, lessons, and official updates."
          message="Guest browsing stays available. Account setup is only needed for personal saved items."
          actionLabel="Sign In"
          onAction={() => router.push(routes.login)}
        />
        <PrimaryButton variant="secondary" onPress={() => router.push(routes.register)}>
          Create Account
        </PrimaryButton>
        <PrimaryButton variant="subtle" onPress={() => router.push(routes.companies)}>
          Continue Exploring
        </PrimaryButton>
      </AppScreen>
    );
  }

  return (
    <AppScreen bottomInset={88}>
      <PageHeader title="Saved" subtitle="Companies, lessons, and official updates saved for later will appear here." />
      {isLoading ? <LoadingState message="Loading your saved items..." /> : null}
      <View style={styles.sectionList}>
        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Watchlist Companies</Text>
          <Text style={styles.sectionMeta}>{watchlistCompanies.length} items</Text>
        </AppCard>
        {watchlistCompanies.map((company) => (
          <CompanyCard key={company.symbol} company={company} onPress={() => router.push(routes.company(company.symbol))} />
        ))}

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Saved Lessons</Text>
          <Text style={styles.sectionMeta}>{savedLessons.length} items</Text>
        </AppCard>
        {savedLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onPress={() => router.push(routes.lesson(lesson.id))} />
        ))}

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Saved Official Updates</Text>
          <Text style={styles.sectionMeta}>{savedAnnouncements.length} items</Text>
        </AppCard>
        {savedAnnouncements.length > 0 ? (
          savedAnnouncements.map((update) => <SavedAnnouncementCard key={update.id ?? update.title} update={update} />)
        ) : (
          <InfoBox>Saved official updates will appear here.</InfoBox>
        )}
      </View>
      {!isLoading && watchlistCompanies.length === 0 && savedLessons.length === 0 && savedAnnouncements.length === 0 ? (
        <EmptyState
          title="Your saved items will appear here."
          message="Save companies, lessons, or official updates to revisit them later."
          actionLabel="Explore Companies"
          onAction={() => router.push(routes.companies)}
        />
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  sectionList: {
    gap: spacing.sm,
  },
  sectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 15,
  },
  sectionMeta: {
    color: colors.muted,
    fontFamily: typography.medium,
    fontSize: 13,
  },
});
