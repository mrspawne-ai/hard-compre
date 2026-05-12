import type { ComputerModel, SpecRow } from '../types';

// ─── Spec rows definition ─────────────────────────────────────────────────────
const SPEC_ROWS: SpecRow[] = [
  { key: 'price',            label: 'Price',             unit: '$',    higherIsBetter: false, format: 'currency' },
  { key: 'cpu',              label: 'Processor',         unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'ram',              label: 'Memory',            unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'gpu',              label: 'Graphics',          unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'storage',          label: 'Storage',           unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'display',          label: 'Display',           unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'battery',          label: 'Battery',           unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'weight',           label: 'Weight',            unit: '',     higherIsBetter: false, format: 'text' },
  { key: 'performanceScore', label: 'Performance Score', unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'efficiencyScore',  label: 'Efficiency Score',  unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'valueScore',       label: 'Value Score',       unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'batteryScore',     label: 'Battery Score',     unit: '/100', higherIsBetter: true,  format: 'score' },
  { key: 'ports',            label: 'Ports',             unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'os',               label: 'Operating System',  unit: '',     higherIsBetter: true,  format: 'text' },
  { key: 'releaseYear',      label: 'Release Year',      unit: '',     higherIsBetter: true,  format: 'text' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getNumericValue(model: ComputerModel, key: string): number | null {
  const v = (model as unknown as Record<string, unknown>)[key];
  if (typeof v === 'number') return v;
  return null;
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

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mt-1 h-1.5 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden w-full">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${pct}%` }}
        role="presentation"
      />
    </div>
  );
}

// ─── CompareTable ─────────────────────────────────────────────────────────────
interface CompareTableProps {
  models: ComputerModel[];
  onRemove?: (id: string) => void;
}

const SCORE_KEYS = new Set(['performanceScore', 'efficiencyScore', 'valueScore', 'batteryScore']);
const BAR_COLORS = ['bg-apple-blue', 'bg-apple-indigo', 'bg-purple-500', 'bg-teal-500'];

export default function CompareTable({ models, onRemove }: CompareTableProps) {
  if (models.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto rounded-3xl liquid-glass">
      <table className="w-full text-sm border-collapse" role="table" aria-label="Hardware comparison table">
        {/* ── Header ── */}
        <thead>
          <tr>
            <th className="sticky left-0 z-10 liquid-glass p-4 text-left text-xs font-semibold text-apple-gray uppercase tracking-widest w-36 min-w-36" scope="col">
              Spec
            </th>
            {models.map((m, i) => (
              <th key={m.id} scope="col" className="p-4 min-w-48 text-center">
                <div className="flex flex-col items-center gap-2">
                  {/* Icon */}
                  <span
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-3xl shadow-md`}
                    aria-hidden="true"
                  >
                    {m.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-apple-dark dark:text-apple-light leading-tight text-sm">{m.name}</p>
                    <p className="text-xs text-apple-gray dark:text-apple-mid-gray">{m.brand}</p>
                    {m.badge && (
                      <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-apple-blue/12 text-apple-blue">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(m.id)}
                      aria-label={`Remove ${m.name} from comparison`}
                      className="text-[11px] text-apple-gray hover:text-apple-red transition-colors duration-150"
                    >
                      Remove
                    </button>
                  )}
                  <div className={`w-full h-0.5 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} aria-hidden="true" />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {SPEC_ROWS.map((row, rowIdx) => {
            // Skip score rows that have no values
            if (SCORE_KEYS.has(row.key) && models.every(m => getNumericValue(m, row.key) === null)) return null;
            // Skip non-score text rows that have no values in any model
            const allEmpty = models.every(m => {
              const v = (m as unknown as Record<string, unknown>)[row.key];
              return v === undefined || v === null || v === '';
            });
            if (allEmpty) return null;

            const bestIdx = getBestIndex(models, row.key, row.higherIsBetter);

            return (
              <tr
                key={row.key}
                className={`border-t border-black/5 dark:border-white/5 ${rowIdx % 2 === 0 ? '' : 'bg-black/2 dark:bg-white/2'}`}
              >
                {/* Label cell */}
                <td className="sticky left-0 z-10 liquid-glass p-4 text-xs font-medium text-apple-gray dark:text-apple-mid-gray uppercase tracking-wide">
                  {row.label}
                </td>

                {/* Value cells */}
                {models.map((m, colIdx) => {
                  const isWinner = bestIdx === colIdx;
                  const numVal = getNumericValue(m, row.key);
                  const displayVal = formatValue(m, row);

                  return (
                    <td key={m.id} className="p-4 text-center align-top">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`font-medium leading-snug ${
                            isWinner && models.length > 1
                              ? 'text-apple-blue font-semibold'
                              : 'text-apple-dark dark:text-apple-light'
                          }`}
                        >
                          {displayVal}
                          {isWinner && models.length > 1 && (
                            <span className="ml-1 text-[10px] font-bold text-apple-blue" aria-label="Best value">★</span>
                          )}
                        </span>

                        {/* Score bar for numeric score keys */}
                        {SCORE_KEYS.has(row.key) && numVal !== null && (
                          <ScoreBar value={numVal} color={BAR_COLORS[colIdx % BAR_COLORS.length]} />
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
