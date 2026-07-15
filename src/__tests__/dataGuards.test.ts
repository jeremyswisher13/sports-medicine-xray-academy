import { describe, expect, it } from 'vitest';
import { getImage, imageRegistry } from '../data/images';
import { getPostCheck, getPreCheck } from '../data/moduleChecks';
import { moduleContents } from '../data/modules';
import { moduleSummaries } from '../data/moduleSummaries';
import { postCourseQuiz, preCourseQuiz } from '../data/quizzes';
import { videoQuestions } from '../data/videoQuestions';
import { videoResources } from '../data/videoResources';
import { flashcards } from '../data/flashcards';
import { moduleTrainers } from '../data/anatomyTrainer';
import { quickChecks } from '../data/quickChecks';
import { hasCourseAssessment } from '../utils/progress';
import {
  FLASHCARD_STORAGE_KEY,
  dueFlashcardCount,
  flashcardStorageKey,
  nextDueAt,
} from '../utils/flashcardSchedule';
import type { ConfidenceRating, QuizQuestionData } from '../types';

const moduleIdSet = new Set(moduleSummaries.map((m) => m.id));

function expectValidQuestion(question: QuizQuestionData) {
  const optionIds = new Set(question.options.map((option) => option.id));
  expect(optionIds.has(question.correctOptionId), question.id).toBe(true);
}

