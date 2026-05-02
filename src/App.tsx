import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/Login';
import { WelcomePage } from './pages/Welcome';
import { DashboardPage } from './pages/Dashboard';
import { ModulesPage } from './pages/Modules';
import { ModuleDetailPage } from './pages/ModuleDetail';
import { CasesPage } from './pages/Cases';
import { VideosPage } from './pages/Videos';
import { QuizPage } from './pages/Quiz';
import { ProgressPage } from './pages/Progress';
import { FlashcardsPage } from './pages/Flashcards';
import { CheatSheetsPage } from './pages/CheatSheets';
import { CheatSheetPage } from './pages/CheatSheet';
import { AtlasPage } from './pages/Atlas';
import { AdminPage } from './pages/Admin';

function ProtectedShell({ children }: { children: React.ReactNode }) {
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
                <ModulesPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/modules/:moduleId"
            element={
              <ProtectedShell>
                <ModuleDetailPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedShell>
                <CasesPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedShell>
                <VideosPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/quiz/pre"
            element={
              <ProtectedShell>
                <QuizPage scope="pre" />
              </ProtectedShell>
            }
          />
          <Route
            path="/quiz/post"
            element={
              <ProtectedShell>
                <QuizPage scope="post" />
              </ProtectedShell>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedShell>
                <ProgressPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedShell>
                <FlashcardsPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/cheatsheets"
            element={
              <ProtectedShell>
                <CheatSheetsPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/atlas"
            element={
              <ProtectedShell>
                <AtlasPage />
              </ProtectedShell>
            }
          />
          <Route
            path="/modules/:moduleId/cheatsheet"
            element={
              <ProtectedRoute>
                <CheatSheetPage />
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
                    <AdminPage />
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
