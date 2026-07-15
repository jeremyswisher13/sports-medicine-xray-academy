import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
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
import {
  applyModuleCheckpoint,
  applyModuleVisit,
  mergeModuleProgress,
  mergeRecordsByKey,
  type ModuleCheckpointUpdate,
  type ModuleVisitUpdate,
} from '../utils/offline';
import { normalizeTimestampFields } from '../utils/timestamp';

// The local records are both an offline outbox and the source of truth for
// local demo users. Remote users also get a read cache for reliable PWA use.
const LS_PREFIX = 'sxra:';
const NETWORK_TIMEOUT_MS = 4500;

const isLocalOnlyUser = (userId: string) =>
  userId === 'local-demo-user' || userId.startsWith('guest-');

const canUseFirestore = (userId: string) =>
  Boolean(firestore) && !isLocalOnlyUser(userId);

const isProbablyOnline = () =>
  typeof navigator === 'undefined' || navigator.onLine;

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
    // Storage can be unavailable or full; remote persistence still proceeds.
  }
}

const cacheKey = (key: string) => `cache:${key}`;
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function withNetworkTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(
      () => reject(new Error('Firestore request timed out')),
      NETWORK_TIMEOUT_MS,
    );
    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

function upsertList<T>(key: string, record: T, keyFor: (value: T) => string): void {
  const current = lsGet<T[]>(key, []);
  lsSet(key, mergeRecordsByKey(current, [record], keyFor));
}

function removeListKeys<T>(
  key: string,
  keys: Set<string>,
  keyFor: (value: T) => string,
): void {
  if (keys.size === 0) return;
  lsSet(
    key,
    lsGet<T[]>(key, []).filter((record) => !keys.has(keyFor(record))),
  );
}

function upsertMap<T>(key: string, recordKey: string, record: T): void {
  const current = lsGet<Record<string, T>>(key, {});
  current[recordKey] = record;
  lsSet(key, current);
}

function removeMapKey<T>(key: string, recordKey: string): void {
  const current = lsGet<Record<string, T>>(key, {});
  delete current[recordKey];
  lsSet(key, current);
}

function documentData(record: object): DocumentData {
  return record as unknown as DocumentData;
}

async function writeRemoteRecord(
  collectionName: string,
  documentId: string,
  data: DocumentData,
  merge = false,
): Promise<void> {
  const ref = doc(firestore!, collectionName, documentId);
  if (merge) {
    await withNetworkTimeout(setDoc(ref, data, { merge: true }));
  } else {
    await withNetworkTimeout(setDoc(ref, data));
  }
}

async function readRemoteRecords<T extends object>(
  userId: string,
  collectionName: string,
  timestampFields: readonly (keyof T)[],
): Promise<T[]> {
  const request = query(
    collection(firestore!, collectionName),
    where('userId', '==', userId),
  );
  const snap = await withNetworkTimeout(getDocs(request));
  return snap.docs.map((item) =>
    normalizeTimestampFields(item.data() as T, timestampFields),
  );
}

interface ListSyncOptions<T extends object> {
  userId: string;
  storageKey: string;
  collectionName: string;
  keyFor: (record: T) => string;
  documentIdFor?: (record: T) => string;
  timestampFields: readonly (keyof T)[];
  serialize?: (record: T) => DocumentData;
}

async function syncPendingList<T extends object>(
  options: ListSyncOptions<T>,
): Promise<void> {
  if (!canUseFirestore(options.userId) || !isProbablyOnline()) return;
  const pending = lsGet<T[]>(options.storageKey, []);
  if (pending.length === 0) return;

  const results = await Promise.all(
    pending.map(async (record) => {
      const key = options.keyFor(record);
      try {
        await writeRemoteRecord(
          options.collectionName,
          options.documentIdFor?.(record) ?? key,
          options.serialize?.(record) ?? documentData(record),
        );
        return key;
      } catch {
        return null;
      }
    }),
  );
  removeListKeys(
    options.storageKey,
    new Set(results.filter((key): key is string => key !== null)),
    options.keyFor,
  );
}

