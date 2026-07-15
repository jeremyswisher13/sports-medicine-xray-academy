import type { CaseAttempt, ConfidenceRating, QuizAttempt } from '../types';

function quizTime(attempt: QuizAttempt): number {
  return attempt.submittedAt ?? attempt.startedAt;
}

const immutableAssessmentScopes = new Set<QuizAttempt['scope']>([
  'pre',
  'post',
  'module-pre',
  'module-post',
]);

export function firstAssessmentAttempts(attempts: QuizAttempt[]): QuizAttempt[] {
  const firstByAssessment = new Map<string, QuizAttempt>();
  const practiceAttempts: QuizAttempt[] = [];
  for (const attempt of attempts) {
    if (!immutableAssessmentScopes.has(attempt.scope)) {
      practiceAttempts.push(attempt);
      continue;
    }
    const key = `${attempt.userId}:${attempt.scope}:${attempt.moduleId ?? ''}`;
    const existing = firstByAssessment.get(key);
    if (!existing || quizTime(attempt) < quizTime(existing)) {
      firstByAssessment.set(key, attempt);
    }
  }
  return [...firstByAssessment.values(), ...practiceAttempts];
}

export function firstQuizAttempt(
  attempts: QuizAttempt[],
  scope: QuizAttempt['scope'],
  moduleId?: string,
): QuizAttempt | undefined {
  return attempts
    .filter(
      (attempt) =>
        attempt.scope === scope &&
        (moduleId === undefined || attempt.moduleId === moduleId),
    )
    .reduce<QuizAttempt | undefined>(
      (first, attempt) =>
        !first || quizTime(attempt) < quizTime(first) ? attempt : first,
      undefined,
    );
}

export function firstConfidenceByDomain(
  ratings: ConfidenceRating[],
  scope: ConfidenceRating['scope'],
  moduleId?: string,
): ConfidenceRating[] {
  const first = new Map<string, ConfidenceRating>();
  for (const rating of ratings) {
    if (
      rating.scope !== scope ||
      (moduleId !== undefined && rating.moduleId !== moduleId)
    ) {
      continue;
    }
    const key = rating.domain ?? '__overall__';
    const existing = first.get(key);
    if (!existing || rating.createdAt < existing.createdAt) first.set(key, rating);
  }
  return [...first.values()];
}

export function firstConfidenceAverage(
  ratings: ConfidenceRating[],
  scope: ConfidenceRating['scope'],
  moduleId?: string,
): number | undefined {
  const first = firstConfidenceByDomain(ratings, scope, moduleId);
  if (first.length === 0) return undefined;
  return first.reduce((sum, rating) => sum + rating.value, 0) / first.length;
}

export function latestCaseAttempts(attempts: CaseAttempt[]): CaseAttempt[] {
  const latest = new Map<string, CaseAttempt>();
  for (const attempt of attempts) {
    const existing = latest.get(attempt.caseId);
    if (!existing || attempt.submittedAt > existing.submittedAt) {
      latest.set(attempt.caseId, attempt);
    }
  }
  return [...latest.values()];
}
