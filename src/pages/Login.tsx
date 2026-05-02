import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../context/AuthContext';
import { firebaseEnabled } from '../services/firebase';

export function LoginPage() {
  const { user, signInGoogle, signInGuest, error, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/welcome', { replace: true });
    }
  }, [user, loading, navigate]);

  async function handleGoogle() {
    setSubmitting(true);
    try {
      await signInGoogle();
    } catch {
      // surface via context error
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGuest() {
    setSubmitting(true);
    try {
      await signInGuest();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container-page flex min-h-screen items-center justify-center py-12">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <Logo size={42} />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ucla-700">
                  UCLA Sports Medicine
                </div>
                <div className="text-base font-semibold text-ucla-900">
                  Jeremy Swisher, MD
                </div>
              </div>
            </div>
            <h1 className="mt-6 text-4xl text-balance">
              Sports Medicine X-Ray Academy
            </h1>
            <p className="mt-3 max-w-prose text-slate-600 leading-relaxed">
              High-Yield Musculoskeletal Radiograph Interpretation for UCLA family medicine
              residents and sports medicine fellows. Practical, pattern-recognition focused,
              and clinic-ready.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-slate-700">
              {[
                'A reproducible Systematic X-Ray Read',
                'Sports-medicine specific case practice',
                'Pre/post knowledge and confidence assessment',
                'Curated supplemental AMSSM video library',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ucla-50 text-ucla-700">
                    <Icon name="check" size={12} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3 lg:hidden">
              <Logo size={36} />
              <div className="text-base font-semibold text-ucla-900">
                Sports Medicine X-Ray Academy
              </div>
            </div>
            <h2 className="mt-2 text-center text-2xl text-balance lg:text-left">
              Sign in to continue
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600 lg:text-left">
              Use your UCLA Google account.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={submitting}
                className="btn-primary w-full"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={handleGuest}
                disabled={submitting}
                className="btn-secondary w-full"
              >
                <Icon name="user" size={14} />
                Continue as guest
              </button>
              {!firebaseEnabled && (
                <p className="text-center text-xs text-slate-500">
                  Firebase isn't configured — running in local-only mode.
                </p>
              )}
              {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center text-sm text-rose-800">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
              By signing in, you agree to use this tool for clinician education.{' '}
              <Link to="/welcome" className="underline">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#FFC107"
        d="M21.8 12.2c0-.7 0-1.3-.2-2H12v3.8h5.5c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5Z"
      />
      <path
        fill="#FF3D00"
        d="M12 22c2.7 0 5-1 6.7-2.4l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#4CAF50"
        d="M6.4 13.9A6 6 0 0 1 6 12c0-.7.1-1.3.4-2V7.4H3a10 10 0 0 0 0 9.2l3.4-2.7Z"
      />
      <path
        fill="#1976D2"
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3 14.7 2 12 2A10 10 0 0 0 3 7.4l3.4 2.6C7.2 7.7 9.4 6 12 6Z"
      />
    </svg>
  );
}
