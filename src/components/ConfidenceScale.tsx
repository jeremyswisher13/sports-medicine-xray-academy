interface Props {
  value?: 1 | 2 | 3 | 4 | 5;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  label?: string;
  description?: string;
  compact?: boolean;
}

const labels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Not confident',
  2: 'Slightly confident',
  3: 'Moderately confident',
  4: 'Very confident',
  5: 'Ready to apply clinically',
};

export function ConfidenceScale({ value, onChange, label, description, compact = false }: Props) {
  return (
    <div className={compact ? '' : 'card p-5'}>
      {label && <div className="text-sm font-semibold text-slate-900">{label}</div>}
      {description && (
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{description}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {([1, 2, 3, 4, 5] as const).map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(n)}
              className={[
                'flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-center transition-colors',
                selected
                  ? 'border-ucla-600 bg-ucla-600 text-white shadow-soft'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              <span className="text-base font-bold">{n}</span>
              <span className={['text-[10px] leading-tight', selected ? 'text-white/80' : 'text-slate-500'].join(' ')}>
                {labels[n].split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
      {value && (
        <p className="mt-2 text-xs text-slate-500">{labels[value]}</p>
      )}
    </div>
  );
}