async function persistListRecord<T extends object>(
  options: ListSyncOptions<T>,
  record: T,
): Promise<void> {
  upsertList(options.storageKey, record, options.keyFor);
  if (!canUseFirestore(options.userId)) return;
  upsertList(cacheKey(options.storageKey), record, options.keyFor);
  if (!isProbablyOnline()) return;

  try {
    await writeRemoteRecord(
      options.collectionName,
      options.documentIdFor?.(record) ?? options.keyFor(record),
      options.serialize?.(record) ?? documentData(record),
    );
    removeListKeys(options.storageKey, new Set([options.keyFor(record)]), options.keyFor);
  } catch (error) {
    console.warn(`[${options.collectionName}] queued for retry`, error);
  }
}

async function listSyncedRecords<T extends object>(
  options: ListSyncOptions<T>,
): Promise<T[]> {
  if (!canUseFirestore(options.userId)) {
    return lsGet<T[]>(options.storageKey, []);
  }

  await syncPendingList(options);
  let pending = lsGet<T[]>(options.storageKey, []);
  const cached = lsGet<T[]>(cacheKey(options.storageKey), []);
  if (!isProbablyOnline()) {
    return mergeRecordsByKey(cached, pending, options.keyFor);
  }

  try {
    const remote = await readRemoteRecords<T>(
      options.userId,
      options.collectionName,
      options.timestampFields,
    );
    // Immutable record retries can encounter an already-created document.
    // Once that exact id is visible remotely, it is no longer pending.
    const remoteKeys = new Set(remote.map(options.keyFor));
    removeListKeys(options.storageKey, remoteKeys, options.keyFor);
    pending = lsGet<T[]>(options.storageKey, []);
    const merged = mergeRecordsByKey(remote, pending, options.keyFor);
    lsSet(cacheKey(options.storageKey), merged);
    return merged;
  } catch {
    return mergeRecordsByKey(cached, pending, options.keyFor);
  }
}

interface MapSyncOptions<T extends object> {
  userId: string;
  storageKey: string;
  collectionName: string;
  keyFor: (record: T) => string;
  documentIdFor: (record: T) => string;
  timestampFields: readonly (keyof T)[];
}

async function syncPendingMap<T extends object>(options: MapSyncOptions<T>): Promise<void> {
  if (!canUseFirestore(options.userId) || !isProbablyOnline()) return;
  const pending = lsGet<Record<string, T>>(options.storageKey, {});
  const results = await Promise.all(
    Object.entries(pending).map(async ([recordKey, record]) => {
      try {
        await writeRemoteRecord(
          options.collectionName,
          options.documentIdFor(record),
          documentData(record),
          true,
        );
        return recordKey;
      } catch {
        return null;
      }
    }),
  );
  for (const recordKey of results) {
    if (recordKey) removeMapKey<T>(options.storageKey, recordKey);
  }
}

async function persistMapRecord<T extends object>(
  options: MapSyncOptions<T>,
  record: T,
): Promise<void> {
  const recordKey = options.keyFor(record);
  upsertMap(options.storageKey, recordKey, record);
  if (!canUseFirestore(options.userId)) return;
  upsertMap(cacheKey(options.storageKey), recordKey, record);
  if (!isProbablyOnline()) return;

  try {
    await writeRemoteRecord(
      options.collectionName,
      options.documentIdFor(record),
      documentData(record),
      true,
    );
    removeMapKey<T>(options.storageKey, recordKey);
  } catch (error) {
    console.warn(`[${options.collectionName}] queued for retry`, error);
  }
}

