import { modulePhases } from '../data/learningFlow';
import { Icon } from './ui/Icon';

interface Props {
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  completedPhaseIds?: string[];
  className?: string;
}

// A lightweight, sticky row of phase tabs. Replaces the big "one task right
// now" panel + the repeated module header so the actual content leads on every
// screen. Horizontally scrollable on phones.
export function ModulePhaseNav({
  activePhaseId,
  onPhaseChange,
  completedPhaseIds = [],
  className = '',
}: Props) {
  const done = new Set(completedPhaseIds);
  return (
    <nav
      className={[
        'sticky top-[68px] z-10 -mx-4 border-b border-slate-200/70 bg-white/90 px-2 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:shadow-soft',
        className,
      ].join(' ')}
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {modulePhases.map((phase, index) => {
          const active = phase.id === activePhaseId;
          const complete = done.has(phase.id);
          return (
            <li key={phase.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onPhaseChange(phase.id)}
                aria-current={active ? 'step' : undefined}
                className={[
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-ucla-600 text-white'
                    : complete
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    active
                      ? 'bg-white/25 text-white'
                      : complete
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {complete && !active ? <Icon name="check" size={11} /> : index + 1}
                </span>
                {phase.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
