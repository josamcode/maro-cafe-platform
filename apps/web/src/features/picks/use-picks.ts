'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { useCatalog } from '../catalog/catalog-provider';
import { toMenuCategories } from '../menu/catalog';
import {
  makePick,
  MAX_PICK_QUANTITY,
  pickKey,
  readPicks,
  resolvePick,
  type SavedPick,
} from './model';

export const PICKS_STORAGE_KEY = 'maro:picks:v1';
let memory: string | null = null;
let memoryOnly = false;
const listeners = new Set<() => void>();
const serverSnapshot = () => undefined;

function snapshot() {
  if (memoryOnly) return memory;
  try {
    return window.localStorage.getItem(PICKS_STORAGE_KEY);
  } catch {
    memoryOnly = true;
    return memory;
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (!memoryOnly && (event.key === PICKS_STORAGE_KEY || event.key === null)) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}
function save(items: SavedPick[]) {
  memory = JSON.stringify({ version: 1, items });
  if (!memoryOnly) {
    try {
      window.localStorage.setItem(PICKS_STORAGE_KEY, memory);
    } catch {
      memoryOnly = true;
    }
  }
  listeners.forEach((listener) => listener());
}

export function usePicks() {
  const { catalog, data, available } = useCatalog();
  const all = useMemo(() => toMenuCategories(data), [data]);
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const saved = useMemo(() => readPicks(raw, all), [raw, all]);
  const lines = saved.map((pick) => resolvePick(pick, catalog)).filter((line) => line !== null);
  return {
    ready: raw !== undefined && available,
    unavailableCount: saved.length - lines.length,
    persistent: !memoryOnly,
    lines,
    count: lines.reduce((count, line) => count + line.quantity, 0),
    total: lines.reduce((total, line) => total + line.total, 0),
    add(itemId: string, variant: string) {
      if (!available) return false;
      const pick = makePick(itemId, variant, catalog);
      if (!pick) return false;
      const current = readPicks(snapshot(), all);
      const existing = current.find((line) => pickKey(line) === pickKey(pick));
      if (existing && existing.quantity >= MAX_PICK_QUANTITY) return false;
      if (existing) existing.quantity += 1;
      else current.push(pick);
      save(current);
      return true;
    },
    setQuantity(key: string, quantity: number) {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PICK_QUANTITY) return;
      save(
        readPicks(snapshot(), all).map((line) =>
          pickKey(line) === key ? { ...line, quantity } : line,
        ),
      );
    },
    remove(key: string) {
      save(readPicks(snapshot(), all).filter((line) => pickKey(line) !== key));
    },
  };
}
export type PicksState = ReturnType<typeof usePicks>;
