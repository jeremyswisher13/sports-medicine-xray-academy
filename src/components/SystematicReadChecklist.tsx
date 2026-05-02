import { useMemo, useState } from 'react';
import { Icon } from './ui/Icon';
import type { SystematicChecklistItem } from '../types';

interface Props {
  items: SystematicChecklistItem[];
  storageKey?: string;
  onChangeChecked?: (checkedKeys: string[]) => void;
  defaultExpandedAll?: boolean;
}

export function SystematicReadChecklist({
  items,
  storageKey,
  onChangeChecked,
  defaultExpandedAll = false,
}: Props) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (!storageKey) return new Set();
    try {
      const raw = localStorage.getItem(`sxra:checklist:${storageKey}`);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
    return new Set();
  });

  const [openSteps, setOpenSteps] = useState<Set<string>>(
    () => new Set(defaultExpandedAll ? items.map((i) => i.step) : items.map((i) => i.step)),
  );

  const totalPrompts = useMemo(
    () => items.reduce((acc, i) => acc + i.prompts.length, 0),
    [items],
  );

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      const arr = Array.from(next);
      if (storageKey) {
        try {
          localStorage.setItem(`sxra:checklist:${storageKey}`, JSON.stringify(arr));
        } catch {
          // ignore
        }
      }
      onChangeChecked?.(arr);
      return next;
    });
  }

  function toggleStep(step: string) {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <div>
          <div className="section-title">Systematic X-Ray Read</div>
          <p className="text-xs text-slate-500">
            Confirm → Alignment → Bone → Cartilage → Soft Tissues → Impression
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 tabular-nums">
          {checked.size} / {totalPrompts}
        </div>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => {
          const open = openSteps.has(item.step);
          const stepChecked = item.prompts.filter((p) =>
            checked.has(`${item.step}:${p}`),
          ).length;
          return (
            <li key={item.step} className="px-5 py-3">
              <button
                type="button"
                onClick={() => toggleStep(item.step)}
                className="flex w-full items-center justify-between text-left"
                aria-expanded={open}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                      stepChecked === item.prompts.length
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-ucla-50 text-ucla-800',
                    ].join(' ')}
                  >
                    {stepChecked === item.prompts.length ? (
                      <Icon name="check" size={14} />
                    ) : (
                      stepChecked
                    )}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">{item.step}</div>
                    <div className="text-xs text-slate-500">
                      {item.prompts.length} prompts
                    </div>
                  </div>
                </div>
                <span
                  className={[
                    'transition-transform text-slate-400',
                    open ? 'rotate-180' : '',
                  ].join(' ')}
                >
                  <Icon name="chevron-down" size={16} />
                </span>
              </button>
              {open && (
                <ul className="mt-2 space-y-1.5 pl-10">
                  {item.prompts.map((p) => {
                    const key = `${item.step}:${p}`;
                    const isChecked = checked.has(key);
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                          <span
                            className={[
                              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                              isChecked
                                ? 'border-ucla-700 bg-ucla-700 text-white'
                                : 'border-slate-300 bg-white',
                            ].join(' ')}
                          >
                            {isChecked && <Icon name="check" size={12} />}
                          </span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isChecked}
                            onChange={() => toggle(key)}
                          />
                          <span className="text-sm text-slate-700 leading-snug">{p}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