async function listSyncedMapRecords<T extends object>(
  options: MapSyncOptions<T>,
): Promise<T[]> {
  if (!canUseFirestore(options.userId)) {
    return Object.values(lsGet<Record<string, T>>(options.storageKey, {}));
  }

  await syncPendingMap(options);
  const pending = Object.values(lsGet<Record<string, T>>(options.storageKey, {}));
  const cached = Object.values(
    lsGet<Record<string, T>>(cacheKey(options.storageKey), {}),
  );
  if (!isProbablyOnline()) {
    return mergeRecordsByKey(cached, pending, options.keyFor);
  }

  try {
    const remote = await readRemoteRecords<T>(
      options.userId,
      options.collectionName,
      options.timestampFields,
    );
    const merged = mergeRecordsByKey(remote, pending, options.keyFor);
    lsSet(
      cacheKey(options.storageKey),
      Object.fromEntries(merged.map((record) => [options.keyFor(record), record])),
    );
    return merged;
  } catch {
    return mergeRecordsByKey(cached, pending, options.keyFor);
  }
}

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
    createdAt: Date.now(),
    ...(input.moduleId !== undefined ? { moduleId: input.moduleId } : {}),
    ...(input.refId !== undefined ? { refId: input.refId } : {}),
    ...(input.details !== undefined ? { details: input.details } : {}),
  };
  await persistListRecord(
    {
      userId: input.userId,
      storageKey: `audit:${input.userId}`,
      collectionName: COLLECTIONS.auditLogs,
      keyFor: (record: AuditEvent) => record.id,
      timestampFields: ['createdAt'],
      serialize: (record) => ({ ...record, createdAt: serverTimestamp() }),
    },
    event,
  );

  const local = lsGet<AuditEvent[]>(`audit:${input.userId}`, []);
  if (local.length > 200) lsSet(`audit:${input.userId}`, local.slice(-200));
}

export async function listAuditEvents(userId: string): Promise<AuditEvent[]> {
  return listSyncedRecords({
    userId,
    storageKey: `audit:${userId}`,
    collectionName: COLLECTIONS.auditLogs,
    keyFor: (event) => event.id,
    timestampFields: ['createdAt'],
    serialize: (record) => ({ ...record, createdAt: serverTimestamp() }),
  });
}

// ---- Module progress ------------------------------------------------------

const moduleOptions = (userId: string): MapSyncOptions<ModuleProgress> => ({
  userId,
  storageKey: `progress:${userId}`,
  collectionName: COLLECTIONS.moduleProgress,
  keyFor: (progress) => progress.moduleId,
  documentIdFor: (progress) => `${progress.userId}_${progress.moduleId}`,
  timestampFields: ['completedAt', 'lastViewedAt', 'preCheckAt', 'postCheckAt'],
});

const moduleVisitKey = (userId: string) => `progressVisits:${userId}`;

async function syncModuleVisits(userId: string): Promise<void> {
  if (!canUseFirestore(userId) || !isProbablyOnline()) return;
  const pending = lsGet<Record<string, ModuleVisitUpdate>>(moduleVisitKey(userId), {});
  const results = await Promise.all(
    Object.entries(pending).map(async ([moduleId, visit]) => {
      try {
        await writeRemoteRecord(
          COLLECTIONS.moduleProgress,
          `${visit.userId}_${visit.moduleId}`,
          documentData(visit),
          true,
        );
        return moduleId;
      } catch {
        return null;
      }
    }),
  );
  for (const moduleId of results) {
    if (moduleId) removeMapKey<ModuleVisitUpdate>(moduleVisitKey(userId), moduleId);
  }
}

export async function saveModuleProgress(progress: ModuleProgress): Promise<void> {
  const options = moduleOptions(progress.userId);
  const pending = lsGet<Record<string, ModuleProgress>>(options.storageKey, {});
  const cached = lsGet<Record<string, ModuleProgress>>(cacheKey(options.storageKey), {});
  const existing = pending[progress.moduleId] ?? cached[progress.moduleId];
  await persistMapRecord(options, mergeModuleProgress(existing, progress));
}

export async function saveModuleCheckpoint(
  checkpoint: ModuleCheckpointUpdate,
): Promise<ModuleProgress> {
  const options = moduleOptions(checkpoint.userId);
  const pending = lsGet<Record<string, ModuleProgress>>(options.storageKey, {});
  const cached = lsGet<Record<string, ModuleProgress>>(cacheKey(options.storageKey), {});
  const existing = pending[checkpoint.moduleId] ?? cached[checkpoint.moduleId];
  const progress = applyModuleCheckpoint(existing, checkpoint);
  await persistMapRecord(options, progress);
  return progress;
}

