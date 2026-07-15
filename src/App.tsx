import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileAppNav } from './components/layout/MobileAppNav';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PwaStatus } from './components/PwaStatus';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider, useProgress } from './hooks/useProgress';
import { hasCourseAssessment, hasPreviewCourseAssessment } from './utils/progress';
import { moduleSummaries } from './data/moduleSummaries';
import { LoginPage } from './pages/Login';
import { WelcomePage } from './pages/Welcome';
import { DashboardPage } from './pages/Dashboard';
import { ModulesPage } from './pages/Modules';

const ModuleDetailPage = lazy(() =>
  import('./pages/ModuleDetail').then((m) => ({ default: m.ModuleDetailPage })),
);
const CasesPage = lazy(() => import('./pages/Cases').then((m) => ({ default: m.CasesPage })));
const VideosPage = lazy(() => import('./pages/Videos').then((m) => ({ default: m.VideosPage })));
const QuizPage = lazy(() => import('./pages/Quiz').then((m) => ({ default: m.QuizPage })));
const ProgressPage = lazy(() =>
  import('./pages/Progress').then((m) => ({ default: m.ProgressPage })),
);
const FlashcardsPage = lazy(() =>
  import('./pages/Flashcards').then((m) => ({ default: m.FlashcardsPage })),
);
const CheatSheetsPage = lazy(() =>
  import('./pages/CheatSheets').then((m) => ({ default: m.CheatSheetsPage })),
);
const CheatSheetPage = lazy(() =>
  import('./pages/CheatSheet').then((m) => ({ default: m.CheatSheetPage })),
);
const AtlasPage = lazy(() => import('./pages/Atlas').then((m) => ({ default: m.AtlasPage })));
const LearnerSummaryPage = lazy(() =>
  import('./pages/LearnerSummary').then((m) => ({ default: m.LearnerSummaryPage })),
);
const AdminPage = lazy(() => import('./pages/Admin').then((m) => ({ default: m.AdminPage })));

function RouteFallback() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="card mx-auto max-w-md p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ucla-700">
          Loading
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-ucla-800" />
        </div>
      </div>
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function RouteScrollManager() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
}

function ProtectedShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hideMobileNav =
    location.pathname === '/welcome' ||
    location.pathname.startsWith('/quiz') ||
    location.pathname.startsWith('/admin');

  return (
    <ProtectedRoute>
      <div className="flex min-h-[100dvh] flex-col">
        <Header />
        <main
          className={[
            'flex-1',
            hideMobileNav ? '' : 'pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0',
          ].join(' ')}
        >
          {children}
        </main>
        {!hideMobileNav && <MobileAppNav />}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

function CourseOutcomeGate({ children }: { children: ReactNode }) {
  const { learnerPreview, isAdminAccount } = useAuth();
  const { snapshot, loading } = useProgress();

  if (learnerPreview || isAdminAccount) return <>{children}</>;
  if (loading) return <RouteFallback />;

  const baselineComplete = hasCourseAssessment(
    snapshot.quizzes,
    snapshot.confidence,
    'pre',
  );
  const coreModuleIds = moduleSummaries
    .filter((module) => module.status === 'full')
    .map((module) => module.id);
  const completedModuleIds = new Set(
    snapshot.modules
      .filter((module) => module.completed)
      .map((module) => module.moduleId),
  );
  const courseComplete =
    coreModuleIds.length > 0 && coreModuleIds.every((id) => completedModuleIds.has(id));

  if (!baselineComplete) return <Navigate to="/quiz/pre" replace />;
  if (!courseComplete) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function CourseBaselineGate({ children }: { children: ReactNode }) {
  const { learnerPreview, isAdminAccount } = useAuth();
  const { snapshot, loading } = useProgress();
  const location = useLocation();
  const requestedPath = `${location.pathname}${location.search}${location.hash}`;

  if (isAdminAccount && !learnerPreview) return <>{children}</>;
  if (loading) return <RouteFallback />;

  const baselineComplete = hasCourseAssessment(
    snapshot.quizzes,
    snapshot.confidence,
    'pre',
  ) || (learnerPreview && hasPreviewCourseAssessment('pre'));

  if (!baselineComplete) {
    return <Navigate to="/quiz/pre" state={{ from: requestedPath }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <PwaStatus />
          <RouteScrollManager />
          <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/welcome"
            element={
              <ProtectedShell>
                <WelcomePage />
              </ProtectedShell>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedShell>
                <DashboardPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/modules"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <ModulesPage />
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/modules/:moduleId"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <ModuleDetailPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <CasesPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <VideosPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/quiz/pre"
            element={
              <ProtectedShell>
                <LazyPage>
                  <QuizPage scope="pre" />
                </LazyPage>
              </ProtectedShell>
            }
          />
          <Route
            path="/quiz/post"
            element={
              <ProtectedShell>
                <CourseOutcomeGate>
                  <LazyPage>
                    <QuizPage scope="post" />
                  </LazyPage>
                </CourseOutcomeGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <ProgressPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <FlashcardsPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/cheatsheets"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <CheatSheetsPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/atlas"
            element={
              <ProtectedShell>
                <CourseBaselineGate>
                  <LazyPage>
                    <AtlasPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedShell>
            }
          />
          <Route
            path="/modules/:moduleId/cheatsheet"
            element={
              <ProtectedRoute>
                <CourseBaselineGate>
                  <LazyPage>
                    <CheatSheetPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress/summary"
            element={
              <ProtectedRoute>
                <CourseBaselineGate>
                  <LazyPage>
                    <LearnerSummaryPage />
                  </LazyPage>
                </CourseBaselineGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <div className="flex min-h-[100dvh] flex-col">
                  <Header />
                  <main className="flex-1">
                    <LazyPage>
                      <AdminPage />
                    </LazyPage>
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}
