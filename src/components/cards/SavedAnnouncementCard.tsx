import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { AnnouncementCard } from '@/components/cards/AnnouncementCard';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/lib/routes';
import { getSavedAnnouncements, removeSavedAnnouncement, saveAnnouncement } from '@/services/userDataService';
import type { OfficialUpdate } from '@/types/market';

type SavedAnnouncementCardProps = {
  update: OfficialUpdate;
};

function canSaveUpdate(id?: string) {
  return Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id));
}

export function SavedAnnouncementCard({ update }: SavedAnnouncementCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const updateCanBeSaved = canSaveUpdate(update.id);

  useEffect(() => {
    let isMounted = true;

    if (!user || !update.id || !updateCanBeSaved) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setIsSaved(false);
        }
      });
      return;
    }

    getSavedAnnouncements(user.id).then((result) => {
      if (isMounted) {
        setIsSaved(result.data.some((item) => item.announcementId === update.id));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [update.id, updateCanBeSaved, user]);

  async function toggleSavedUpdate() {
    setMessage(null);

    if (!isAuthenticated || !user) {
      setMessage('Sign in to save this for later.');
      router.push(routes.login);
      return;
    }

    if (!update.id || !updateCanBeSaved) {
      setMessage('This sample update can be saved after Supabase update data loads.');
      return;
    }

    setIsSaving(true);
    const result = isSaved
      ? await removeSavedAnnouncement(user.id, update.id)
      : await saveAnnouncement(user.id, update.id);

    if (result.errorMessage) {
      setMessage(result.errorMessage);
    } else {
      setIsSaved(!isSaved);
      setMessage(isSaved ? 'Removed from saved items.' : 'Saved for later.');
    }

    setIsSaving(false);
  }

  return (
    <AnnouncementCard
      title={update.title}
      summary={update.summary}
      actionLabel={isSaving ? 'Saving update...' : isSaved ? 'Remove Saved Update' : 'Save Update'}
      onAction={toggleSavedUpdate}
      isActionDisabled={isSaving}
      helperText={message}
    />
  );
}
