import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { LAPTOPS } from '../lib/data';

// ─── Ecosystem data ───────────────────────────────────────────────────────────
const MAC_PROS = [
  'Best-in-class performance per watt',
  'macOS — polished, stable, secure',
  'Apple Silicon: unified memory, incredible efficiency',
  'MagSafe, Thunderbolt 4, 3.5 mm',
  'Stellar trackpad + keyboard',
  'Up to 22 hrs battery life',
  'Best-in-class resale value',
];

const PC_PROS = [
  'Wider hardware choice at every price',
  'Windows 11 — broadest app & game compatibility',
  'Upgradeable RAM & storage (most models)',
  'NVIDIA / AMD GPU options for gaming & ML',
  'More display refresh rate options (up to 240 Hz)',
  'Price-performance sweet spot for budget builds',
  'Better peripheral & enterprise ecosystem',
];

// ─── Score meters from real data ─────────────────────────────────────────────
const MBP = LAPTOPS.find(l => l.id === 'mbp16-m5max')!;
const XPS = LAPTOPS.find(l => l.id === 'dell-xps14')!;

const METRICS = [
  { label: 'Performance',    mac: MBP?.performanceScore  ?? 97, pc: XPS?.performanceScore  ?? 81 },
  { label: 'Efficiency',     mac: MBP?.efficiencyScore   ?? 99, pc: XPS?.efficiencyScore   ?? 65 },
  { label: 'Value',          mac: MBP?.valueScore        ?? 60, pc: XPS?.valueScore        ?? 72 },
  { label: 'Battery life',   mac: MBP?.batteryScore      ?? 88, pc: XPS?.batteryScore      ?? 70 },
  { label: 'Gaming',         mac: 45,                           pc: 92 },
  { label: 'Repairability',  mac: 28,                           pc: 74 },
];

function Bar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        role="presentation"
      />
    </div>
  );
}

export default function PCvsMac({ navigate }: PageProps) {
  return (
    <div className="pt-20 pb-28">
      {/* Header */}
      <section className="section-container py-16">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Ecosystem comparison</p>
        <h1 className="headline-xl text-gradient mb-4">PC vs Mac.</h1>
        <p className="body-lg max-w-xl">
          An honest, data-driven look at both platforms — so you can choose with confidence.
        </p>
      </section>

      {/* Score meters */}
      <section className="section-container mb-16" aria-label="Metric comparison">
        <h2 className="headline-md mb-8">Head to head</h2>
        <GlassCard padding="lg" radius="3xl">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_80px_80px] gap-4 mb-4 text-xs font-semibold uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">
            <span>Metric</span>
            <span className="text-center">Mac</span>
            <span className="text-center">PC</span>
          </div>

          <div className="space-y-6">
            {METRICS.map(m => {
              const macWins = m.mac > m.pc;
              return (
                <div key={m.label}>
                  <div className="grid grid-cols-[1fr_80px_80px] gap-4 items-center mb-1.5">
                    <span className="text-sm font-medium text-apple-dark dark:text-apple-light">{m.label}</span>
                    <span className={`text-center text-sm font-bold ${macWins ? 'text-apple-blue' : 'text-apple-gray'}`}>
                      {m.mac}{macWins && <span className="ml-0.5 text-[10px]">★</span>}
                    </span>
                    <span className={`text-center text-sm font-bold ${!macWins ? 'text-apple-indigo' : 'text-apple-gray'}`}>
                      {m.pc}{!macWins && <span className="ml-0.5 text-[10px]">★</span>}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                    <div className="space-y-1">
                      <Bar value={m.mac} color="bg-apple-blue" />
                      <Bar value={m.pc} color="bg-apple-indigo" />
                    </div>
                    <div />
                    <div />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-apple-blue" aria-hidden="true" />
              <span className="text-xs text-apple-gray">Mac (MacBook Pro 16" M5 Max)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-apple-indigo" aria-hidden="true" />
              <span className="text-xs text-apple-gray">PC (Dell XPS 14)</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Pros columns */}
      <section className="section-container mb-16">
        <h2 className="headline-md mb-8">Why choose each?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mac */}
          <GlassCard padding="lg" radius="2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/30 to-blue-600/40 flex items-center justify-center text-xl" aria-hidden="true">🍎</span>
              <h3 className="text-lg font-bold text-apple-dark dark:text-apple-light">Mac</h3>
            </div>
            <ul className="space-y-3">
              {MAC_PROS.map(p => (
                <li key={p} className="flex items-start gap-3 text-sm text-apple-dark dark:text-apple-light">
                  <span className="w-5 h-5 rounded-full bg-apple-blue/12 text-apple-blue flex items-center justify-center text-xs shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* PC */}
          <GlassCard padding="lg" radius="2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400/30 to-purple-600/40 flex items-center justify-center text-xl" aria-hidden="true">🪟</span>
              <h3 className="text-lg font-bold text-apple-dark dark:text-apple-light">PC</h3>
            </div>
            <ul className="space-y-3">
              {PC_PROS.map(p => (
                <li key={p} className="flex items-start gap-3 text-sm text-apple-dark dark:text-apple-light">
                  <span className="w-5 h-5 rounded-full bg-apple-indigo/12 text-apple-indigo flex items-center justify-center text-xs shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <GlassCard padding="lg" radius="3xl" className="text-center">
          <h2 className="headline-md mb-3">Still deciding?</h2>
          <p className="body-lg mb-6">Use the Compare Tool to pick any 2–4 models and see every spec side by side.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-primary" onClick={() => navigate('compare')}>Open Compare Tool</button>
            <button className="btn-secondary" onClick={() => navigate('guides')}>Read Buying Guides</button>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
