import { useEffect, useRef } from 'react';

interface TabItem {
  id: string;
  label: string;
}

interface Props {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

export function Tabs({ items, active, onChange, ariaLabel = 'Module sections' }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab-id="${active}"]`,
    );
    el?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }, [active]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scroll-smooth"
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-tab-id={item.id}
            onClick={() => onChange(item.id)}
            className={[
              'whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-ucla-800 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
