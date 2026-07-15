import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';
import { useAuth } from '../../context/AuthContext';

const primaryNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/modules', label: 'Modules' },
  { to: '/progress', label: 'Progress' },
];

const resourceNavItems = [
  { to: '/cheatsheets', label: 'Cheat Sheets' },
  { to: '/cases', label: 'Cases' },
  { to: '/videos', label: 'Videos' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/atlas', label: 'Atlas' },
];

export function Header() {
  const { user, signOut, learnerPreview, isAdminAccount, setLearnerPreview } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const resourcesMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    resourcesMenuRef.current?.removeAttribute('open');
  }, [location.pathname]);

  if (location.pathname === '/login') return null;

  const primaryItems =
    user?.role === 'admin' && !learnerPreview
      ? [...primaryNavItems, { to: '/admin', label: 'Admin' }]
      : primaryNavItems;
  const resourcesActive = resourceNavItems.some((item) =>
    location.pathname.startsWith(item.to),
  );

  return (
    <header className="sticky top-0 z-30 border-b border-ucla-900/20 bg-ucla-800 pt-[env(safe-area-inset-top)] text-white shadow-elevated">
      <div className="h-[3px] gold-divider" aria-hidden />
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 rounded-lg border border-white/80 bg-white p-1 shadow-soft ring-1 ring-ucla-100/70 no-underline"
            aria-label="Sports Medicine X-Ray Academy dashboard"
          >
            <Logo size={36} variant="navy" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors',
                    isActive
                      ? 'bg-white text-ucla-900 shadow-soft'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <details ref={resourcesMenuRef} className="group relative">
              <summary
                className={[
                  'inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden',
                  resourcesActive
                    ? 'bg-white text-ucla-900 shadow-soft'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                Resources
                <Icon
                  name="chevron-down"
                  size={13}
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="absolute right-0 mt-2 grid min-w-48 gap-1 rounded-lg border border-ucla-100 bg-white p-2 text-slate-800 shadow-elevated">
                {resourceNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => resourcesMenuRef.current?.removeAttribute('open')}
                    className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-ucla-50 hover:text-ucla-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="flex items-center gap-2">
            {isAdminAccount && (
              <button
                type="button"
                onClick={() => setLearnerPreview(!learnerPreview)}
                className={[
                  'hidden min-h-11 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors sm:inline-flex',
                  learnerPreview
                    ? 'border-gold-300 bg-gold-500 text-ucla-900 hover:bg-gold-400'
                    : 'border-white/15 bg-white/10 text-white hover:bg-white/15',
                ].join(' ')}
                aria-pressed={learnerPreview}
                title={
                  learnerPreview
                    ? 'Switch back to admin mode'
                    : 'Preview the course as a fresh learner'
                }
              >
                <Icon name={learnerPreview ? 'eye' : 'shield'} size={13} />
                {learnerPreview ? 'Learner view' : 'Admin mode'}
              </button>
            )}
            {user && (
              <div className="hidden min-h-11 items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 sm:flex">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    decoding="async"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-ucla-900">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="hidden md:block">
                  <div className="text-[12px] font-semibold leading-tight text-white">
                    {user.displayName}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide leading-tight text-slate-300">
                    {learnerPreview ? 'previewing learner' : user.role}
                  </div>
                </div>
              </div>
            )}
            {user && (
              <button
                type="button"
                onClick={() => signOut()}
                className="hidden sm:inline-flex btn border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
                aria-label="Sign out"
              >
                <Icon name="logout" size={14} />
              </button>
            )}
            <button
              type="button"
              className="btn border-white/10 text-white hover:bg-white/10 lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={18} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="pb-3 animate-fade-in lg:hidden">
            <nav className="flex flex-col gap-1">
              {isAdminAccount && (
                <button
                  type="button"
                  onClick={() => setLearnerPreview(!learnerPreview)}
                  className={[
                    'mb-1 flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold',
                    learnerPreview
                      ? 'bg-gold-500 text-ucla-900'
                      : 'bg-white/10 text-white',
                  ].join(' ')}
                  aria-pressed={learnerPreview}
                >
                  <Icon name={learnerPreview ? 'eye' : 'shield'} size={15} />
                  {learnerPreview
                    ? 'Viewing as a learner'
                    : 'Viewing with admin bypass'}
                </button>
              )}
              {primaryItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium no-underline',
                      isActive
                        ? 'bg-white text-ucla-900'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 grid gap-1 border-t border-white/10 pt-2">
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Resources
                </div>
                {resourceNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium no-underline',
                        isActive
                          ? 'bg-white text-ucla-900'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="min-h-11 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
