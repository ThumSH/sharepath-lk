export type LessonProgress = {
  id: string;
  userId: string;
  lessonId: string;
  lastViewedAt: string;
  completedAt?: string | null;
};

export type LessonProgressDbRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  last_viewed_at: string;
  completed_at: string | null;
};
