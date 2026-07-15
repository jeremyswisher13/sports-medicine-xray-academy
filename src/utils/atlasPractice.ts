export interface AtlasPracticeStats {
  answered: number;
  correct: number;
  streak: number;
  revealed: number;
}

export type AtlasPracticeOutcome = 'correct' | 'incorrect' | 'revealed';

export function applyAtlasPracticeOutcome(
  stats: AtlasPracticeStats,
  outcome: AtlasPracticeOutcome,
): AtlasPracticeStats {
  if (outcome === 'revealed') {
    return { ...stats, revealed: stats.revealed + 1 };
  }
  const correct = outcome === 'correct';
  return {
    ...stats,
    answered: stats.answered + 1,
    correct: stats.correct + (correct ? 1 : 0),
    streak: correct ? stats.streak + 1 : 0,
  };
}
