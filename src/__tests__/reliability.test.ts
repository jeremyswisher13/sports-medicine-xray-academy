import { describe, expect, it } from 'vitest';
import {
  firstAssessmentAttempts,
  firstConfidenceAverage,
  firstQuizAttempt,
  latestCaseAttempts,
} from '../utils/assessment';
import { applyAtlasPracticeOutcome } from '../utils/atlasPractice';
import { escapeCsvCell, rowsToCsv } from '../utils/csv';
import {
  FLASHCARD_STORAGE_KEY,
  dueFlashcardCount,
  flashcardStorageKey,
  loadFlashcardState,
} from '../utils/flashcardSchedule';
import {
  applyModuleCheckpoint,
  applyModuleVisit,
  mergeModuleProgress,
  mergeRecordsByKey,
} from '../utils/offline';
import { normalizeTimestampFields, toMillis } from '../utils/timestamp';
import { requestedPathFromState, safeAppPath } from '../utils/navigation';
import type { CaseAttempt, ConfidenceRating, QuizAttempt } from '../types';

function withLocalStorage(run: (store: Map<string, string>) => void) {
  const originalLocalStorage = globalThis.localStorage;
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    },
  });
  try {
    run(store);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: originalLocalStorage,
    });
  }
}

describe('timestamp normalization', () => {
  it('normalizes Firestore-like timestamps without changing other fields', () => {
    const timestamp = { toMillis: () => 42_000 };
    expect(toMillis(timestamp)).toBe(42_000);
    expect(toMillis(new Date(1234))).toBe(1234);
    expect(toMillis('bad', 9)).toBe(9);
    expect(
      normalizeTimestampFields(
        { id: 'record', createdAt: timestamp, optionalAt: undefined },
        ['createdAt', 'optionalAt'],
      ),
    ).toEqual({ id: 'record', createdAt: 42_000, optionalAt: undefined });
  });
});

describe('assessment semantics', () => {
  it('preserves first assessments while keeping the latest case retry', () => {
    const quizzes: QuizAttempt[] = [
      { id: 'old', userId: 'u', scope: 'pre', startedAt: 1, submittedAt: 2, answers: [], scorePercent: 20 },
      { id: 'new', userId: 'u', scope: 'pre', startedAt: 3, submittedAt: 4, answers: [], scorePercent: 80 },
    ];
    const confidence: ConfidenceRating[] = [
      { id: 'a-old', userId: 'u', scope: 'pre', domain: 'views', value: 1, createdAt: 1 },
      { id: 'a-new', userId: 'u', scope: 'pre', domain: 'views', value: 5, createdAt: 3 },
      { id: 'b', userId: 'u', scope: 'pre', domain: 'occult', value: 3, createdAt: 2 },
    ];
    const cases: CaseAttempt[] = [
      { id: 'case-old', userId: 'u', caseId: 'c1', moduleId: 'm', selectedOptionId: 'a', correct: false, checklistChecked: [], submittedAt: 1 },
      { id: 'case-new', userId: 'u', caseId: 'c1', moduleId: 'm', selectedOptionId: 'b', correct: true, checklistChecked: [], submittedAt: 2 },
    ];

    expect(firstQuizAttempt(quizzes, 'pre')?.id).toBe('old');
    expect(firstConfidenceAverage(confidence, 'pre')).toBe(2);
    expect(firstAssessmentAttempts(quizzes).map((attempt) => attempt.id)).toEqual(['old']);
    expect(latestCaseAttempts(cases)).toEqual([cases[1]]);
  });
});

