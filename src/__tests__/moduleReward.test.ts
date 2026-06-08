import { describe, expect, it } from 'vitest';
import {
  completionVerdict,
  delta,
  deltaTone,
  formatSigned,
  nextRecommendedModule,
  reviewTargets,
} from '../utils/moduleReward';
import { moduleSummaries } from '../data/moduleSummaries';
import type { ModuleContent, ModuleProgress } from '../types';

const moduleStub = { shortTitle: 'Shoulder' } as ModuleContent;

function progressStub(overrides: Partial<ModuleProgress> = {}): ModuleProgress {
  return {
    userId: 'u1',
    moduleId: 'shoulder',
    visited: true,
    completedTabs: [],
    completed: false,
    lastViewedAt: 0,
    ...overrides,
  };
}

describe('completionVerdict', () => {
  it('returns Ready/positive when score and confidence are both high', () => {
    const v = completionVerdict(85, 4);
    expect(v.tone).toBe('positive');
    expect(v.badge).toBe('Ready');
  });

  it('returns Close/neutral when only one dimension is strong', () => {
    const v = completionVerdict(72, 3);
    expect(v.tone).toBe('neutral');
    expect(v.badge).toBe('Close');
  });

  it('returns Review/caution when both are low', () => {
    const v = completionVerdict(50, 2);
    expect(v.tone).toBe('caution');
    expect(v.badge).toBe('Review');
  });
});

describe('reviewTargets', () => {
  it('never returns more than three targets', () => {
    const targets = reviewTargets(
      moduleStub,
      progressStub({ postCheckScore: 40, postCheckConfidence: 1 }),
      -10,
      -1,
    );
    expect(targets.length).toBeLessThanOrEqual(3);
  });

  it('surfaces "Redo the read" when the post score is below 80', () => {
    const targets = reviewTargets(
      moduleStub,
      progressStub({ postCheckScore: 60, postCheckConfidence: 5 }),
      10,
      1,
    );
    expect(targets.some((t) => t.title === 'Redo the read')).toBe(true);
  });

  it('returns the three maintenance targets when everything is strong', () => {
    const targets = reviewTargets(
      moduleStub,
      progressStub({ postCheckScore: 95, postCheckConfidence: 5 }),
      10,
      1,
    );
    expect(targets.map((t) => t.title)).toEqual([
      'Maintain fluency',
      'Clinic sheet',
      'Teach it back',
    ]);
  });
});

describe('nextRecommendedModule', () => {
  it('returns the first core module when none are complete', () => {
    expect(nextRecommendedModule([])?.id).toBe(moduleSummaries[0].id);
  });

  it('skips completed modules to the earliest incomplete one', () => {
    const completed: ModuleProgress[] = [
      progressStub({ moduleId: moduleSummaries[0].id, completed: true }),
      progressStub({ moduleId: moduleSummaries[1].id, completed: true }),
    ];
    expect(nextRecommendedModule(completed)?.id).toBe(moduleSummaries[2].id);
  });

  it('returns undefined when every module is complete', () => {
    const allComplete = moduleSummaries.map((m) =>
      progressStub({ moduleId: m.id, completed: true }),
    );
    expect(nextRecommendedModule(allComplete)).toBeUndefined();
  });
});

describe('delta helpers', () => {
  it('delta returns null when either value is missing', () => {
    expect(delta(undefined, 5)).toBeNull();
    expect(delta(5, undefined)).toBeNull();
    expect(delta(60, 80)).toBe(20);
  });

  it('formatSigned prefixes a plus for gains and rounds', () => {
    expect(formatSigned(12.4)).toBe('+12');
    expect(formatSigned(-8)).toBe('-8');
    expect(formatSigned(0)).toBe('0');
  });

  it('deltaTone maps sign to tone', () => {
    expect(deltaTone(null)).toBe('neutral');
    expect(deltaTone(-1)).toBe('caution');
    expect(deltaTone(5)).toBe('positive');
  });
});
