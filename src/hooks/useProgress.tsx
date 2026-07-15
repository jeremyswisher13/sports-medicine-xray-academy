import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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

export interface ProgressContextValue {
  snapshot: ProgressSnapshot;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, learnerPreview } = useAuth();
  const [snapshot, setSnapshot] = useState<ProgressSnapshot>(emptySnapshot);
  const [loadedKey, setLoadedKey] = useState('');
  const requestIdRef = useRef(0);
  const activeKey = learnerPreview ? 'learner-preview' : user?.uid ?? 'signed-out';
  const activeKeyRef = useRef(activeKey);
  activeKeyRef.current = activeKey;

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const requestKey = learnerPreview ? 'learner-preview' : user?.uid ?? 'signed-out';

    if (!user || learnerPreview) {
      if (requestId === requestIdRef.current) {
        setSnapshot(emptySnapshot);
        setLoadedKey(requestKey);
      }
      return;
    }

    try {
      const [modules, quizzes, confidence, cases, videos] = await Promise.all([
        listModuleProgress(user.uid),
        listQuizAttempts(user.uid),
        listConfidenceRatings(user.uid),
        listCaseAttempts(user.uid),
        listVideoProgress(user.uid),
      ]);
      if (
        requestId === requestIdRef.current &&
        activeKeyRef.current === requestKey
      ) {
        setSnapshot({ modules, quizzes, confidence, cases, videos });
        setLoadedKey(requestKey);
      }
    } catch {
      if (
        requestId === requestIdRef.current &&
        activeKeyRef.current === requestKey
      ) {
        setSnapshot(emptySnapshot);
        setLoadedKey(requestKey);
      }
    }
  }, [learnerPreview, user]);

  useEffect(() => {
    setSnapshot(emptySnapshot);
    void refresh();
    return () => {
      requestIdRef.current += 1;
    };
  }, [activeKey, refresh]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      snapshot,
      loading: loadedKey !== activeKey,
      refresh,
    }),
    [activeKey, loadedKey, refresh, snapshot],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
