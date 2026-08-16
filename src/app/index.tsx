import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { LoadingState } from '@/components/ui/LoadingState';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/lib/routes';

const onboardingCompleteKey = 'sharepath_has_completed_onboarding';

export default function Index() {
  const { isLoading, isAuthenticated, profile } = useAuth();
  const [hasCompletedGuestOnboarding, setHasCompletedGuestOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(onboardingCompleteKey).then((value) => {
      if (isMounted) {
        setHasCompletedGuestOnboarding(value === 'true');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || hasCompletedGuestOnboarding === null) {
    return <LoadingState message="Checking your account..." />;
  }

  if (isAuthenticated) {
    return <Redirect href={profile?.hasCompletedOnboarding ? routes.home : routes.welcome} />;
  }

  return <Redirect href={hasCompletedGuestOnboarding ? routes.home : routes.welcome} />;
}
