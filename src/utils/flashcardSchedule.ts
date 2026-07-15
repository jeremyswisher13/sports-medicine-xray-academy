export const FLASHCARD_STORAGE_KEY = 'sxra:flashcards-state';

export function flashcardStorageKey(userId: string): string {
  return `${FLASHCARD_STORAGE_KEY}:${userId}`;
}

export interface PersistedFlashcardState {
  reviewedIds: string[];
  needsReviewIds: string[];
  dueById: Record<string, number>;
}

export function createEmptyFlashcardState(): PersistedFlashcardState {
  return { reviewedIds: [], needsReviewIds: [], dueById: {} };
}

function parseFlashcardState(raw: string | null): PersistedFlashcardState {
  if (!raw) return createEmptyFlashcardState();
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedFlashcardState>;
    return {
      reviewedIds: Array.isArray(parsed.reviewedIds) ? parsed.reviewedIds : [],
      needsReviewIds: Array.isArray(parsed.needsReviewIds) ? parsed.needsReviewIds : [],
      dueById:
        parsed.dueById && typeof parsed.dueById === 'object' && !Array.isArray(parsed.dueById)
          ? parsed.dueById
          : {},
    };
  } catch {
    return createEmptyFlashcardState();
  }
}

export function loadFlashcardState(userId: string): PersistedFlashcardState {
  try {
    const scopedKey = flashcardStorageKey(userId);
    const scoped = localStorage.getItem(scopedKey);
    if (scoped) return parseFlashcardState(scoped);

    const legacy = localStorage.getItem(FLASHCARD_STORAGE_KEY);
    if (!legacy) return createEmptyFlashcardState();
    const migrated = parseFlashcardState(legacy);
    localStorage.setItem(scopedKey, JSON.stringify(migrated));
    localStorage.removeItem(FLASHCARD_STORAGE_KEY);
    return migrated;
  } catch {
    return createEmptyFlashcardState();
  }
}

export function saveFlashcardState(
  userId: string,
  state: PersistedFlashcardState,
): void {
  try {
    localStorage.setItem(flashcardStorageKey(userId), JSON.stringify(state));
  } catch {
    // Local flashcard practice still works for the current session if storage is unavailable.
  }
}

export function dueFlashcardCount(
  cardIds: string[],
  userId: string,
  now = Date.now(),
): number {
  const state = loadFlashcardState(userId);
  return cardIds.filter((id) => (state.dueById[id] ?? 0) <= now).length;
}

export function nextDueAt(outcome: 'got-it' | 'review', now = Date.now()): number {
  const hours = outcome === 'got-it' ? 72 : 20;
  return now + hours * 60 * 60 * 1000;
}
