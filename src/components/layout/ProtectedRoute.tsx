import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';

interface Props {
  children: ReactNode;
  requireRole?: 'admin';
}

export function ProtectedRoute({ children, requireRole }: Props) {
  const { user, loading, isAdminAccount } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Logo size={42} />
          <div className="text-sm">Loading…</div>
        </div>
      </div>
    );
  }

  if (!user) {
    const requestedPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" state={{ from: requestedPath }} replace />;
  }

  if (requireRole === 'admin' && !isAdminAccount) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
