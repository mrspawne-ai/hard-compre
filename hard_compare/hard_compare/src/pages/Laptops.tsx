import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps, ComputerModel } from '../types';
import { LAPTOPS } from '../lib/data';
import { addToCompare, isSelected, removeFromCompare } from '../lib/compareStore';
import { toggleFavorite, isFavorite } from '../lib/favoritesStore';

const SUBTYPES = ['All', 'ultrabook', 'professional', 'gaming', 'creator'] as const;
type SubtypeFilter = typeof SUBTYPES[number];

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'performance' | 'value';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default',     label: 'Default' },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
  { key: 'performance', label: 'Performance' },
  { key: 'value',       label: 'Value Score' },
];

function sortModels(models: ComputerModel[], key: SortKey): ComputerModel[] {
  const copy = [...models];
  switch (key) {
    case 'price-asc':   return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':  return copy.sort((a, b) => b.price - a.price);
    case 'performance': return copy.sort((a, b) => b.performanceScore - a.performanceScore);
    case 'value':       return copy.sort((a, b) => b.valueScore - a.valueScore);
    default:            return copy;
  }
}

// Heart icon
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export default function Laptops({ navigate }: PageProps) {
  const [filter, setFilter] = useState<SubtypeFilter>('All');
  const [sort, setSort] = useState<SortKey>('default');
  const [compareState, setCompareState] = useState<Record<string, boolean>>({});
  const [favState, setFavState] = useState<Record<string, boolean>>(() => {
    const ids = LAPTOPS.map(m => m.id);
    return Object.fromEntries(ids.map(id => [id, isFavorite(id)]));
  });

  // Sync favorites from other tabs
  useEffect(() => {
    const handler = () => {
      setFavState(Object.fromEntries(LAPTOPS.map(m => [m.id, isFavorite(m.id)])));
    };
    window.addEventListener('favchange', handler);
    return () => window.removeEventListener('favchange', handler);
  }, []);

  const filtered = filter === 'All' ? LAPTOPS : LAPTOPS.filter(m => m.subtype === filter);
  const visible = sortModels(filtered, sort);

  const handleToggle = (id: string) => {
    if (isSelected(id) || compareState[id]) {
      removeFromCompare(id);
      setCompareState(prev => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      const ok = addToCompare(id);
      if (ok) setCompareState(prev => ({ ...prev, [id]: true }));
      else navigate('compare');
    }
  };

  const handleFav = (id: string) => {
    const nowFav = toggleFavorite(id);
    setFavState(prev => ({ ...prev, [id]: nowFav }));
  };

  return (
    <div className="pt-20 pb-28">
      {/* Header */}
      <section className="section-container py-16">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Laptops</p>
        <h1 className="headline-xl text-gradient mb-4">Find your laptop.</h1>
        <p className="body-lg max-w-xl">
          {LAPTOPS.length} models compared — from ultra-thin MacBooks to powerhouse gaming rigs.
        </p>
      </section>

      {/* Controls: filter tabs + sort */}
      <div className="section-container mb-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by laptop type">
          {SUBTYPES.map(sub => (
            <button
              key={sub}
              role="tab"
              aria-selected={filter === sub}
              onClick={() => setFilter(sub)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                filter === sub
                  ? 'bg-apple-blue text-white shadow-sm shadow-apple-blue/30'
                  : 'liquid-glass text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            aria-label="Sort laptops"
            className="px-3 py-1.5 rounded-xl liquid-glass text-sm text-apple-dark dark:text-apple-light outline-none focus:ring-2 focus:ring-apple-blue/40 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(model => {
            const inCompare = isSelected(model.id) || compareState[model.id];
            const fav = favState[model.id] ?? false;
            return (
              <GlassCard key={model.id} padding="lg" radius="2xl" className="flex flex-col gap-4">
                {/* Top row */}
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-3xl shadow-md shrink-0`} aria-hidden="true">
                    {model.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-apple-dark dark:text-apple-light text-sm leading-snug">{model.name}</h2>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {model.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-apple-blue/12 text-apple-blue">
                            {model.badge}
                          </span>
                        )}
                        <button
                          onClick={() => handleFav(model.id)}
                          aria-label={fav ? `Remove ${model.name} from favorites` : `Save ${model.name} to favorites`}
                          className={`transition-colors duration-200 ${fav ? 'text-apple-red' : 'text-apple-gray hover:text-apple-red'}`}
                        >
                          <HeartIcon filled={fav} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-apple-gray dark:text-apple-mid-gray mt-0.5">{model.brand} · {model.os}</p>
                    <p className="text-sm font-bold text-apple-dark dark:text-apple-light mt-1">{model.priceLabel}</p>
                  </div>
                </div>

                {/* Key specs */}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {[
                    { label: 'CPU', value: model.cpu },
                    { label: 'RAM', value: model.ram },
                    { label: 'GPU', value: model.gpu },
                    { label: 'Storage', value: model.storage },
                    { label: 'Display', value: model.display ?? '—' },
                    { label: 'Battery', value: model.battery ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-apple-gray dark:text-apple-mid-gray">{label}</dt>
                      <dd className="font-medium text-apple-dark dark:text-apple-light truncate">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Scores */}
                <div className="flex gap-2">
                  {[
                    { label: 'Perf', value: model.performanceScore },
                    { label: 'Eff', value: model.efficiencyScore },
                    { label: 'Value', value: model.valueScore },
                    ...(model.batteryScore != null ? [{ label: 'Batt', value: model.batteryScore }] : []),
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-xl bg-apple-blue/6 dark:bg-apple-blue/10 py-2 text-center">
                      <p className="text-sm font-bold text-apple-blue">{s.value}</p>
                      <p className="text-[10px] text-apple-gray">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <button
                  onClick={() => handleToggle(model.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    inCompare
                      ? 'bg-apple-mint/15 text-apple-mint hover:bg-apple-red/10 hover:text-apple-red'
                      : 'bg-apple-blue/10 text-apple-blue hover:bg-apple-blue hover:text-white'
                  }`}
                >
                  {inCompare ? '✓ In Compare (click to remove)' : '+ Add to Compare'}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Compare CTA */}
      <div className="section-container mt-10">
        <button
          onClick={() => navigate('compare')}
          className="btn-primary"
        >
          Open Compare Tool →
        </button>
      </div>
    </div>
  );
}
