import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

const canUseRuntimeStorage = typeof window !== 'undefined';

const supabaseAuthStorage = {
  getItem: (key: string) => {
    if (!canUseRuntimeStorage) {
      return Promise.resolve(null);
    }

    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (!canUseRuntimeStorage) {
      return Promise.resolve();
    }

    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (!canUseRuntimeStorage) {
      return Promise.resolve();
    }

    return AsyncStorage.removeItem(key);
  },
};

if (!isSupabaseConfigured) {
  console.warn(
    'Missing Supabase environment variables. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
  );
}

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          storage: supabaseAuthStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
