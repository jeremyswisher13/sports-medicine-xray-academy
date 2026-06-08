import { useEffect, useState } from 'react';

export interface ModuleSection {
  id: string;
  label: string;
}

interface Props {
  sections: ModuleSection[];
  className?: string;
}

// A sticky "on this page" rail for the single-scroll module. Tapping a chip
// smooth-scrolls to that section; a scroll-spy highlights wherever you are so
// you always know your place without the page being chopped into tabs.
export function ModuleSectionRail({ sections, className = '' }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Account for the sticky site header + this rail (~118px) at the top, and
      // bias toward the section occupying the upper portion of the viewport.
      { rootMargin: '-130px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav
      className={[
        'sticky top-[68px] z-10 -mx-4 border-b border-slate-200/70 bg-white/90 px-2 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:shadow-soft',
        className,
      ].join(' ')}
      aria-label="On this page"
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(section.id)}
                aria-current={active ? 'true' : undefined}
                className={[
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-ucla-600 text-white'
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