export async function markModuleVisited(input: {
  userId: string;
  moduleId: string;
  lastViewedAt: number;
}): Promise<void> {
  const options = moduleOptions(input.userId);
  const pending = lsGet<Record<string, ModuleProgress>>(options.storageKey, {});
  const cached = lsGet<Record<string, ModuleProgress>>(cacheKey(options.storageKey), {});
  const existing = pending[input.moduleId] ?? cached[input.moduleId];
  const visit: ModuleVisitUpdate = {
    userId: input.userId,
    moduleId: input.moduleId,
    visited: true,
    lastViewedAt: input.lastViewedAt,
  };
  const localProgress = applyModuleVisit(existing, visit);

  if (!canUseFirestore(input.userId)) {
    upsertMap(options.storageKey, input.moduleId, localProgress);
    return;
  }

  upsertMap(cacheKey(options.storageKey), input.moduleId, localProgress);
  upsertMap(moduleVisitKey(input.userId), input.moduleId, visit);
  if (!isProbablyOnline()) return;

  try {
    await writeRemoteRecord(
      COLLECTIONS.moduleProgress,
      `${input.userId}_${input.moduleId}`,
      documentData(visit),
      true,
    );
    removeMapKey<ModuleVisitUpdate>(moduleVisitKey(input.userId), input.moduleId);
  } catch (error) {
    console.warn('[moduleProgress] visit queued for retry', error);
  }
}

export async function listModuleProgress(userId: string): Promise<ModuleProgress[]> {
  await syncModuleVisits(userId);
  const records = await listSyncedMapRecords(moduleOptions(userId));
  const visits = Object.values(
    lsGet<Record<string, ModuleVisitUpdate>>(moduleVisitKey(userId), {}),
  );
  if (visits.length === 0) return records;

  const byModule = new Map(records.map((record) => [record.moduleId, record]));
  for (const visit of visits) {
    byModule.set(visit.moduleId, applyModuleVisit(byModule.get(visit.moduleId), visit));
  }
  return [...byModule.values()];
}

// ---- Quiz attempts --------------------------------------------------------

const quizOptions = (userId: string): ListSyncOptions<QuizAttempt> => ({
  userId,
  storageKey: `quiz:${userId}`,
  collectionName: COLLECTIONS.quizAttempts,
  keyFor: (attempt) => attempt.id,
  timestampFields: ['startedAt', 'submittedAt'],
});

export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  await persistListRecord(quizOptions(attempt.userId), attempt);
}

export async function listQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  return listSyncedRecords(quizOptions(userId));
}

// ---- Confidence ratings ---------------------------------------------------

const confidenceOptions = (userId: string): ListSyncOptions<ConfidenceRating> => ({
  userId,
  storageKey: `confidence:${userId}`,
  collectionName: COLLECTIONS.confidenceRatings,
  keyFor: (rating) => rating.id,
  timestampFields: ['createdAt'],
});

export async function saveConfidenceRating(rating: ConfidenceRating): Promise<void> {
  await persistListRecord(confidenceOptions(rating.userId), rating);
}

export async function listConfidenceRatings(userId: string): Promise<ConfidenceRating[]> {
  return listSyncedRecords(confidenceOptions(userId));
}

// ---- Case attempts --------------------------------------------------------

const caseOptions = (userId: string): ListSyncOptions<CaseAttempt> => ({
  userId,
  storageKey: `cases:${userId}`,
  collectionName: COLLECTIONS.caseAttempts,
  keyFor: (attempt) => attempt.id,
  timestampFields: ['submittedAt'],
});

export async function saveCaseAttempt(attempt: CaseAttempt): Promise<void> {
  await persistListRecord(caseOptions(attempt.userId), attempt);
}

