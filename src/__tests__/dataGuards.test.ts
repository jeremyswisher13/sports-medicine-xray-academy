import { describe, expect, it } from 'vitest';
import { getImage, imageRegistry } from '../data/images';
import { schematicContent } from '../components/XRayImage';
import { getPostCheck, getPreCheck } from '../data/moduleChecks';
import { moduleContents } from '../data/modules';
import { moduleSummaries } from '../data/moduleSummaries';
import { postCourseQuiz, preCourseQuiz } from '../data/quizzes';
import { videoQuestions } from '../data/videoQuestions';
import { videoResources } from '../data/videoResources';
import { flashcards } from '../data/flashcards';
import { hasCourseAssessment } from '../utils/progress';
import { nextDueAt } from '../utils/flashcardSchedule';
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

  it('gives every diagram a curated teaching-card schematic (no generic fallback)', () => {
    const diagramIds = Object.values(imageRegistry)
      .filter((img) => img.isDiagram)
      .map((img) => img.id);
    expect(diagramIds.length).toBeGreaterThan(0);
    for (const id of diagramIds) {
      // Without an entry here, XRayImage's TeachingSchematic renders a generic
      // fallback (view / moduleId / source) instead of real teaching content.
      expect(schematicContent[id], `missing schematicContent for diagram '${id}'`).toBeDefined();
    }
  });
});

describe('flashcard schedule', () => {
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