describe('CSV export safety', () => {
  it('escapes delimiters and neutralizes spreadsheet formulas', () => {
    expect(escapeCsvCell('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"');
    expect(escapeCsvCell('last, first')).toBe('"last, first"');
    expect(rowsToCsv([['Name', 'Value'], ['Learner', '+1']])).toBe(
      "Name,Value\nLearner,'+1",
    );
  });
});

describe('offline merge', () => {
  it('keeps remote records and lets local pending records win by id', () => {
    const remote = [{ id: 'a', value: 1 }, { id: 'b', value: 2 }];
    const local = [{ id: 'b', value: 3 }, { id: 'c', value: 4 }];
    expect(mergeRecordsByKey(remote, local, (record) => record.id)).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 3 },
      { id: 'c', value: 4 },
    ]);
  });

  it('applies a visit without downgrading existing module completion', () => {
    const completed = {
      userId: 'u',
      moduleId: 'm',
      visited: true,
      completedTabs: ['read', 'practice'],
      completed: true,
      completedAt: 10,
      lastViewedAt: 10,
      postCheckScore: 90,
    };
    expect(
      applyModuleVisit(completed, {
        userId: 'u',
        moduleId: 'm',
        visited: true,
        lastViewedAt: 20,
      }),
    ).toEqual({ ...completed, lastViewedAt: 20 });
  });

  it('merges checkpoints without overwriting first pre/post outcomes', () => {
    const baseline = applyModuleCheckpoint(undefined, {
      userId: 'u',
      moduleId: 'm',
      visited: true,
      phaseId: 'learn',
      lastSectionId: 'read',
      lastViewedAt: 10,
    });
    const incoming = {
      ...baseline,
      completedTabs: ['quiz'],
      lastViewedAt: 20,
      preCheckAt: 20,
      preCheckScore: 100,
      preCheckConfidence: 5,
    };
    const existing = {
      ...baseline,
      preCheckAt: 10,
      preCheckScore: 0,
      preCheckConfidence: 2,
    };
    expect(mergeModuleProgress(existing, incoming)).toMatchObject({
      completedTabs: ['learn', 'quiz'],
      lastSectionId: 'read',
      preCheckAt: 10,
      preCheckScore: 0,
      preCheckConfidence: 2,
    });
  });
});

describe('atlas practice scoring', () => {
  it('records clue reveals separately without awarding correctness or streak', () => {
    expect(
      applyAtlasPracticeOutcome(
        { answered: 2, correct: 1, streak: 1, revealed: 0 },
        'revealed',
      ),
    ).toEqual({ answered: 2, correct: 1, streak: 1, revealed: 1 });
  });
});

describe('safe app navigation', () => {
  it('preserves protected deep links, queries, and hashes', () => {
    expect(safeAppPath('/modules/knee?source=pwa#practice')).toBe(
      '/modules/knee?source=pwa#practice',
    );
    expect(requestedPathFromState({ from: '/atlas?kind=normal' })).toBe(
      '/atlas?kind=normal',
    );
  });

  it('rejects external, auth-loop, and unknown destinations', () => {
    expect(safeAppPath('//example.com/steal')).toBeNull();
    expect(safeAppPath('https://example.com/steal')).toBeNull();
    expect(safeAppPath('/login')).toBeNull();
    expect(safeAppPath('/quiz/pre')).toBeNull();
    expect(safeAppPath('/not-a-route')).toBeNull();
  });
});

describe('user-scoped flashcard persistence', () => {
  it('keeps learners separate and migrates the legacy key once', () => {
    withLocalStorage((store) => {
      store.set(
        flashcardStorageKey('learner-a'),
        JSON.stringify({ reviewedIds: ['card-1'], needsReviewIds: [], dueById: { 'card-1': 999 } }),
      );
      expect(dueFlashcardCount(['card-1'], 'learner-a', 100)).toBe(0);
      expect(dueFlashcardCount(['card-1'], 'learner-b', 100)).toBe(1);

      store.set(
        FLASHCARD_STORAGE_KEY,
        JSON.stringify({ reviewedIds: ['legacy'], needsReviewIds: [], dueById: {} }),
      );
      expect(loadFlashcardState('learner-c').reviewedIds).toEqual(['legacy']);
      expect(store.has(FLASHCARD_STORAGE_KEY)).toBe(false);
      expect(store.has(flashcardStorageKey('learner-c'))).toBe(true);
    });
  });
});
