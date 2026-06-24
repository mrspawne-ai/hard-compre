import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { ALL_MODELS } from '../lib/data';
import { addToCompare, isSelected } from '../lib/compareStore';

const STATS = [
  { value: ALL_MODELS.length, suffix: '+', label: 'Models' },
  { value: 40,  suffix: '+', label: 'Specs' },
  { value: 2026, suffix: '', label: 'Latest' },
];

const FEATURED = ALL_MODELS.slice(0, 4);

const CATEGORIES = [
  { label: 'Laptops',    tag: 'LAP', desc: 'Ultrabooks · gaming · professional',      route: 'laptops'    as const },
  { label: 'Desktops',   tag: 'DSK', desc: 'Mac mini · towers · workstations',         route: 'desktops'   as const },
  { label: 'Components', tag: 'CMP', desc: 'CPUs · GPUs · RAM · storage',              route: 'components' as const },
];

export default function Home({ navigate }: PageProps) {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const duration = 900;
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
    <div className="pt-12">

      {/* ── Hero ── */}
      <section className="section-container pt-16 pb-14 border-b border-black/8 dark:border-white/5">
        <div className="max-w-4xl">
          {/* Terminal label */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-apple-mint" aria-hidden="true" />
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">
              hardcompare.v2026 / hardware database / updated weekly
            </span>
          </div>

          <h1 className="headline-xl text-gradient mb-6 cursor-blink">
            Find your<br />machine.
          </h1>

          <p className="body-lg max-w-xl mb-10">
            Side-by-side specs, benchmark scores and price analysis across MacBooks,
            Windows laptops, desktops and components.
          </p>

          {/* Stats inline */}
          <div className="flex items-center gap-6 mb-10 text-xs font-bold uppercase tracking-widest">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-apple-dark dark:text-apple-light tabular-nums">
                  {counts[i]}{stat.suffix}
                </span>
                <span className="text-apple-gray dark:text-apple-mid-gray">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => navigate('compare')}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare Now
            </button>
            <button className="btn-secondary" onClick={() => navigate('guides')}>
              Buying Guides →
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured models ── */}
      <section className="section-container py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] font-black uppercase tracking-widest text-apple-blue border border-apple-blue px-2 py-0.5">
              Top picks
            </span>
            <h2 className="headline-md">Featured models</h2>
          </div>
          <button
            className="text-[0.65rem] font-bold uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue transition-colors duration-150"
            onClick={() => navigate('laptops')}
          >
            See all →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURED.map((model) => {
            const inCompare = isSelected(model.id) || added[model.id];
            return (
              <GlassCard key={model.id} padding="md" hover className="flex flex-col gap-3">
                {/* Model header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="ascii-icon w-8 h-5 text-apple-blue border-apple-blue text-[0.55rem]">
                        {model.subtype?.slice(0, 3).toUpperCase() ?? 'CPU'}
                      </span>
                      {model.badge && (
                        <span className="label-chip text-apple-orange border-apple-orange">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-apple-dark dark:text-apple-light text-xs leading-tight mt-1">{model.name}</h3>
                    <p className="text-[0.65rem] text-apple-gray dark:text-apple-mid-gray mt-0.5 uppercase tracking-wide">
                      {model.brand} · {model.priceLabel}
                    </p>
                  </div>
                </div>

                {/* Score bars */}
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'PERF', value: model.performanceScore },
                    { label: 'VAL',  value: model.valueScore },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 text-[0.6rem]">
                      <span className="w-8 font-bold text-apple-gray dark:text-apple-mid-gray shrink-0">{s.label}</span>
                      <div className="flex-1 score-bar">
                        <div className="score-bar-fill" style={{ width: `${s.value}%` }} />
                      </div>
                      <span className="w-6 text-right font-black text-apple-blue tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAdd(model.id)}
                  disabled={inCompare}
                  className={`w-full text-[0.6rem] font-bold uppercase tracking-widest py-1.5 border transition-all duration-150 ${
                    inCompare
                      ? 'border-apple-mint text-apple-mint cursor-default'
                      : 'border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white'
                  }`}
                  aria-label={inCompare ? `${model.name} added` : `Add ${model.name} to compare`}
                >
                  {inCompare ? '✓ Added' : '+ Compare'}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section-container pb-12 border-t border-black/8 dark:border-white/5">
        <h2 className="headline-md mt-10 mb-6">Browse by category</h2>
        <div className="flex flex-col divide-y divide-black/8 dark:divide-white/5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => navigate(cat.route)}
              className="group flex items-center gap-5 py-4 text-left hover:pl-2 transition-all duration-150"
            >
              <span className="ascii-icon w-10 h-7 text-[0.65rem] text-apple-gray dark:text-apple-mid-gray group-hover:text-apple-blue group-hover:border-apple-blue transition-colors duration-150">
                {cat.tag}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-wide text-apple-dark dark:text-apple-light group-hover:text-apple-blue transition-colors duration-150">
                  {cat.label}
                </p>
                <p className="text-[0.65rem] text-apple-gray dark:text-apple-mid-gray mt-0.5">{cat.desc}</p>
              </div>
              <span className="text-apple-gray dark:text-apple-mid-gray text-xs group-hover:text-apple-blue group-hover:translate-x-1 transition-all duration-150">
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-container pb-20">
        <div className="liquid-glass p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-px h-full bg-apple-blue/20" aria-hidden="true" />
          <div className="absolute top-4 right-8 text-[0.55rem] font-bold uppercase tracking-widest text-apple-blue/40">
            [ compare tool ]
          </div>
          <div className="max-w-lg">
            <h2 className="headline-md mb-3">Ready to find your machine?</h2>
            <p className="body-lg mb-6">
              Select up to 4 devices and compare every spec side-by-side.
            </p>
            <button className="btn-primary" onClick={() => navigate('compare')}>
              Open Compare Tool
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
