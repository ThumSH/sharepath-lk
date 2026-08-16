import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui(defaultConfig);

export const colors = {
  background: '#F7F4EF',
  surface: '#FFFFFF',
  surfaceSoft: '#FBF8F3',
  border: '#E7DED2',

  primary: '#0B1F33',
  primarySoft: '#123C69',
  primaryMuted: '#DDE8F3',

  accent: '#0E9F6E',
  accentSoft: '#E8F7F0',

  gold: '#C8953C',
  goldSoft: '#FFF4DF',

  danger: '#DC2626',
  dangerSoft: '#FDECEC',

  warning: '#F59E0B',
  warningSoft: '#FFF7E6',

  textPrimary: '#17202A',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  textOnPrimary: '#FFFFFF',
} as const;

export const typography = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}
