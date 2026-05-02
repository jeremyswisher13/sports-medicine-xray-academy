import { confidenceDomains } from '../data/quizzes';
import type { ConfidenceRating, QuizAttempt } from '../types';

export function hasCompleteCourseConfidence(
  confidence: ConfidenceRating[],
  scope: 'pre' | 'post',
): boolean {
  const ratedDomains = new Set(
    confidence
      .filter((rating) => rating.scope === scope && rating.domain)
      .map((rating) => rating.domain),
  );
  return confidenceDomains.every((domain) => ratedDomains.has(domain.id));
}

export function hasCourseAssessment(
  quizzes: QuizAttempt[],
  confidence: ConfidenceRating[],
  scope: 'pre' | 'post',
): boolean {
  return (
    quizzes.some((quiz) => quiz.scope === scope) &&
    hasCompleteCourseConfidence(confidence, scope)
  );
}
