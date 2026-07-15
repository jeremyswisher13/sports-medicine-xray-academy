import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { COLLECTIONS, firestore } from '../services/firebase';
import type {
  AuditEvent,
  CaseAttempt,
  ConfidenceRating,
  ModuleProgress,
  QuizAttempt,
  UserProfile,
  VideoProgress,
} from '../types';
import { normalizeTimestampFields } from '../utils/timestamp';

export interface AdminSnapshot {
  users: UserProfile[];
  modules: ModuleProgress[];
  quizzes: QuizAttempt[];
  confidence: ConfidenceRating[];
  cases: CaseAttempt[];
  videos: VideoProgress[];
  audit: AuditEvent[];
}

const empty: AdminSnapshot = {
  users: [],
  modules: [],
  quizzes: [],
  confidence: [],
  cases: [],
  videos: [],
  audit: [],
};

async function readCol<T extends object>(
  name: string,
  timestampFields: readonly (keyof T)[],
): Promise<T[]> {
  if (!firestore) return [];
  const snap = await getDocs(collection(firestore, name));
  return snap.docs.map((d) =>
    normalizeTimestampFields(d.data() as T, timestampFields),
  );
}

export function useAdminData(enabled: boolean): {
  data: AdminSnapshot;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [data, setData] = useState<AdminSnapshot>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    if (!enabled) {
      setData(empty);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [users, modules, quizzes, confidence, cases, videos, audit] = await Promise.all([
        readCol<UserProfile>(COLLECTIONS.users, ['createdAt', 'lastLogin']),
        readCol<ModuleProgress>(COLLECTIONS.moduleProgress, [
          'completedAt',
          'lastViewedAt',
          'preCheckAt',
          'postCheckAt',
        ]),
        readCol<QuizAttempt>(COLLECTIONS.quizAttempts, ['startedAt', 'submittedAt']),
        readCol<ConfidenceRating>(COLLECTIONS.confidenceRatings, ['createdAt']),
        readCol<CaseAttempt>(COLLECTIONS.caseAttempts, ['submittedAt']),
        readCol<VideoProgress>(COLLECTIONS.videoProgress, [
          'completedAt',
          'createdAt',
          'updatedAt',
        ]),
        readCol<AuditEvent>(COLLECTIONS.auditLogs, ['createdAt']),
      ]);
      if (requestId === requestIdRef.current) {
        setData({ users, modules, quizzes, confidence, cases, videos, audit });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (requestId === requestIdRef.current) setError(msg);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
    return () => {
      requestIdRef.current += 1;
    };
  }, [refresh]);

  return { data, loading, error, refresh };
}
