import type { ComputerModel, SpecRow } from '../types';

const SPEC_ROWS: SpecRow[] = [
  { key: 'price',            label: 'Price',       unit: '$',    higherIsBetter: false, format: 'currency' },
  { key: 'cpu',              label: 'Processor',   unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'ram',              label: 'Memory',      unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'gpu',              label: 'Graphics',    unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'storage',          label: 'Storage',     unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'display',          label: 'Display',     unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'battery',          label: 'Battery',     unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'weight',           label: 'Weight',      unit: '',     higherIsBetter: false, format: 'text' },
  { key: 'performanceScore', label: 'Perf Score',  unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'efficiencyScore',  label: 'Eff Score',   unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'valueScore',       label: 'Value Score', unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'batteryScore',     label: 'Batt Score',  unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'ports',            label: 'Ports',       unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'os',               label: 'OS',          unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'releaseYear',      label: 'Year',        unit: '',     higherIsBetter: true,  format: 'text' },
];

function getNumericValue(model: ComputerModel, key: string): number | null {
  const v = (model as unknown as Record<string, unknown>)[key];
  return typeof v === 'number' ? v : null;
}

function getBestIndex(models: ComputerModel[], key: string, higherIsBetter: boolean): number {
  const nums = models.map(m => getNumericValue(m, key));
  if (nums.every(n => n === null)) return -1;
  let best = -1;
  let bestVal = higherIsBetter ? -Infinity : Infinity;
  nums.forEach((n, i) => {
    if (n === null) return;
    if (higherIsBetter ? n > bestVal : n < bestVal) { bestVal = n; best = i; }
  });
  return best;
}

function formatValue(model: ComputerModel, row: SpecRow): string {
  const v = (model as unknown as Record<string, unknown>)[row.key];
  if (v === undefined || v === null || v === '') return '—';
  if (row.format === 'currency') return `$${(v as number).toLocaleString()}`;
  return String(v);
}

const ACCENT_COLORS = ['#0066ff', '#00e87d', '#ff6600', '#ff2244'];

function ScoreBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(100, Math.round(value));
  return (
    <div className="mt-1 h-1.5 bg-black/8 dark:bg-white/8 overflow-hidden w-full">
      <div style={{ width: `${pct}%`, background: color, height: '100%', transition: 'width 0.5s ease' }} />
    </div>
  );
}

interface CompareTableProps {
  models: ComputerModel[];
  onRemove?: (id: string) => void;
}

const SCORE_KEYS = new Set(['performanceScore', 'efficiencyScore', 'valueScore', 'batteryScore']);

export default function CompareTable({ models, onRemove }: CompareTableProps) {
  if (models.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto liquid-glass">
      <table className="w-full text-xs border-collapse" role="table" aria-label="Hardware comparison">
        <thead>
          <tr className="border-b border-black/10 dark:border-white/8">
            <th
              className="sticky left-0 z-10 liquid-glass p-3 text-left text-[0.55rem] font-black text-apple-gray uppercase tracking-widest w-28 min-w-28"
              scope="col"
            >
              Spec
            </th>
            {models.map((m, i) => (
              <th key={m.id} scope="col" className="p-3 min-w-44 text-center border-l border-black/8 dark:border-white/5">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="ascii-icon w-12 h-8 text-[0.6rem]"
                    style={{ color: ACCENT_COLORS[i % ACCENT_COLORS.length], borderColor: ACCENT_COLORS[i % ACCENT_COLORS.length] }}
                    aria-hidden="true"
                  >
                    {(m.subtype ?? m.type ?? 'DEV').slice(0, 3).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-bold text-apple-dark dark:text-apple-light text-[0.75rem] leading-tight">{m.name}</p>
                    <p className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-wide mt-0.5">{m.brand}</p>
                    {m.badge && (
                      <span className="label-chip text-apple-orange border-apple-orange mt-1">{m.badge}</span>
                    )}
                  </div>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(m.id)}
                      aria-label={`Remove ${m.name}`}
                      className="text-[0.58rem] font-bold uppercase tracking-widest text-apple-gray hover:text-apple-red transition-colors duration-150 border border-current px-2 py-0.5"
                    >
                      Remove
                    </button>
                  )}
                  <div style={{ width: '100%', height: '2px', background: ACCENT_COLORS[i % ACCENT_COLORS.length] }} aria-hidden="true" />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {SPEC_ROWS.map((row, rowIdx) => {
            if (SCORE_KEYS.has(row.key) && models.every(m => getNumericValue(m, row.key) === null)) return null;
            const allEmpty = models.every(m => {
              const v = (m as unknown as Record<string, unknown>)[row.key];
              return v === undefined || v === null || v === '';
            });
            if (allEmpty) return null;

            const bestIdx = getBestIndex(models, row.key, row.higherIsBetter);

            return (
              <tr
                key={row.key}
                className={`border-t border-black/5 dark:border-white/4 ${rowIdx % 2 === 1 ? 'bg-black/[0.015] dark:bg-white/[0.015]' : ''}`}
              >
                <td className="sticky left-0 z-10 liquid-glass p-3 text-[0.58rem] font-black text-apple-gray uppercase tracking-widest">
                  {row.label}
                </td>

                {models.map((m, colIdx) => {
                  const isWinner = bestIdx === colIdx;
                  const numVal = getNumericValue(m, row.key);
                  const displayVal = formatValue(m, row);
                  const accent = ACCENT_COLORS[colIdx % ACCENT_COLORS.length];

                  return (
                    <td key={m.id} className="p-3 text-center align-top border-l border-black/5 dark:border-white/4">
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`font-bold leading-snug text-[0.75rem] ${
                            isWinner && models.length > 1
                              ? 'font-black'
                              : 'text-apple-dark dark:text-apple-light'
                          }`}
                          style={isWinner && models.length > 1 ? { color: accent } : undefined}
                        >
                          {displayVal}
                          {isWinner && models.length > 1 && (
                            <span className="ml-1 text-[0.55rem] font-black" aria-label="Best">▲</span>
                          )}
                        </span>

                        {SCORE_KEYS.has(row.key) && numVal !== null && (
                          <ScoreBar value={numVal} color={accent} />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
