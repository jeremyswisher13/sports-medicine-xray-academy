import { useCallback, useEffect, useState } from 'react';
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

async function readCol<T>(name: string): Promise<T[]> {
  if (!firestore) return [];
  const snap = await getDocs(collection(firestore, name));
  return snap.docs.map((d) => d.data() as T);
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

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [users, modules, quizzes, confidence, cases, videos, audit] = await Promise.all([
        readCol<UserProfile>(COLLECTIONS.users),
        readCol<ModuleProgress>(COLLECTIONS.moduleProgress),
        readCol<QuizAttempt>(COLLECTIONS.quizAttempts),
        readCol<ConfidenceRating>(COLLECTIONS.confidenceRatings),
        readCol<CaseAttempt>(COLLECTIONS.caseAttempts),
        readCol<VideoProgress>(COLLECTIONS.videoProgress),
        readCol<AuditEvent>(COLLECTIONS.auditLogs),
      ]);
      setData({ users, modules, quizzes, confidence, cases, videos, audit });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
