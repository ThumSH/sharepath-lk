export type UserProfile = {
  id: string;
  email: string | null;
  displayName: string | null;
  knowledgeLevel: string | null;
  learningGoal: string | null;
  hasCompletedOnboarding: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthUser = {
  id: string;
  email?: string;
};

export type ProfileInput = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  knowledgeLevel?: string | null;
  learningGoal?: string | null;
  hasCompletedOnboarding?: boolean;
};

export type UserProfileDbRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  knowledge_level: string | null;
  learning_goal: string | null;
  has_completed_onboarding: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type WatchlistItem = {
  id: string;
  userId: string;
  companySymbol: string;
  createdAt?: string;
};

export type SavedLesson = {
  id: string;
  userId: string;
  lessonId: string;
  createdAt?: string;
};

export type SavedAnnouncement = {
  id: string;
  userId: string;
  announcementId: string;
  createdAt?: string;
};
