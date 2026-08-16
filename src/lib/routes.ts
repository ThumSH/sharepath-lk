import type { Href } from 'expo-router';

export const routes = {
  welcome: '/onboarding/welcome' as Href,
  knowledgeLevel: '/onboarding/knowledge-level' as Href,
  learningGoal: '/onboarding/learning-goal' as Href,
  disclaimer: '/onboarding/disclaimer' as Href,
  home: '/(tabs)/home' as Href,
  companies: '/(tabs)/companies' as Href,
  learn: '/(tabs)/learn' as Href,
  saved: '/(tabs)/saved' as Href,
  login: '/auth/login' as Href,
  register: '/auth/register' as Href,
  account: '/account' as Href,
  company: (symbol: string) => ({ pathname: '/company/[symbol]', params: { symbol } }) as unknown as Href,
  lesson: (id: string) => ({ pathname: '/lesson/[id]', params: { id } }) as unknown as Href,
};
