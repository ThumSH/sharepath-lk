import { glossaryTerms } from '@/data/glossary';
import { lessons as fallbackLessons } from '@/data/lessons';
import { mapGlossaryTermFromDb, mapLessonProgressFromDb } from '@/lib/mappers';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { DataResult } from '@/services/sharepathData';
import { getLessons } from '@/services/sharepathData';
import type { GlossaryTerm, GlossaryTermDbRow } from '@/types/glossary';
import type { Lesson } from '@/types/lesson';
import type { LessonProgress, LessonProgressDbRow } from '@/types/progress';

type UserDataResult<T> = {
  data: T;
  errorMessage: string | null;
};

function warnFallback(label: string, error?: unknown) {
  if (__DEV__) {
    console.warn(`Using learning fallback for ${label}.`, error);
  }
}

function withFallback<T>(label: string, data: T, error?: unknown): DataResult<T> {
  warnFallback(label, error);
  return { data, isFallback: true };
}

function starterLesson(lessons: Lesson[]) {
  return lessons.find((lesson) => lesson.category === 'Start Here') ?? lessons[0];
}

export async function getGlossaryTerms(): Promise<DataResult<GlossaryTerm[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return withFallback('glossary terms', glossaryTerms);
  }

  try {
    const { data, error } = await supabase.from('glossary_terms').select('*').order('sort_order');

    if (error || !data) {
      return withFallback('glossary terms', glossaryTerms, error);
    }

    return { data: (data as GlossaryTermDbRow[]).map(mapGlossaryTermFromDb), isFallback: false };
  } catch (error) {
    return withFallback('glossary terms', glossaryTerms, error);
  }
}

export async function getGlossaryTermByTerm(term: string): Promise<DataResult<GlossaryTerm | undefined>> {
  const normalized = term.trim().toLowerCase();
  const fallback = glossaryTerms.find((item) => item.term.toLowerCase() === normalized);

  if (!isSupabaseConfigured || !supabase) {
    return withFallback('glossary term', fallback);
  }

  try {
    const { data, error } = await supabase.from('glossary_terms').select('*').ilike('term', term).maybeSingle();

    if (error || !data) {
      return withFallback('glossary term', fallback, error);
    }

    return { data: mapGlossaryTermFromDb(data as GlossaryTermDbRow), isFallback: false };
  } catch (error) {
    return withFallback('glossary term', fallback, error);
  }
}

export async function searchGlossaryTerms(query: string): Promise<DataResult<GlossaryTerm[]>> {
  const normalized = query.trim().toLowerCase();
  const allTerms = await getGlossaryTerms();

  if (!normalized) {
    return allTerms;
  }

  return {
    data: allTerms.data.filter((term) =>
      `${term.term} ${term.shortDefinition} ${term.category ?? ''}`.toLowerCase().includes(normalized)
    ),
    isFallback: allTerms.isFallback,
  };
}

export async function getUserLessonProgress(userId: string): Promise<UserDataResult<LessonProgress[]>> {
  if (!supabase || !userId) {
    return { data: [], errorMessage: null };
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false });

  if (error) {
    warnFallback('lesson progress', error);
    return { data: [], errorMessage: 'Lesson progress is unavailable right now.' };
  }

  return { data: (data ?? []).map((row) => mapLessonProgressFromDb(row as LessonProgressDbRow)), errorMessage: null };
}

export async function markLessonViewed(userId: string, lessonId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !lessonId) {
    return { data: false, errorMessage: null };
  }

  const { error } = await supabase.from('lesson_progress').upsert(
    { user_id: userId, lesson_id: lessonId, last_viewed_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { onConflict: 'user_id,lesson_id' }
  );

  if (error) {
    warnFallback('mark lesson viewed', error);
    return { data: false, errorMessage: 'Could not update lesson progress right now.' };
  }

  return { data: true, errorMessage: null };
}

export async function markLessonCompleted(userId: string, lessonId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !lessonId) {
    return { data: false, errorMessage: null };
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from('lesson_progress').upsert(
    { user_id: userId, lesson_id: lessonId, last_viewed_at: now, completed_at: now, updated_at: now },
    { onConflict: 'user_id,lesson_id' }
  );

  if (error) {
    warnFallback('mark lesson completed', error);
    return { data: false, errorMessage: 'Could not mark this lesson complete right now.' };
  }

  return { data: true, errorMessage: null };
}

export async function getContinueLearningLesson(userId?: string): Promise<DataResult<{ lesson: Lesson; hasProgress: boolean }>> {
  const lessonsResult = await getLessons();
  const allLessons = lessonsResult.data.length > 0 ? lessonsResult.data : fallbackLessons;
  const fallback = starterLesson(allLessons);

  if (!userId || !fallback) {
    return { data: { lesson: fallback ?? fallbackLessons[0], hasProgress: false }, isFallback: lessonsResult.isFallback };
  }

  const progress = await getUserLessonProgress(userId);
  const nextProgress = progress.data.find((item) => !item.completedAt) ?? progress.data[0];
  const lesson = allLessons.find((item) => item.id === nextProgress?.lessonId) ?? fallback;

  return { data: { lesson, hasProgress: Boolean(nextProgress) }, isFallback: lessonsResult.isFallback || Boolean(progress.errorMessage) };
}
