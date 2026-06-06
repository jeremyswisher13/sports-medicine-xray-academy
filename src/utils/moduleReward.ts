import { moduleSummaries } from '../data/moduleSummaries';
import type { ModuleContent, ModuleProgress, ModuleSummary } from '../types';
import type { IconName } from '../components/ui/Icon';

export type RewardTone = 'positive' | 'neutral' | 'caution';

export interface ReviewTarget {
  title: string;
  body: string;
  icon: IconName;
}

export interface CompletionVerdict {
  title: string;
  body: string;
  badge: string;
  subvalue: string;
  tone: RewardTone;
}

/** Difference between a pre and post value, or null when either is missing. */
export function delta(before?: number, after?: number): number | null {
  if (before === undefined || after === undefined) return null;
  return after - before;
}

export function formatSigned(value: number): string {
  return `${value > 0 ? '+' : ''}${Math.round(value)}`;
}

export function deltaTone(value: number | null): RewardTone {
  if (value === null) return 'neutral';
  if (value < 0) return 'caution';
  return 'positive';
}

/** Maps a post-check score + confidence into a readiness verdict. */
export function completionVerdict(score: number, confidence: number): CompletionVerdict {
  if (score >= 85 && confidence >= 4) {
    return {
      title: 'Strong finish. This read pattern is sticking.',
      body:
        'Your score and confidence are aligned. Keep reinforcing the skill with normal-first image calls and cases.',
      badge: 'Ready',
      subvalue: 'Score and confidence aligned',
      tone: 'positive',
    };
  }
  if (score >= 70 || confidence >= 4) {
    return {
      title: 'Good progress. One focused pass will tighten this.',
      body:
        'You have useful traction. The next best move is targeted review rather than restarting the whole module.',
      badge: 'Close',
      subvalue: 'Target weak areas',
      tone: 'neutral',
    };
  }
  return {
    title: 'Useful calibration. Rebuild the read once more.',
    body:
      'This is exactly why the post-check exists: it shows where the pattern needs another active pass before clinic use.',
    badge: 'Review',
    subvalue: 'Repeat guided reps',
    tone: 'caution',
  };
}

/** Up to three personalized "best next reps" based on the post-check result. */
export function reviewTargets(
  module: ModuleContent,
  progress: ModuleProgress,
  scoreDelta: number | null,
  confidenceDelta: number | null,
): ReviewTarget[] {
  const targets: ReviewTarget[] = [];
  const postScore = progress.postCheckScore ?? 0;
  const postConfidence = progress.postCheckConfidence ?? 0;

  if (postScore < 80) {
    targets.push({
      title: 'Redo the read',
      body: 'Repeat the guided systematic read before looking back at the explanations.',
      icon: 'clipboard',
    });
  }
  if (postConfidence < 4 || (confidenceDelta !== null && confidenceDelta <= 0)) {
    targets.push({
      title: 'Normal-first reps',
      body: `Use the atlas to call ${module.shortTitle.toLowerCase()} images before captions reveal.`,
      icon: 'image',
    });
  }
  if (scoreDelta !== null && scoreDelta <= 0) {
    targets.push({
      title: 'Missed concepts',
      body: 'Review quiz explanations and the one-page cheat sheet, then retake later.',
      icon: 'sparkles',
    });
  }
  if (targets.length === 0) {
    targets.push(
      {
        title: 'Maintain fluency',
        body: 'Do a short atlas block later this week so normal anatomy stays automatic.',
        icon: 'image',
      },
      {
        title: 'Clinic sheet',
        body: 'Use the cheat sheet once in clinic to reinforce escalation thresholds.',
        icon: 'printer',
      },
      {
        title: 'Teach it back',
        body: 'Explain one do-not-miss finding out loud without looking at notes.',
        icon: 'book-open',
      },
    );
  }

  return targets.slice(0, 3);
}

/**
 * Next module to recommend after finishing one: the first not-yet-completed
 * module after the current index (wrapping around), or undefined when all done.
 */
export function nextRecommendedModule(
  currentModuleId: string,
  progress: ModuleProgress[],
): ModuleSummary | undefined {
  const completedIds = new Set(
    progress.filter((item) => item.completed).map((item) => item.moduleId),
  );
  const foundIndex = moduleSummaries.findIndex((summary) => summary.id === currentModuleId);
  // Unknown module id: just recommend the first incomplete module from the top.
  const currentIndex = foundIndex === -1 ? -1 : foundIndex;
  const ordered = [
    ...moduleSummaries.slice(currentIndex + 1),
    ...moduleSummaries.slice(0, Math.max(0, currentIndex)),
  ];
  return ordered.find((summary) => !completedIds.has(summary.id));
}
