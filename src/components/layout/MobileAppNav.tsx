import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../ui/Icon';

const items: { to: string; label: string; icon: IconName }[] = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/modules', label: 'Modules', icon: 'book-open' },
  { to: '/flashcards', label: 'Cards', icon: 'sparkles' },
  { to: '/cheatsheets', label: 'Sheets', icon: 'clipboard' },
];

export function MobileAppNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 shadow-elevated backdrop-blur lg:hidden"
      aria-label="Primary app navigation"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex min-h-[48px] flex-col items-center justify-center rounded-lg px-2 text-[11px] font-semibold no-underline transition-colors',
                  isActive
                    ? 'bg-ucla-700 text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              <Icon name={item.icon} size={17} />
              <span className="mt-0.5">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
