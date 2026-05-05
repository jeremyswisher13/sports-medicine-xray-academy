export const FLASHCARD_STORAGE_KEY = 'sxra:flashcards-state';

export interface PersistedFlashcardState {
  reviewedIds: string[];
  needsReviewIds: string[];
  dueById: Record<string, number>;
}

export function createEmptyFlashcardState(): PersistedFlashcardState {
  return { reviewedIds: [], needsReviewIds: [], dueById: {} };
}

export function loadFlashcardState(): PersistedFlashcardState {
  try {
    const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
    if (!raw) return createEmptyFlashcardState();
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

export function saveFlashcardState(state: PersistedFlashcardState): void {
  try {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local flashcard practice still works for the current session if storage is unavailable.
  }
}

export function dueFlashcardCount(cardIds: string[], now = Date.now()): number {
  const state = loadFlashcardState();
  return cardIds.filter((id) => (state.dueById[id] ?? Number.POSITIVE_INFINITY) <= now).length;
}

export function nextDueAt(outcome: 'got-it' | 'review', now = Date.now()): number {
  const hours = outcome === 'got-it' ? 72 : 20;
  return now + hours * 60 * 60 * 1000;
}
