import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';

interface DisclosureProps {
  /** The label shown on the toggle button. */
  summary: string;
  /** Optional secondary line under the summary. */
  description?: string;
  /** Start expanded. Defaults to collapsed (the whole point). */
  defaultOpen?: boolean;
  /**
   * `boxed` wraps the disclosure in a bordered card — use for plain text/list
   * content. The default (bare) is a clean toggle row, best when the children
   * are themselves cards/callouts (avoids a double border).
   */
  boxed?: boolean;
  children: ReactNode;
}

// A single, consistent progressive-disclosure affordance. Leading the screen
// with the high-yield core and tucking exhaustive reference behind one of these
// is the spine of the calmer module layout.
export function Disclosure({
  summary,
  description,
  defaultOpen = false,
  boxed = false,
  children,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);

  const header = (
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      aria-expanded={open}
      className={[
        'flex w-full items-center justify-between gap-3 text-left transition-colors',
        boxed
          ? 'px-4 py-3 hover:bg-slate-50/80'
          : 'rounded-lg px-2 py-2 hover:bg-slate-50',
      ].join(' ')}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ucla-800">{summary}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
        )}
      </span>
      <Icon
        name="chevron-down"
        size={16}
        className={[
          'shrink-0 text-slate-400 transition-transform',
          open ? 'rotate-180' : '',
        ].join(' ')}
      />
    </button>
  );

  if (boxed) {
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-soft">
        {header}
        {open && (
          <div className="border-t border-slate-100 p-4 animate-fade-in">{children}</div>
        )}
      </section>
    );
  }

  return (
    <div>
      {header}
      {open && <div className="mt-2 animate-fade-in">{children}</div>}
    </div>
  );
}
