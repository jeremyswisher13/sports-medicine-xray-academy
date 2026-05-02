import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';
import { useAuth } from '../../context/AuthContext';

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/modules', label: 'Modules' },
  { to: '/cases', label: 'Cases' },
  { to: '/videos', label: 'Videos' },
  { to: '/progress', label: 'Progress' },
];

export function Header() {
  const { user, signOut, learnerPreview, isAdminAccount, setLearnerPreview } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === '/login') return null;

  const navItems =
    user?.role === 'admin' && !learnerPreview
      ? [...baseNavItems, { to: '/admin', label: 'Admin' }]
      : baseNavItems;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
            <Logo size={32} />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-ucla-900 leading-tight">
                Sports Medicine X-Ray Academy
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                UCLA Sports Medicine
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-xl px-3 py-2 text-sm font-medium no-underline transition-colors',
                    isActive
                      ? 'bg-ucla-50 text-ucla-900'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAdminAccount && (
              <button
                type="button"
                onClick={() => setLearnerPreview(!learnerPreview)}
                className={[
                  'hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:inline-flex',
                  learnerPreview
                    ? 'border-gold-200 bg-gold-50 text-gold-900 hover:bg-gold-100'
                    : 'border-ucla-100 bg-ucla-50 text-ucla-900 hover:bg-ucla-100',
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
              <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-2 py-1.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ucla-100 text-ucla-800 text-xs font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="hidden md:block">
                  <div className="text-[12px] font-semibold leading-tight text-slate-800">
                    {user.displayName}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide leading-tight text-slate-500">
                    {learnerPreview ? 'previewing learner' : user.role}
                  </div>
                </div>
              </div>
            )}
            {user && (
              <button
                type="button"
                onClick={() => signOut()}
                className="hidden sm:inline-flex btn-ghost"
                aria-label="Sign out"
              >
                <Icon name="logout" size={14} />
              </button>
            )}
            <button
              type="button"
              className="lg:hidden btn-ghost"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" size={18} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden pb-3 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {isAdminAccount && (
                <button
                  type="button"
                  onClick={() => setLearnerPreview(!learnerPreview)}
                  className={[
                    'mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold',
                    learnerPreview
                      ? 'bg-gold-50 text-gold-900'
                      : 'bg-ucla-50 text-ucla-900',
                  ].join(' ')}
                  aria-pressed={learnerPreview}
                >
                  <Icon name={learnerPreview ? 'eye' : 'shield'} size={15} />
                  {learnerPreview
                    ? 'Viewing as a learner'
                    : 'Viewing with admin bypass'}
                </button>
              )}
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-xl px-3 py-2 text-sm font-medium no-underline',
                      isActive
                        ? 'bg-ucla-50 text-ucla-900'
                        : 'text-slate-600 hover:bg-slate-100',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
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