export async function listCaseAttempts(userId: string): Promise<CaseAttempt[]> {
  return listSyncedRecords(caseOptions(userId));
}

// ---- Video progress -------------------------------------------------------

const videoOptions = (userId: string): MapSyncOptions<VideoProgress> => ({
  userId,
  storageKey: `videos:${userId}`,
  collectionName: COLLECTIONS.videoProgress,
  keyFor: (progress) => progress.videoId,
  documentIdFor: (progress) => `${progress.userId}_${progress.videoId}`,
  timestampFields: ['completedAt', 'createdAt', 'updatedAt'],
});

export async function saveVideoProgress(progress: VideoProgress): Promise<void> {
  await persistMapRecord(videoOptions(progress.userId), progress);
}

export async function listVideoProgress(userId: string): Promise<VideoProgress[]> {
  return listSyncedMapRecords(videoOptions(userId));
}

// ---- Bookmarks ------------------------------------------------------------

const bookmarkOptions = (userId: string): MapSyncOptions<Bookmark> => ({
  userId,
  storageKey: `bookmarks:${userId}`,
  collectionName: COLLECTIONS.bookmarks,
  keyFor: (bookmark) => bookmark.id,
  documentIdFor: (bookmark) => bookmark.id,
  timestampFields: ['createdAt'],
});

const bookmarkDeleteKey = (userId: string) => `bookmarkDeletes:${userId}`;

function removeBookmarkDelete(userId: string, bookmarkId: string): void {
  lsSet(
    bookmarkDeleteKey(userId),
    lsGet<string[]>(bookmarkDeleteKey(userId), []).filter((id) => id !== bookmarkId),
  );
}

async function flushBookmarkDeletes(userId: string): Promise<void> {
  if (!canUseFirestore(userId) || !isProbablyOnline()) return;
  const pendingDeletes = lsGet<string[]>(bookmarkDeleteKey(userId), []);
  const results = await Promise.all(
    pendingDeletes.map(async (bookmarkId) => {
      try {
        await withNetworkTimeout(
          deleteDoc(doc(firestore!, COLLECTIONS.bookmarks, bookmarkId)),
        );
        return bookmarkId;
      } catch {
        return null;
      }
    }),
  );
  const deleted = new Set(results.filter((id): id is string => id !== null));
  lsSet(
    bookmarkDeleteKey(userId),
    pendingDeletes.filter((id) => !deleted.has(id)),
  );
}

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  removeBookmarkDelete(bookmark.userId, bookmark.id);
  await persistMapRecord(bookmarkOptions(bookmark.userId), bookmark);
}

export async function deleteBookmark(input: {
  userId: string;
  bookmarkId: string;
}): Promise<void> {
  const options = bookmarkOptions(input.userId);
  removeMapKey<Bookmark>(options.storageKey, input.bookmarkId);
  removeMapKey<Bookmark>(cacheKey(options.storageKey), input.bookmarkId);
  if (!canUseFirestore(input.userId)) return;

  const pendingDeletes = new Set(lsGet<string[]>(bookmarkDeleteKey(input.userId), []));
  pendingDeletes.add(input.bookmarkId);
  lsSet(bookmarkDeleteKey(input.userId), [...pendingDeletes]);
  if (!isProbablyOnline()) return;

  try {
    await withNetworkTimeout(
      deleteDoc(doc(firestore!, COLLECTIONS.bookmarks, input.bookmarkId)),
    );
    removeBookmarkDelete(input.userId, input.bookmarkId);
  } catch (error) {
    console.warn('[bookmarks] delete queued for retry', error);
  }
}

export async function listBookmarks(userId: string): Promise<Bookmark[]> {
  await flushBookmarkDeletes(userId);
  const pendingDeletes = new Set(lsGet<string[]>(bookmarkDeleteKey(userId), []));
  const bookmarks = await listSyncedMapRecords(bookmarkOptions(userId));
  return bookmarks.filter((bookmark) => !pendingDeletes.has(bookmark.id));
}

export const ids = { newId };
