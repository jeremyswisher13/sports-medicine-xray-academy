import { useEffect, useState } from 'react';

export interface ModuleSection {
  id: string;
  label: string;
}

interface Props {
  sections: ModuleSection[];
  className?: string;
  onActiveChange?: (sectionId: string) => void;
}

// A sticky "on this page" rail for the single-scroll module. Tapping a chip
// smooth-scrolls to that section; a scroll-spy highlights wherever you are so
// you always know your place without the page being chopped into tabs.
export function ModuleSectionRail({ sections, className = '', onActiveChange }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (activeId) onActiveChange?.(activeId);
  }, [activeId, onActiveChange]);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    if (!ids.length) return;
    const OFFSET = 140; // sticky site header (68) + this rail + a little slack

    function onScroll() {
      // Active = the last section whose top has scrolled above the offset band.
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - OFFSET <= 1) current = id;
      }
      // At the very bottom of the page the last section may never reach the band,
      // so force it active so the rail isn't stuck on the prior section.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActiveId(current);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav
      className={[
        'sticky top-[67px] z-10 -mx-4 border-y border-slate-200/70 bg-[#F8FAFC]/95 px-2 py-2 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:bg-white/90',
        className,
      ].join(' ')}
      aria-label="On this page"
    >
      <ul className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(section.id)}
                aria-current={active ? 'location' : undefined}
                className={[
                  'inline-flex min-h-[36px] items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-ucla-700 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
                ].join(' ')}
              >
                {section.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
