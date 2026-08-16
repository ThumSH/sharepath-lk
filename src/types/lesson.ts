export type Lesson = {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  description: string;
  content?: string;
  keyPoints: string[];
  remember: string;
  sortOrder?: number;
};

export type LessonDbRow = {
  id: string;
  title: string;
  category: string;
  reading_time: string | null;
  description: string | null;
  content: string | null;
  key_points: string[] | null;
  remember: string | null;
  sort_order: number | null;
};
