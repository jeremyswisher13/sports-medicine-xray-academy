import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  listCaseAttempts,
  listConfidenceRatings,
  listModuleProgress,
  listQuizAttempts,
  listVideoProgress,
} from '../services/firestore';
import type {
  CaseAttempt,
  ConfidenceRating,
  ModuleProgress,
  QuizAttempt,
  VideoProgress,
} from '../types';

export interface ProgressSnapshot {
  modules: ModuleProgress[];
  quizzes: QuizAttempt[];
  confidence: ConfidenceRating[];
  cases: CaseAttempt[];
  videos: VideoProgress[];
}

export function useProgress(): {
  snapshot: ProgressSnapshot;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<ProgressSnapshot>({
    modules: [],
    quizzes: [],
    confidence: [],
    cases: [],
    videos: [],
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [modules, quizzes, confidence, cases, videos] = await Promise.all([
        listModuleProgress(user.uid),
        listQuizAttempts(user.uid),
        listConfidenceRatings(user.uid),
        listCaseAttempts(user.uid),
        listVideoProgress(user.uid),
      ]);
      setSnapshot({ modules, quizzes, confidence, cases, videos });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { snapshot, loading, refresh };
}
