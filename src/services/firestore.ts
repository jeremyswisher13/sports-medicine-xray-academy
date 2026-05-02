import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { COLLECTIONS, firestore } from './firebase';
import type {
  AuditEvent,
  AuditEventType,
  Bookmark,
  CaseAttempt,
  ConfidenceRating,
  ModuleProgress,
  QuizAttempt,
  VideoProgress,
} from '../types';

// Local-storage helpers used as fallback when Firestore isn't configured.
const LS_PREFIX = 'sxra:';

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ---- Audit ---------------------------------------------------------------

export async function logAuditEvent(input: {
  userId: string;
  type: AuditEventType;
  moduleId?: string;
  refId?: string;
  details?: Record<string, string | number | boolean>;
}): Promise<void> {
  const event: AuditEvent = {
    id: newId(),
    userId: input.userId,
    type: input.type,
    moduleId: input.moduleId,
    refId: input.refId,
    details: input.details,
    createdAt: Date.now(),
  };
  if (firestore) {
    try {
      await addDoc(collection(firestore, COLLECTIONS.auditLogs), {
        ...event,
        createdAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.warn('[audit] firestore write failed, falling back to local', err);
    }
  }
  const list = lsGet<AuditEvent[]>(`audit:${input.userId}`, []);
  list.push(event);
  lsSet(`audit:${input.userId}`, list.slice(-200));
}

export async function listAuditEvents(userId: string): Promise<AuditEvent[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.auditLogs),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as AuditEvent);
    } catch {
      // fall through
    }
  }
  return lsGet<AuditEvent[]>(`audit:${userId}`, []);
}

// ---- Module progress ------------------------------------------------------

export async function saveModuleProgress(p: ModuleProgress): Promise<void> {
  if (firestore) {
    try {
      const ref = doc(firestore, COLLECTIONS.moduleProgress, `${p.userId}_${p.moduleId}`);
      await setDoc(ref, p, { merge: true });
      return;
    } catch (err) {
      console.warn('[moduleProgress] firestore write failed', err);
    }
  }
  const map = lsGet<Record<string, ModuleProgress>>(`progress:${p.userId}`, {});
  map[p.moduleId] = p;
  lsSet(`progress:${p.userId}`, map);
}

export async function markModuleVisited(input: {
  userId: string;
  moduleId: string;
  lastViewedAt: number;
}): Promise<void> {
  const update = {
    userId: input.userId,
    moduleId: input.moduleId,
    visited: true,
    lastViewedAt: input.lastViewedAt,
  };
  if (firestore) {
    try {
      const ref = doc(
        firestore,
        COLLECTIONS.moduleProgress,
        `${input.userId}_${input.moduleId}`,
      );
      await setDoc(ref, update, { merge: true });
      return;
    } catch (err) {
      console.warn('[moduleProgress] firestore visit write failed', err);
    }
  }
  const map = lsGet<Record<string, ModuleProgress>>(`progress:${input.userId}`, {});
  const existing = map[input.moduleId];
  map[input.moduleId] = {
    userId: input.userId,
    moduleId: input.moduleId,
    visited: true,
    completedTabs: existing?.completedTabs ?? [],
    completed: existing?.completed ?? false,
    completedAt: existing?.completedAt,
    lastViewedAt: input.lastViewedAt,
    preCheckAt: existing?.preCheckAt,
    postCheckAt: existing?.postCheckAt,
    preCheckScore: existing?.preCheckScore,
    postCheckScore: existing?.postCheckScore,
    preCheckConfidence: existing?.preCheckConfidence,
    postCheckConfidence: existing?.postCheckConfidence,
  };
  lsSet(`progress:${input.userId}`, map);
}

export async function listModuleProgress(userId: string): Promise<ModuleProgress[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.moduleProgress),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as ModuleProgress);
    } catch {
      // fall through
    }
  }
  const map = lsGet<Record<string, ModuleProgress>>(`progress:${userId}`, {});
  return Object.values(map);
}

// ---- Quiz attempts --------------------------------------------------------

export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  if (firestore) {
    try {
      await setDoc(doc(firestore, COLLECTIONS.quizAttempts, attempt.id), attempt);
      return;
    } catch (err) {
      console.warn('[quizAttempt] firestore write failed', err);
    }
  }
  const list = lsGet<QuizAttempt[]>(`quiz:${attempt.userId}`, []);
  list.push(attempt);
  lsSet(`quiz:${attempt.userId}`, list);
}

