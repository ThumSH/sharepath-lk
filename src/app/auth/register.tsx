import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { PageHeader } from '@/components/layout/PageHeader';
import { BackButton } from '@/components/ui/BackButton';
import { InfoBox } from '@/components/ui/InfoBox';
import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { colors, radii, spacing, typography } from '@/lib/constants';
import { routes } from '@/lib/routes';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const errorMessage = await signUp(email, password, displayName);

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
        title="Create your SharePath LK account"
        subtitle="Create an account to save companies, lessons, and official updates for later."
      />
      <View style={styles.form}>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Display name"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
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
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm password"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>
      {message ? <InfoBox tone="amber">{message}</InfoBox> : null}
      {isLoading ? <LoadingState message="Creating account..." /> : null}
      <PrimaryButton
        onPress={submit}
        disabled={!email || !password || !confirmPassword || isLoading}>
        Create Account
      </PrimaryButton>
      <PrimaryButton variant="secondary" onPress={() => router.push(routes.login)}>
        Already have an account? Sign in
      </PrimaryButton>
      <PrimaryButton variant="subtle" onPress={() => router.replace(routes.home)}>
        Continue as Guest
      </PrimaryButton>
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
});
