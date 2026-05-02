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

const emptySnapshot: ProgressSnapshot = {
  modules: [],
  quizzes: [],
  confidence: [],
  cases: [],
  videos: [],
};

export function useProgress(): {
  snapshot: ProgressSnapshot;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const { user, learnerPreview } = useAuth();
  const [snapshot, setSnapshot] = useState<ProgressSnapshot>(emptySnapshot);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user || learnerPreview) {
      setSnapshot(emptySnapshot);
      setLoading(false);
      return;
    }
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
  }, [user, learnerPreview]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { snapshot, loading, refresh };
}