describe('curriculum data guards', () => {
  it('resolves every module case image key', () => {
    const imageKeys = moduleContents.flatMap((module) =>
      module.cases.flatMap((caseItem) =>
        (caseItem.imagePanels ?? [])
          .map((panel) => panel.imageKey)
          .filter((key): key is string => Boolean(key)),
      ),
    );

    expect(imageKeys.length).toBeGreaterThan(0);
    for (const key of imageKeys) {
      expect(getImage(key), key).toBeDefined();
    }
  });

  it('keeps every active module learner-ready', () => {
    for (const module of moduleContents) {
      expect(module.status, module.id).toBe('full');
      expect(module.views.length, module.id).toBeGreaterThan(0);
      expect(module.anatomy.length, module.id).toBeGreaterThan(0);
      expect(module.pathology.length, module.id).toBeGreaterThan(0);
      expect(module.cases.length, module.id).toBeGreaterThan(0);
      expect(module.quiz.length, module.id).toBeGreaterThan(0);
      expect(module.keyTakeaways.length, module.id).toBeGreaterThan(0);
    }
  });

  it('authors every case question and acceptable management pathway explicitly', () => {
    const validQuestionTypes = new Set([
      'diagnosis',
      'management',
      'associated-injury',
      'interpretation',
    ]);
    const validManagementChoices = new Set([
      'symptomatic-follow-up',
      'immobilize-protect',
      'advanced-imaging',
      'urgent-referral',
    ]);
    for (const caseItem of moduleContents.flatMap((module) => module.cases)) {
      expect(validQuestionTypes.has(caseItem.questionType), caseItem.id).toBe(true);
      expect(caseItem.recommendedManagementChoiceIds.length, caseItem.id).toBeGreaterThan(0);
      for (const choiceId of caseItem.recommendedManagementChoiceIds) {
        expect(validManagementChoices.has(choiceId), `${caseItem.id}:${choiceId}`).toBe(true);
      }
    }
  });

  it('returns three-question pre and post checks for every module', () => {
    for (const module of moduleContents) {
      expect(getPreCheck(module).length, `${module.id} pre`).toBe(3);
      expect(getPostCheck(module).length, `${module.id} post`).toBe(3);
    }
  });

  it('keeps all quiz correctOptionId values inside their option lists', () => {
    const questions = [
      ...preCourseQuiz,
      ...postCourseQuiz,
      ...moduleContents.flatMap((module) => [
        ...module.quiz,
        ...getPreCheck(module),
        ...getPostCheck(module),
      ]),
      ...Object.values(videoQuestions).flat(),
    ];

    expect(questions.length).toBeGreaterThan(0);
    questions.forEach(expectValidQuestion);
  });

  it('requires both quiz completion and all confidence domains for course assessment', () => {
    const quiz = {
      id: 'attempt-1',
      userId: 'learner',
      scope: 'pre' as const,
      startedAt: 1,
      submittedAt: 2,
      answers: [],
      scorePercent: 100,
    };
    const partialConfidence: ConfidenceRating[] = [
      {
        id: 'confidence-1',
        userId: 'learner',
        scope: 'pre',
        domain: 'systematic',
        value: 4,
        createdAt: 3,
      },
    ];
    const completeConfidence: ConfidenceRating[] = [
      'systematic',
      'views',
      'do-not-miss',
      'occult',
      'pediatric',
      'escalation',
    ].map((domain, index) => ({
      id: `confidence-${domain}`,
      userId: 'learner',
      scope: 'pre' as const,
      domain,
      value: 4 as const,
      createdAt: index + 3,
    }));

    expect(hasCourseAssessment([quiz], partialConfidence, 'pre')).toBe(false);
    expect(hasCourseAssessment([quiz], completeConfidence, 'pre')).toBe(true);
    expect(hasCourseAssessment([], completeConfidence, 'pre')).toBe(false);
  });

  it('maps every video resource to a known module', () => {
    expect(videoResources.length).toBeGreaterThan(0);
    for (const video of videoResources) {
      expect(moduleIdSet.has(video.moduleId), video.id).toBe(true);
    }
  });

  it('maps every flashcard to a known module', () => {
    expect(flashcards.length).toBeGreaterThan(0);
    for (const card of flashcards) {
      expect(moduleIdSet.has(card.moduleId), card.id).toBe(true);
    }
  });

  it('keeps every anatomy-trainer marker on a real image with a valid answer', () => {
    const entries = Object.entries(moduleTrainers);
    expect(entries.length).toBeGreaterThan(0);
    for (const [moduleId, data] of entries) {
      expect(moduleIdSet.has(moduleId), moduleId).toBe(true);
      expect(data.tour.length, `${moduleId} tour`).toBeGreaterThan(0);
      expect(data.check.length, `${moduleId} check`).toBeGreaterThan(0);
      for (const step of data.tour) {
        expect(getImage(step.imageKey), `${moduleId} tour image ${step.imageKey}`).toBeDefined();
        for (const marker of step.markers) {
          expect(marker.x, `${moduleId}:${step.title} x`).toBeGreaterThanOrEqual(0);
          expect(marker.x, `${moduleId}:${step.title} x`).toBeLessThanOrEqual(100);
          expect(marker.y, `${moduleId}:${step.title} y`).toBeGreaterThanOrEqual(0);
          expect(marker.y, `${moduleId}:${step.title} y`).toBeLessThanOrEqual(100);
        }
      }
      for (const q of data.check) {
        expect(getImage(q.imageKey), `${moduleId} check image ${q.imageKey}`).toBeDefined();
        expect(q.marker.x, `${q.id} x`).toBeGreaterThanOrEqual(0);
        expect(q.marker.x, `${q.id} x`).toBeLessThanOrEqual(100);
        expect(q.marker.y, `${q.id} y`).toBeGreaterThanOrEqual(0);
        expect(q.marker.y, `${q.id} y`).toBeLessThanOrEqual(100);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(q.options.length);
      }
    }
  });

  it('keeps high-risk tour and check markers on their verified targets', () => {
    const expected = [
      ['elbow', 'Olecranon', 'elbow-ck-4', 73, 82],
      ['elbow', 'Coronoid process', 'elbow-ck-5', 54, 74],
      ['pelvis-hip', 'Lesser trochanter', 'pelvis-hip-ck-3', 46, 49],
      ['pelvis-hip', 'Femoral neck', 'pelvis-hip-ck-5', 38, 39],
      ['knee', 'Trochlear groove (sulcus)', 'knee-ck-8', 53, 76],
      [
        'do-not-miss',
        'Lisfranc injury — tarsometatarsal diastasis',
        'dnm-ck-5',
        50,
        65,
      ],
      [
        'do-not-miss',
        'Jones fracture — 5th metatarsal metaphyseal-diaphyseal junction',
        'dnm-ck-8',
        19,
        72,
      ],
    ] as const;

    for (const [moduleId, title, checkId, x, y] of expected) {
      const trainer = moduleTrainers[moduleId];
      const tourMarker = trainer.tour.find((step) => step.title === title)?.markers[0];
      const checkMarker = trainer.check.find((check) => check.id === checkId)?.marker;
      expect(tourMarker, `${moduleId}:${title}`).toEqual(expect.objectContaining({ x, y }));
      expect(checkMarker, checkId).toEqual({ x, y });
    }
  });

  it('keeps every inline quick-check well-formed (4 options, valid answer, unique id)', () => {
    const seenIds = new Set<string>();
    for (const [moduleId, questions] of Object.entries(quickChecks)) {
      expect(moduleIdSet.has(moduleId), moduleId).toBe(true);
      for (const q of questions) {
        expect(q.options.length, q.id).toBe(4);
        expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
        expect(q.answer, q.id).toBeLessThan(q.options.length);
        expect(q.question.length, q.id).toBeGreaterThan(0);
        expect(q.explanation.length, q.id).toBeGreaterThan(0);
        expect(seenIds.has(q.id), `duplicate quick-check id ${q.id}`).toBe(false);
        seenIds.add(q.id);
      }
    }
  });

  it('maps every teaching diagram to its real SVG asset', () => {
    const diagrams = Object.values(imageRegistry).filter((image) => image.isDiagram);
    expect(diagrams.length).toBeGreaterThan(0);
    for (const diagram of diagrams) {
      expect(diagram.src, diagram.id).toMatch(/^\/diagrams\/.+\.svg$/);
      expect(diagram.alt.trim().length, diagram.id).toBeGreaterThan(0);
    }
  });
});

describe('flashcard schedule', () => {
  it('counts never-reviewed cards as due', () => {
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
      globalThis.localStorage.removeItem(FLASHCARD_STORAGE_KEY);
      globalThis.localStorage.removeItem(flashcardStorageKey('learner-1'));
      expect(dueFlashcardCount(['card-1', 'card-2'], 'learner-1')).toBe(2);
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('schedules "got it" further out than "review"', () => {
    const now = 1_000_000_000_000;
    const gotIt = nextDueAt('got-it', now);
    const review = nextDueAt('review', now);
    // got-it ≈ +72h, review ≈ +20h
    expect(gotIt - now).toBe(72 * 60 * 60 * 1000);
    expect(review - now).toBe(20 * 60 * 60 * 1000);
    expect(gotIt).toBeGreaterThan(review);
  });
});
