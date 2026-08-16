import { supabase } from '@/lib/supabase';
import type { SavedAnnouncement, SavedLesson, WatchlistItem } from '@/types/auth';

type UserDataResult<T> = {
  data: T;
  errorMessage: string | null;
};

function logUserDataError(label: string, error: unknown) {
  if (__DEV__) {
    console.warn(label, error);
  }
}

function unavailable<T>(data: T): UserDataResult<T> {
  return { data, errorMessage: 'Account features are unavailable until Supabase is configured.' };
}

function mapWatchlistItem(row: Record<string, unknown>): WatchlistItem {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    companySymbol: String(row.company_symbol),
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

function mapSavedLesson(row: Record<string, unknown>): SavedLesson {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    lessonId: String(row.lesson_id),
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

function mapSavedAnnouncement(row: Record<string, unknown>): SavedAnnouncement {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    announcementId: String(row.announcement_id),
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

export async function getWatchlist(userId: string): Promise<UserDataResult<WatchlistItem[]>> {
  if (!supabase || !userId) {
    return unavailable([]);
  }

  const { data, error } = await supabase
    .from('watchlist_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logUserDataError('Could not load watchlist.', error);
    return { data: [], errorMessage: 'Could not load your watchlist right now.' };
  }

  return { data: (data ?? []).map((row) => mapWatchlistItem(row)), errorMessage: null };
}

export async function isCompanyInWatchlist(userId: string, symbol: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !symbol) {
    return unavailable(false);
  }

  const { data, error } = await supabase
    .from('watchlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('company_symbol', symbol)
    .maybeSingle();

  if (error) {
    logUserDataError('Could not check watchlist item.', error);
    return { data: false, errorMessage: 'Could not check this item right now.' };
  }

  return { data: Boolean(data), errorMessage: null };
}

export async function addCompanyToWatchlist(userId: string, symbol: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !symbol) {
    return unavailable(false);
  }

  const { error } = await supabase
    .from('watchlist_items')
    .upsert({ user_id: userId, company_symbol: symbol }, { onConflict: 'user_id,company_symbol' });

  if (error) {
    logUserDataError('Could not add company to watchlist.', error);
    return { data: false, errorMessage: 'Could not save this company right now. Please try again.' };
  }

  return { data: true, errorMessage: null };
}

export async function removeCompanyFromWatchlist(userId: string, symbol: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !symbol) {
    return unavailable(false);
  }

  const { error } = await supabase
    .from('watchlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('company_symbol', symbol);

  if (error) {
    logUserDataError('Could not remove company from watchlist.', error);
    return { data: false, errorMessage: 'Could not update your watchlist right now.' };
  }

  return { data: true, errorMessage: null };
}

export async function getSavedLessons(userId: string): Promise<UserDataResult<SavedLesson[]>> {
  if (!supabase || !userId) {
    return unavailable([]);
  }

  const { data, error } = await supabase
    .from('saved_lessons')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logUserDataError('Could not load saved lessons.', error);
    return { data: [], errorMessage: 'Could not load saved lessons right now.' };
  }

  return { data: (data ?? []).map((row) => mapSavedLesson(row)), errorMessage: null };
}

export async function isLessonSaved(userId: string, lessonId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !lessonId) {
    return unavailable(false);
  }

  const { data, error } = await supabase
    .from('saved_lessons')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (error) {
    logUserDataError('Could not check saved lesson.', error);
    return { data: false, errorMessage: 'Could not check this lesson right now.' };
  }

  return { data: Boolean(data), errorMessage: null };
}

export async function saveLesson(userId: string, lessonId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !lessonId) {
    return unavailable(false);
  }

  const { error } = await supabase
    .from('saved_lessons')
    .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });

  if (error) {
    logUserDataError('Could not save lesson.', error);
    return { data: false, errorMessage: 'Could not save this lesson right now. Please try again.' };
  }

  return { data: true, errorMessage: null };
}

export async function removeSavedLesson(userId: string, lessonId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !lessonId) {
    return unavailable(false);
  }

  const { error } = await supabase.from('saved_lessons').delete().eq('user_id', userId).eq('lesson_id', lessonId);

  if (error) {
    logUserDataError('Could not remove saved lesson.', error);
    return { data: false, errorMessage: 'Could not update saved lessons right now.' };
  }

  return { data: true, errorMessage: null };
}

export async function getSavedAnnouncements(userId: string): Promise<UserDataResult<SavedAnnouncement[]>> {
  if (!supabase || !userId) {
    return unavailable([]);
  }

  const { data, error } = await supabase
    .from('saved_announcements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logUserDataError('Could not load saved updates.', error);
    return { data: [], errorMessage: 'Could not load saved updates right now.' };
  }

  return { data: (data ?? []).map((row) => mapSavedAnnouncement(row)), errorMessage: null };
}

export async function saveAnnouncement(userId: string, announcementId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !announcementId) {
    return unavailable(false);
  }

  const { error } = await supabase
    .from('saved_announcements')
    .upsert({ user_id: userId, announcement_id: announcementId }, { onConflict: 'user_id,announcement_id' });

  if (error) {
    logUserDataError('Could not save update.', error);
    return { data: false, errorMessage: 'Could not save this update right now. Please try again.' };
  }

  return { data: true, errorMessage: null };
}

export async function removeSavedAnnouncement(userId: string, announcementId: string): Promise<UserDataResult<boolean>> {
  if (!supabase || !userId || !announcementId) {
    return unavailable(false);
  }

  const { error } = await supabase
    .from('saved_announcements')
    .delete()
    .eq('user_id', userId)
    .eq('announcement_id', announcementId);

  if (error) {
    logUserDataError('Could not remove saved update.', error);
    return { data: false, errorMessage: 'Could not update saved updates right now.' };
  }

  return { data: true, errorMessage: null };
}
