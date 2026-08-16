import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BackButton } from '@/components/ui/BackButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pill } from '@/components/ui/Pill';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';
import { createOrUpdateProfile } from '@/services/authService';

const knowledgeOptions = ['I am completely new', 'I know the basics', 'I already invest', 'I just want to explore'];
const learningGoalOptions = [
  'Stock market basics',
  'How to study companies',
  'Currency and economy',
  'How to start investing carefully',
  'Explore market data',
];

export default function AccountScreen() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading, logout, refreshAuth } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState<string | null>(null);
  const [learningGoal, setLearningGoal] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(() => {
      if (!isMounted) {
        return;
      }

      setDisplayName(profile?.displayName ?? '');
      setKnowledgeLevel(profile?.knowledgeLevel ?? null);
      setLearningGoal(profile?.learningGoal ?? null);
    });

    return () => {
      isMounted = false;
    };
  }, [profile]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await logout();
    setIsSigningOut(false);
    router.replace(routes.home);
  }

  async function saveProfile() {
    if (!user) {
      return;
    }

    setMessage(null);
    setIsSavingProfile(true);
    const result = await createOrUpdateProfile({
      id: user.id,
      email: profile?.email ?? user.email ?? null,
      displayName: displayName.trim() || null,
      knowledgeLevel,
      learningGoal,
      hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    });

    if (result.errorMessage) {
      setMessage('Could not update profile. Please try again.');
    } else {
      await refreshAuth();
      setMessage('Profile updated.');
      setIsEditing(false);
    }

    setIsSavingProfile(false);
  }

  function cancelEdit() {
    setDisplayName(profile?.displayName ?? '');
    setKnowledgeLevel(profile?.knowledgeLevel ?? null);
    setLearningGoal(profile?.learningGoal ?? null);
    setMessage(null);
    setIsEditing(false);
  }

  if (!isAuthenticated) {
    return (
      <AppScreen>
        <BackButton fallback={() => router.replace(routes.home)} />
        <EmptyState
          title="Sign in to view your account"
          message="Your profile and saved learning preferences will appear here after account setup."
          actionLabel="Sign In"
          onAction={() => router.push(routes.login)}
        />
        <PrimaryButton variant="secondary" onPress={() => router.replace(routes.home)}>
          Continue Exploring
        </PrimaryButton>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <BackButton fallback={() => router.replace(routes.home)} />
      <PageHeader title="Account" subtitle="Your learning preferences and profile details." />
      {isLoading ? <LoadingState message="Checking your account..." /> : null}
      {isSavingProfile ? <LoadingState message="Saving profile..." /> : null}
      {isSigningOut ? <LoadingState message="Signing out..." /> : null}
      {message ? <InfoBox tone={message === 'Profile updated.' ? 'green' : 'amber'}>{message}</InfoBox> : null}
      <AppCard>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile?.email ?? user?.email ?? 'Not available'}</Text>
        <Text style={styles.label}>Display name</Text>
        {isEditing ? (
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        ) : (
          <Text style={styles.value}>{profile?.displayName || 'Not set'}</Text>
        )}
        <Text style={styles.label}>Knowledge level</Text>
        {isEditing ? (
          <View style={styles.optionList}>
            {knowledgeOptions.map((option) => (
              <Pill key={option} label={option} active={knowledgeLevel === option} onPress={() => setKnowledgeLevel(option)} />
            ))}
          </View>
        ) : (
          <Text style={styles.value}>{profile?.knowledgeLevel || 'Not set'}</Text>
        )}
        <Text style={styles.label}>Learning goal</Text>
        {isEditing ? (
          <View style={styles.optionList}>
            {learningGoalOptions.map((option) => (
              <Pill key={option} label={option} active={learningGoal === option} onPress={() => setLearningGoal(option)} />
            ))}
          </View>
        ) : (
          <Text style={styles.value}>{profile?.learningGoal || 'Not set'}</Text>
        )}
        <Text style={styles.label}>Account status</Text>
        <Text style={styles.value}>{profile?.hasCompletedOnboarding ? 'Onboarding completed' : 'Onboarding not completed'}</Text>
      </AppCard>
      {isEditing ? (
        <>
          <PrimaryButton onPress={saveProfile} disabled={isSavingProfile}>
            Save Changes
          </PrimaryButton>
          <PrimaryButton variant="subtle" onPress={cancelEdit} disabled={isSavingProfile}>
            Cancel
          </PrimaryButton>
        </>
      ) : (
        <PrimaryButton onPress={() => setIsEditing(true)}>
          Edit Profile
        </PrimaryButton>
      )}
      <PrimaryButton variant="secondary" onPress={handleSignOut} disabled={isSigningOut}>
        Sign Out
      </PrimaryButton>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.muted,
    fontFamily: typography.semiBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontFamily: typography.semiBold,
    fontSize: 16,
    lineHeight: 23,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  optionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
