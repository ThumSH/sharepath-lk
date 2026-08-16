import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { BackButton } from '@/components/ui/BackButton';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setMessage(null);
    const errorMessage = await signIn(email, password);

    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    router.replace(routes.home);
  }

  return (
    <AppScreen>
      <BackButton fallback={() => router.replace(routes.home)} />
      <PageHeader
        title="Save your learning progress"
        subtitle="Sign in to keep your watchlist, saved lessons, and learning preferences."
      />
      <View style={styles.form}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>
      {message ? <InfoBox tone="amber">{message}</InfoBox> : null}
      {isLoading ? <LoadingState message="Signing in..." /> : null}
      <PrimaryButton onPress={submit} disabled={!email || !password || isLoading}>
        Sign In
      </PrimaryButton>
      <PrimaryButton variant="secondary" onPress={() => router.push(routes.register)}>
        Create Account
      </PrimaryButton>
      <PrimaryButton variant="subtle" onPress={() => router.replace(routes.home)}>
        Continue as Guest
      </PrimaryButton>
      <Text style={styles.note}>Guest browsing stays available for public learning guides and market summaries.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.sm,
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
  note: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
