import { confidenceDomains } from '../data/quizzes';
import type { ConfidenceRating, QuizAttempt } from '../types';

const previewAssessmentPrefix = 'sports-xray:learner-preview:course-assessment';

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

export function hasPreviewCourseAssessment(scope: 'pre' | 'post'): boolean {
  try {
    return localStorage.getItem(`${previewAssessmentPrefix}:${scope}`) === 'true';
  } catch {
    return false;
  }
}

export function markPreviewCourseAssessment(scope: 'pre' | 'post'): void {
  try {
    localStorage.setItem(`${previewAssessmentPrefix}:${scope}`, 'true');
  } catch {
    // Preview still works for the current route even when localStorage is unavailable.
  }
}

export function clearPreviewCourseAssessments(): void {
  try {
    localStorage.removeItem(`${previewAssessmentPrefix}:pre`);
    localStorage.removeItem(`${previewAssessmentPrefix}:post`);
  } catch {
    // Ignore storage cleanup failures.
  }
}
