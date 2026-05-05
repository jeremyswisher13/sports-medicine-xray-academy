import { describe, expect, it } from 'vitest';
import { getImage } from '../data/images';
import { getPostCheck, getPreCheck } from '../data/moduleChecks';
import { moduleContents } from '../data/modules';
import { postCourseQuiz, preCourseQuiz } from '../data/quizzes';
import { videoQuestions } from '../data/videoQuestions';
import { hasCourseAssessment } from '../utils/progress';
import type { ConfidenceRating, QuizQuestionData } from '../types';

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
});
