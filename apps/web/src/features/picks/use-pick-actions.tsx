'use client';
import { trackIntent } from '../insights/track';
import { useState } from 'react';
import type { Locale } from '../../lib/locale';
import { getMenuItem } from '../menu/catalog';
import { usePicks } from './use-picks';
import { useCatalog } from '../catalog/catalog-provider';
import { picksMessages } from './messages';

export function usePickActions(locale: Locale) {
  const picks = usePicks();
  const { catalog } = useCatalog();
  const [announcement, setAnnouncement] = useState({ item: '', revision: 0 });
  function add(itemId: string, variant: string) {
    const success = picks.add(itemId, variant);
    if (success)
      setAnnouncement((previous) => ({
        item: getMenuItem(catalog, itemId)!.item.name[locale],
        revision: previous.revision + 1,
      }));
    if (success) trackIntent({ kind: 'pick_add', productId: itemId });
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
