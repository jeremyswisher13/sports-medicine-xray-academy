import { useMemo, useRef, useState } from 'react';
import { getImage } from '../../data/images';
import { Icon } from '../ui/Icon';
import type {
  ModuleTrainerData,
  TrainerCheckItem,
  TrainerTourStep,
} from '../../data/anatomyTrainer';

interface Props {
  moduleId: string;
  data: ModuleTrainerData;
}

type Sel = { kind: 'tour' | 'check'; idx: number };

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

// Admin-only authoring workbench. Drag each marker onto the structure, then
// "Copy JSON" to commit the exact coordinates back into anatomyTrainer.ts.
// Working state is kept in localStorage so adjustments survive a refresh.
export function MarkerAdjuster({ moduleId, data }: Props) {
  const storeKey = `sxra:trainer-adjust:${moduleId}`;
  const baseSig = useMemo(
    () => JSON.stringify({ t: data.tour, c: data.check }),
    [data],
  );

  const [tour, setTour] = useState<TrainerTourStep[]>(
    () => loadDraft(storeKey, baseSig).tour ?? structuredClone(data.tour),
  );
  const [check, setCheck] = useState<TrainerCheckItem[]>(
    () => loadDraft(storeKey, baseSig).check ?? structuredClone(data.check),
  );
  const [sel, setSel] = useState<Sel>({ kind: 'tour', idx: 0 });
  const [copied, setCopied] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const dragIdx = useRef<number | null>(null);

  function persist(nt: TrainerTourStep[], nc: TrainerCheckItem[]) {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ baseSig, tour: nt, check: nc }));
    } catch {
      /* ignore */
    }
  }

  const item = sel.kind === 'tour' ? tour[sel.idx] : check[sel.idx];
  const imageKey = item?.imageKey ?? '';
  const entry = imageKey ? getImage(imageKey) : undefined;
  const markers =
    !item
      ? []
      : sel.kind === 'tour'
        ? (item as TrainerTourStep).markers
        : [{ x: (item as TrainerCheckItem).marker.x, y: (item as TrainerCheckItem).marker.y }];

  function moveMarker(markerIdx: number, clientX: number, clientY: number) {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    const x = round1(clamp(((clientX - box.left) / box.width) * 100));
    const y = round1(clamp(((clientY - box.top) / box.height) * 100));
    if (sel.kind === 'tour') {
      const nt = tour.map((s, i) => {
        if (i !== sel.idx) return s;
        const m = s.markers.map((mk, mi) => (mi === markerIdx ? { ...mk, x, y } : mk));
        return { ...s, markers: m };
      });
      setTour(nt);
      persist(nt, check);
    } else {
      const nc = check.map((c, i) => (i === sel.idx ? { ...c, marker: { x, y } } : c));
      setCheck(nc);
      persist(tour, nc);
    }
  }

  function onPointerDownMarker(markerIdx: number) {
    dragIdx.current = markerIdx;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragIdx.current === null) return;
    moveMarker(dragIdx.current, e.clientX, e.clientY);
  }
  function onPointerUp() {
    dragIdx.current = null;
  }
  // Click anywhere on the image to drop the (first) marker there.
  function onClickImage(e: React.PointerEvent) {
    if (dragIdx.current !== null) return;
    moveMarker(0, e.clientX, e.clientY);
  }

  function reset() {
    const t = structuredClone(data.tour);
    const c = structuredClone(data.check);
    setTour(t);
    setCheck(c);
    try {
      localStorage.removeItem(storeKey);
    } catch {
      /* ignore */
    }
  }

  function copyJson() {
    const payload = `// tour\n${JSON.stringify(tour, null, 2)}\n\n// check\n${JSON.stringify(check, null, 2)}`;
    void navigator.clipboard?.writeText(payload).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => undefined,
    );
  }

  const label =
    sel.kind === 'tour'
      ? (item as TrainerTourStep)?.title
      : `${(item as TrainerCheckItem)?.id} — answer: ${
          (item as TrainerCheckItem)?.options[(item as TrainerCheckItem)?.answer]
        }`;

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="section-title">Marker adjuster (admin)</div>
          <p className="mt-1 text-sm text-slate-600">
            Drag a marker (or click the film) to place it, then copy the JSON back into
            <code className="mx-1 rounded bg-slate-100 px-1 text-xs">anatomyTrainer.ts</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={reset}>
            Reset
          </button>
          <button type="button" className="btn-primary" onClick={copyJson}>
            <Icon name={copied ? 'check' : 'clipboard'} size={14} />
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          className={['pill', sel.kind === 'tour' ? 'pill-primary' : ''].join(' ')}
          onClick={() => setSel({ kind: 'tour', idx: 0 })}
        >
          Tour ({tour.length})
        </button>
        <button
          type="button"
          className={['pill', sel.kind === 'check' ? 'pill-primary' : ''].join(' ')}
          onClick={() => setSel({ kind: 'check', idx: 0 })}
        >
          Check ({check.length})
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div
          ref={boxRef}
          className="relative touch-none select-none overflow-hidden rounded-xl bg-black"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {entry ? (
            <img src={entry.src} alt="" draggable={false} className="block w-full" />
          ) : (
            <div className="grid aspect-[3/4] place-items-center text-sm text-slate-400">
              No image
            </div>
          )}
          {/* transparent click layer to drop marker 0 */}
          <div className="absolute inset-0" onPointerDown={onClickImage} />
          {markers.map((m, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                onPointerDownMarker(i);
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              aria-label={`Marker ${i + 1}`}
            >
              <span className="block h-6 w-6 rounded-full border-2 border-gold-400 bg-gold-400/30 shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400" />
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-ucla-900">{label || '—'}</div>
            <div className="mt-1 text-xs text-slate-500">
              {markers.map((m, i) => (
                <span key={i} className="mr-2 tabular-nums">
                  ({m.x}, {m.y})
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="btn-secondary"
              disabled={sel.idx === 0}
              onClick={() => setSel((s) => ({ ...s, idx: Math.max(0, s.idx - 1) }))}
            >
              <Icon name="chevron-left" size={14} />
              Prev
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {sel.idx + 1} / {sel.kind === 'tour' ? tour.length : check.length}
            </span>
            <button
              type="button"
              className="btn-secondary"
              disabled={sel.idx >= (sel.kind === 'tour' ? tour.length : check.length) - 1}
              onClick={() =>
                setSel((s) => ({
                  ...s,
                  idx: Math.min(
                    (s.kind === 'tour' ? tour.length : check.length) - 1,
                    s.idx + 1,
                  ),
                }))
              }
            >
              Next
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function loadDraft(
  key: string,
  baseSig: string,
): { tour?: TrainerTourStep[]; check?: TrainerCheckItem[] } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as {
      baseSig?: string;
      tour?: TrainerTourStep[];
      check?: TrainerCheckItem[];
    };
    if (parsed.baseSig !== baseSig) return {}; // stale draft vs newer committed content
    return { tour: parsed.tour, check: parsed.check };
  } catch {
    return {};
  }
}
