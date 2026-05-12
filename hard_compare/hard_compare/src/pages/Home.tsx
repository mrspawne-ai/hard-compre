import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { ALL_MODELS } from '../lib/data';
import { addToCompare, isSelected } from '../lib/compareStore';

// ─── Hero stats ───────────────────────────────────────────────────────────────
const STATS = [
  { value: ALL_MODELS.length, suffix: '+', label: 'Models tracked' },
  { value: 40, suffix: '+', label: 'Specs compared' },
  { value: 2026, suffix: '', label: 'Latest hardware' },
];

// ─── Featured models (first 4) ────────────────────────────────────────────────
const FEATURED = ALL_MODELS.slice(0, 4);

// ─── Home ────────────────────────────────────────────────────────────────────
export default function Home({ navigate }: PageProps) {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const [added, setAdded] = useState<Record<string, boolean>>({});

  // Animate counters on mount
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const targets = STATS.map(s => s.value);
    const raf = (ts: number) => {
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts(targets.map(t => Math.round(t * ease)));
      if (progress < 1) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, []);

  const handleAdd = (id: string) => {
    if (addToCompare(id)) {
      setAdded(prev => ({ ...prev, [id]: true }));
    } else {
      navigate('compare');
    }
  };

  return (
    <div className="pt-14">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Ambient blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-apple-blue/6 blur-[160px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-apple-indigo/5 blur-[120px] animate-[float_10s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/4 blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
        </div>

        <div className="section-container relative z-10 py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-semibold text-apple-blue mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse" aria-hidden="true" />
              2026 Hardware Database — Updated Weekly
            </p>

            <h1 className="headline-xl text-gradient mb-6">
              Find your perfect<br />computer.
            </h1>

            <p className="body-lg max-w-xl mb-10">
              Compare specs, scores and prices across MacBooks, Windows laptops, desktops and components.
              Stop guessing — start comparing.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                className="btn-primary"
                onClick={() => navigate('compare')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Start Comparing
              </button>
              <button className="btn-secondary" onClick={() => navigate('guides')}>
                Buying Guides →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="section-container pb-16" aria-label="Site statistics">
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {STATS.map((stat, i) => (
            <GlassCard key={stat.label} padding="md" radius="2xl" className="text-center">
              <p className="text-2xl font-black text-gradient leading-none">
                {counts[i]}{stat.suffix}
              </p>
              <p className="text-xs text-apple-gray dark:text-apple-mid-gray mt-1">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── Featured models ── */}
      <section className="section-container pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-2">Top picks</p>
            <h2 className="headline-md">Featured models</h2>
          </div>
          <button className="text-sm font-medium text-apple-blue hover:opacity-75 transition-opacity" onClick={() => navigate('laptops')}>
            See all →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED.map((model) => {
            const inCompare = isSelected(model.id) || added[model.id];
            return (
              <GlassCard key={model.id} padding="md" radius="2xl" hover className="flex flex-col gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-3xl shadow-md`} aria-hidden="true">
                  {model.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-apple-dark dark:text-apple-light text-sm leading-snug">{model.name}</h3>
                    {model.badge && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-apple-blue/12 text-apple-blue">
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-apple-gray dark:text-apple-mid-gray">{model.brand} · {model.priceLabel}</p>
                </div>

                <div className="flex gap-3 text-center">
                  {[
                    { label: 'Perf', value: model.performanceScore },
                    { label: 'Value', value: model.valueScore },
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-xl bg-apple-blue/6 dark:bg-apple-blue/10 py-2">
                      <p className="text-sm font-bold text-apple-blue">{s.value}</p>
                      <p className="text-[10px] text-apple-gray">{s.label}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAdd(model.id)}
                  disabled={inCompare}
                  className={`w-full text-xs font-medium py-2 rounded-xl transition-all duration-200 ${
                    inCompare
                      ? 'bg-apple-mint/20 text-apple-mint cursor-default'
                      : 'bg-apple-blue/10 text-apple-blue hover:bg-apple-blue hover:text-white'
                  }`}
                  aria-label={inCompare ? `${model.name} added to compare` : `Add ${model.name} to compare`}
                >
                  {inCompare ? '✓ Added' : '+ Compare'}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── Category shortcuts ── */}
      <section className="section-container pb-24">
        <h2 className="headline-md mb-8">Browse by category</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Laptops', desc: 'Ultrabooks, gaming, professional', route: 'laptops' as const, icon: '💻', gradient: 'from-blue-400/20 to-indigo-600/30' },
            { label: 'Desktops', desc: 'Mac mini, towers, workstations', route: 'desktops' as const, icon: '🖥️', gradient: 'from-purple-400/20 to-violet-600/30' },
            { label: 'Components', desc: 'CPUs, GPUs, RAM, storage', route: 'components' as const, icon: '⚙️', gradient: 'from-teal-400/20 to-cyan-600/30' },
          ].map(cat => (
            <button key={cat.label} onClick={() => navigate(cat.route)} className="group text-left">
              <GlassCard padding="lg" radius="2xl" hover className="h-full">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-apple-dark dark:text-apple-light mb-1">{cat.label}</h3>
                <p className="text-sm text-apple-gray dark:text-apple-mid-gray">{cat.desc}</p>
              </GlassCard>
            </button>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-container pb-28">
        <GlassCard padding="xl" radius="3xl" className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/5 via-transparent to-apple-indigo/5" aria-hidden="true" />
          <div className="relative">
            <p className="text-4xl mb-4" aria-hidden="true">⌥</p>
            <h2 className="headline-md mb-4">Ready to find your machine?</h2>
            <p className="body-lg max-w-md mx-auto mb-8">
              Pick up to 4 computers and compare side-by-side with our interactive tool.
            </p>
            <button className="btn-primary" onClick={() => navigate('compare')}>
              Open Compare Tool
            </button>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
