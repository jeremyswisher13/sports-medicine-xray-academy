import type { ModuleProgress } from '../types';

export function mergeRecordsByKey<T>(
  remote: T[],
  local: T[],
  keyFor: (record: T) => string,
): T[] {
  const merged = new Map(remote.map((record) => [keyFor(record), record]));
  for (const record of local) merged.set(keyFor(record), record);
  return [...merged.values()];
}

export interface ModuleVisitUpdate {
  userId: string;
  moduleId: string;
  visited: true;
  lastViewedAt: number;
}

export interface ModuleCheckpointUpdate extends ModuleVisitUpdate {
  phaseId?: string;
  lastSectionId?: string;
}

export function applyModuleVisit(
  existing: ModuleProgress | undefined,
  visit: ModuleVisitUpdate,
): ModuleProgress {
  const baseline: ModuleProgress = existing ?? {
    userId: visit.userId,
    moduleId: visit.moduleId,
    visited: true,
    completedTabs: [],
    completed: false,
    lastViewedAt: visit.lastViewedAt,
  };
  return {
    ...baseline,
    userId: visit.userId,
    moduleId: visit.moduleId,
    visited: true,
    lastViewedAt: Math.max(baseline.lastViewedAt, visit.lastViewedAt),
  };
}

export function applyModuleCheckpoint(
  existing: ModuleProgress | undefined,
  checkpoint: ModuleCheckpointUpdate,
): ModuleProgress {
  const visited = applyModuleVisit(existing, checkpoint);
  const completedTabs = checkpoint.phaseId
    ? [...new Set([...visited.completedTabs, checkpoint.phaseId])]
    : visited.completedTabs;
  return {
    ...visited,
    completedTabs,
    ...(checkpoint.lastSectionId ? { lastSectionId: checkpoint.lastSectionId } : {}),
  };
}

export function mergeModuleProgress(
  existing: ModuleProgress | undefined,
  incoming: ModuleProgress,
): ModuleProgress {
  if (!existing) return incoming;
  const completed = existing.completed || incoming.completed;
  const lastSectionId = incoming.lastSectionId ?? existing.lastSectionId;
  const preCheckAt = existing.preCheckAt ?? incoming.preCheckAt;
  const preCheckScore = existing.preCheckScore ?? incoming.preCheckScore;
  const preCheckConfidence = existing.preCheckConfidence ?? incoming.preCheckConfidence;
  const postCheckAt = existing.postCheckAt ?? incoming.postCheckAt;
  const postCheckScore = existing.postCheckScore ?? incoming.postCheckScore;
  const postCheckConfidence = existing.postCheckConfidence ?? incoming.postCheckConfidence;
  return {
    ...existing,
    ...incoming,
    completedTabs: [...new Set([...existing.completedTabs, ...incoming.completedTabs])],
    completed,
    lastViewedAt: Math.max(existing.lastViewedAt, incoming.lastViewedAt),
    ...(lastSectionId !== undefined
      ? { lastSectionId }
      : {}),
    ...(preCheckAt !== undefined
      ? { preCheckAt }
      : {}),
    ...(preCheckScore !== undefined
      ? { preCheckScore }
      : {}),
    ...(preCheckConfidence !== undefined
      ? { preCheckConfidence }
      : {}),
    ...(postCheckAt !== undefined
      ? { postCheckAt }
      : {}),
    ...(postCheckScore !== undefined
      ? { postCheckScore }
      : {}),
    ...(postCheckConfidence !== undefined
      ? { postCheckConfidence }
      : {}),
    ...(completed
      ? { completedAt: existing.completedAt ?? incoming.completedAt ?? incoming.lastViewedAt }
      : {}),
  };
}