export async function listQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.quizAttempts),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as QuizAttempt);
    } catch {
      // fall through
    }
  }
  return lsGet<QuizAttempt[]>(`quiz:${userId}`, []);
}

// ---- Confidence ratings ---------------------------------------------------

export async function saveConfidenceRating(rating: ConfidenceRating): Promise<void> {
  if (firestore) {
    try {
      await setDoc(doc(firestore, COLLECTIONS.confidenceRatings, rating.id), rating);
      return;
    } catch (err) {
      console.warn('[confidence] firestore write failed', err);
    }
  }
  const list = lsGet<ConfidenceRating[]>(`confidence:${rating.userId}`, []);
  list.push(rating);
  lsSet(`confidence:${rating.userId}`, list);
}

export async function listConfidenceRatings(userId: string): Promise<ConfidenceRating[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.confidenceRatings),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as ConfidenceRating);
    } catch {
      // fall through
    }
  }
  return lsGet<ConfidenceRating[]>(`confidence:${userId}`, []);
}

// ---- Case attempts --------------------------------------------------------

export async function saveCaseAttempt(attempt: CaseAttempt): Promise<void> {
  if (firestore) {
    try {
      await setDoc(doc(firestore, COLLECTIONS.caseAttempts, attempt.id), attempt);
      return;
    } catch (err) {
      console.warn('[case] firestore write failed', err);
    }
  }
  const list = lsGet<CaseAttempt[]>(`cases:${attempt.userId}`, []);
  list.push(attempt);
  lsSet(`cases:${attempt.userId}`, list);
}

export async function listCaseAttempts(userId: string): Promise<CaseAttempt[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.caseAttempts),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as CaseAttempt);
    } catch {
      // fall through
    }
  }
  return lsGet<CaseAttempt[]>(`cases:${userId}`, []);
}

// ---- Video progress -------------------------------------------------------

export async function saveVideoProgress(progress: VideoProgress): Promise<void> {
  if (firestore) {
    try {
      const ref = doc(
        firestore,
        COLLECTIONS.videoProgress,
        `${progress.userId}_${progress.videoId}`,
      );
      await setDoc(ref, progress, { merge: true });
      return;
    } catch (err) {
      console.warn('[video] firestore write failed', err);
    }
  }
  const map = lsGet<Record<string, VideoProgress>>(`videos:${progress.userId}`, {});
  map[progress.videoId] = progress;
  lsSet(`videos:${progress.userId}`, map);
}

export async function listVideoProgress(userId: string): Promise<VideoProgress[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.videoProgress),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as VideoProgress);
    } catch {
      // fall through
    }
  }
  const map = lsGet<Record<string, VideoProgress>>(`videos:${userId}`, {});
  return Object.values(map);
}

// ---- Bookmarks ------------------------------------------------------------

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  if (firestore) {
    try {
      await setDoc(doc(firestore, COLLECTIONS.bookmarks, bookmark.id), bookmark);
      return;
    } catch (err) {
      console.warn('[bookmark] firestore write failed', err);
    }
  }
  const map = lsGet<Record<string, Bookmark>>(`bookmarks:${bookmark.userId}`, {});
  map[bookmark.id] = bookmark;
  lsSet(`bookmarks:${bookmark.userId}`, map);
}

export async function deleteBookmark(input: {
  userId: string;
  bookmarkId: string;
}): Promise<void> {
  if (firestore) {
    try {
      await deleteDoc(doc(firestore, COLLECTIONS.bookmarks, input.bookmarkId));
      return;
    } catch (err) {
      console.warn('[bookmark] firestore delete failed', err);
    }
  }
  const map = lsGet<Record<string, Bookmark>>(`bookmarks:${input.userId}`, {});
  delete map[input.bookmarkId];
  lsSet(`bookmarks:${input.userId}`, map);
}

export async function listBookmarks(userId: string): Promise<Bookmark[]> {
  if (firestore) {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.bookmarks),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as Bookmark);
    } catch {
      // fall through
    }
  }
  const map = lsGet<Record<string, Bookmark>>(`bookmarks:${userId}`, {});
  return Object.values(map);
}

export const ids = { newId };
