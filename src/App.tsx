import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProgress } from './hooks/useProgress';
import { hasCourseAssessment, hasPreviewCourseAssessment } from './utils/progress';
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

function ProtectedShell({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
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
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
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
                <LazyPage>
                  <CasesPage />
                </LazyPage>
              </ProtectedShell>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedShell>
                <LazyPage>
                  <VideosPage />
                </LazyPage>
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
                <LazyPage>
                  <QuizPage scope="post" />
                </LazyPage>
              </ProtectedShell>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedShell>
                <LazyPage>
                  <ProgressPage />
                </LazyPage>
              </ProtectedShell>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedShell>
                <LazyPage>
                  <FlashcardsPage />
                </LazyPage>
              </ProtectedShell>
            }
          />
          <Route
            path="/cheatsheets"
            element={
              <ProtectedShell>
                <LazyPage>
                  <CheatSheetsPage />
                </LazyPage>
              </ProtectedShell>
            }
          />
          <Route
            path="/atlas"
            element={
              <ProtectedShell>
                <LazyPage>
                  <AtlasPage />
                </LazyPage>
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
                <LazyPage>
                  <LearnerSummaryPage />
                </LazyPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <div className="flex min-h-screen flex-col">
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
    </AuthProvider>
  );
}
