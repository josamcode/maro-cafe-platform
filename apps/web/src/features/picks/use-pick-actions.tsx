'use client';
import { useState } from 'react';
import type { Locale } from '../../lib/locale';
import { getMenuItem } from '../menu/catalog';
import { usePicks } from './use-picks';
import { picksMessages } from './messages';

export function usePickActions(locale: Locale) {
  const picks = usePicks();
  const [announcement, setAnnouncement] = useState({ item: '', revision: 0 });
  function add(itemId: string, variant: string) {
    const success = picks.add(itemId, variant);
    if (success)
      setAnnouncement((previous) => ({
        item: getMenuItem(itemId)!.item.name[locale],
        revision: previous.revision + 1,
      }));
    return success;
  }
  return {
    picks,
    add,
    announcement: (
      <span className="picks-announcement" role="status">
        <span key={announcement.revision}>
          {announcement.item && `${picksMessages[locale].added} — ${announcement.item}`}
        </span>
      </span>
    ),
  };
}
