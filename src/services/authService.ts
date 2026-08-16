import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { AuthUser, ProfileInput, UserProfile, UserProfileDbRow } from '@/types/auth';

type ServiceResult<T> = {
  data: T | null;
  errorMessage: string | null;
};

function logAuthError(label: string, error: unknown) {
  if (__DEV__) {
    console.warn(label, error);
  }
}

function mapProfile(row: UserProfileDbRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    knowledgeLevel: row.knowledge_level,
    learningGoal: row.learning_goal,
    hasCompletedOnboarding: Boolean(row.has_completed_onboarding),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAuthUser(user: { id: string; email?: string | null } | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
  };
}

export async function getCurrentSession(): Promise<ServiceResult<Session>> {
  if (!supabase) {
    return { data: null, errorMessage: null };
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    logAuthError('Could not read current session.', error);
    return { data: null, errorMessage: 'Could not read your session right now.' };
  }

  return { data: data.session, errorMessage: null };
}

export async function getCurrentUser(): Promise<ServiceResult<AuthUser>> {
  if (!supabase) {
    return { data: null, errorMessage: null };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    logAuthError('Could not read current user.', error);
    return { data: null, errorMessage: 'Could not read your account right now.' };
  }

  return { data: mapAuthUser(data.user), errorMessage: null };
}

export async function signInWithEmail(email: string, password: string): Promise<ServiceResult<AuthUser>> {
  if (!supabase) {
    return { data: null, errorMessage: 'Account features are unavailable until Supabase is configured.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

  if (error) {
    logAuthError('Sign in failed.', error);
    return { data: null, errorMessage: 'Could not sign in. Please check your email and password.' };
  }

  return { data: mapAuthUser(data.user), errorMessage: null };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<ServiceResult<AuthUser>> {
  if (!supabase) {
    return { data: null, errorMessage: 'Account features are unavailable until Supabase is configured.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        display_name: displayName?.trim() || null,
      },
    },
  });

  if (error) {
    logAuthError('Account creation failed.', error);
    return { data: null, errorMessage: 'Could not create your account right now. Please try again.' };
  }

  if (data.user) {
    await createOrUpdateProfile({
      id: data.user.id,
      email: data.user.email ?? email.trim(),
      displayName: displayName?.trim() || data.user.email?.split('@')[0] || null,
    });
  }

  return { data: mapAuthUser(data.user), errorMessage: null };
}

export async function signOut(): Promise<ServiceResult<boolean>> {
  if (!supabase) {
    return { data: true, errorMessage: null };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    logAuthError('Sign out failed.', error);
    return { data: false, errorMessage: 'Could not sign out right now. Please try again.' };
  }

  return { data: true, errorMessage: null };
}

export async function getProfile(userId: string): Promise<ServiceResult<UserProfile>> {
  if (!supabase || !userId) {
    return { data: null, errorMessage: null };
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    logAuthError('Profile lookup failed.', error);
    return { data: null, errorMessage: 'Could not load your profile right now.' };
  }

  return { data: data ? mapProfile(data as UserProfileDbRow) : null, errorMessage: null };
}

export async function createOrUpdateProfile(profileInput: ProfileInput): Promise<ServiceResult<UserProfile>> {
  if (!supabase) {
    return { data: null, errorMessage: 'Account features are unavailable until Supabase is configured.' };
  }

  const payload = {
    id: profileInput.id,
    email: profileInput.email ?? null,
    display_name: profileInput.displayName ?? null,
    knowledge_level: profileInput.knowledgeLevel ?? null,
    learning_goal: profileInput.learningGoal ?? null,
    has_completed_onboarding: profileInput.hasCompletedOnboarding ?? false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select('*').single();

  if (error) {
    logAuthError('Profile update failed.', error);
    return { data: null, errorMessage: 'Could not update your profile right now.' };
  }

  return { data: mapProfile(data as UserProfileDbRow), errorMessage: null };
}

export async function updateOnboardingProfile(input: {
  userId: string;
  knowledgeLevel: string | null;
  learningGoal: string | null;
}): Promise<ServiceResult<UserProfile>> {
  const currentProfile = await getProfile(input.userId);

  return createOrUpdateProfile({
    id: input.userId,
    email: currentProfile.data?.email ?? null,
    displayName: currentProfile.data?.displayName ?? null,
    knowledgeLevel: input.knowledgeLevel,
    learningGoal: input.learningGoal,
    hasCompletedOnboarding: true,
  });
}
