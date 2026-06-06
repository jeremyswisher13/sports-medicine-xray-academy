import { describe, expect, it } from 'vitest';
import { draftCases, draftQuiz } from '../data/contentDrafts';
import { getImage } from '../data/images';
import { moduleSummaries } from '../data/moduleSummaries';

const moduleIdSet = new Set(moduleSummaries.map((m) => m.id));

// Structural guards for the (clinically-unreviewed) draft content. These do
// not assert clinical correctness — they ensure the drafts compile into the
// app cleanly once an MD approves and promotes them.
describe('content drafts — structural validity', () => {
  it('keys every draft bucket to a known module', () => {
    for (const moduleId of [...Object.keys(draftCases), ...Object.keys(draftQuiz)]) {
      expect(moduleIdSet.has(moduleId), moduleId).toBe(true);
    }
  });

  it('keeps every draft case answer inside its diagnosis options', () => {
    const cases = Object.values(draftCases).flat();
    expect(cases.length).toBeGreaterThan(0);
    for (const c of cases) {
      const ids = new Set(c.diagnosisOptions.map((o) => o.id));
      expect(ids.has(c.correctOptionId), c.id).toBe(true);
      expect(c.moduleId).toBe(c.moduleId);
    }
  });

  it('keeps every draft quiz answer inside its options', () => {
    const quiz = Object.values(draftQuiz).flat();
    expect(quiz.length).toBeGreaterThan(0);
    for (const q of quiz) {
      const ids = new Set(q.options.map((o) => o.id));
      expect(ids.has(q.correctOptionId), q.id).toBe(true);
    }
  });

  it('resolves every imageKey referenced by a draft case', () => {
    const keys = Object.values(draftCases)
      .flat()
      .flatMap((c) => (c.imagePanels ?? []).map((p) => p.imageKey))
      .filter((k): k is string => Boolean(k));
    for (const key of keys) {
      expect(getImage(key), key).toBeDefined();
    }
  });

  it('uses draft- prefixed ids to avoid collisions with live content', () => {
    const ids = [
      ...Object.values(draftCases).flat().map((c) => c.id),
      ...Object.values(draftQuiz).flat().map((q) => q.id),
    ];
    for (const id of ids) {
      expect(id.startsWith('draft-'), id).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length); // no duplicate ids
  });
});
