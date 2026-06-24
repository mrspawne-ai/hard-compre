import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps, ComputerModel } from '../types';
import { DESKTOPS } from '../lib/data';
import { addToCompare, isSelected, removeFromCompare } from '../lib/compareStore';
import { toggleFavorite, isFavorite } from '../lib/favoritesStore';

const SUBTYPES = ['All', 'mini', 'all-in-one', 'tower', 'workstation', 'custom'] as const;
type SubtypeFilter = typeof SUBTYPES[number];

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'performance' | 'value';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default',     label: 'Default' },
  { key: 'price-asc',  label: 'Price ↑' },
  { key: 'price-desc', label: 'Price ↓' },
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

export default function Desktops({ navigate }: PageProps) {
  const [filter, setFilter] = useState<SubtypeFilter>('All');
  const [sort, setSort] = useState<SortKey>('default');
  const [compareState, setCompareState] = useState<Record<string, boolean>>({});
  const [favState, setFavState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DESKTOPS.map(m => [m.id, isFavorite(m.id)]))
  );

  useEffect(() => {
    const handler = () => setFavState(Object.fromEntries(DESKTOPS.map(m => [m.id, isFavorite(m.id)])));
    window.addEventListener('favchange', handler);
    return () => window.removeEventListener('favchange', handler);
  }, []);

  const filtered = filter === 'All' ? DESKTOPS : DESKTOPS.filter(m => m.subtype === filter);
  const visible = sortModels(filtered, sort);

  const handleToggle = (id: string) => {
    if (isSelected(id) || compareState[id]) {
      removeFromCompare(id);
      setCompareState(prev => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      if (addToCompare(id)) setCompareState(prev => ({ ...prev, [id]: true }));
      else navigate('compare');
    }
  };

  const handleFav = (id: string) => {
    const nowFav = toggleFavorite(id);
    setFavState(prev => ({ ...prev, [id]: nowFav }));
  };

  return (
    <div className="pt-12 pb-24">
      <section className="section-container py-10 border-b border-black/8 dark:border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-chip text-apple-blue border-apple-blue">Desktops</span>
          <span className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">
            {DESKTOPS.length} models indexed
          </span>
        </div>
        <h1 className="headline-xl text-gradient mb-3">Power without compromise.</h1>
        <p className="body-lg max-w-xl">
          From the compact Mac mini to custom tower builds — benchmarked and compared.
        </p>
      </section>

      {/* Controls */}
      <div className="section-container mt-6 mb-5 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by type">
          {SUBTYPES.map(sub => (
            <button
              key={sub}
              role="tab"
              aria-selected={filter === sub}
              onClick={() => setFilter(sub)}
              className={`px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest border transition-all duration-150 ${
                filter === sub
                  ? 'bg-apple-blue text-white border-apple-blue'
                  : 'border-current text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue hover:border-apple-blue'
              }`}
            >
              {sub === 'all-in-one' ? 'AIO' : sub}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            aria-label="Sort desktops"
            className="px-2.5 py-1 liquid-glass text-[0.65rem] font-bold uppercase tracking-wide text-apple-dark dark:text-apple-light outline-none focus:border-apple-blue cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map(model => {
            const inCompare = isSelected(model.id) || compareState[model.id];
            const fav = favState[model.id] ?? false;
            return (
              <GlassCard key={model.id} padding="md" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="ascii-icon w-10 h-5 text-[0.55rem] text-apple-blue border-apple-blue">
                        {(model.subtype ?? 'DSK').slice(0, 3).toUpperCase()}
                      </span>
                      {model.badge && (
                        <span className="label-chip text-apple-orange border-apple-orange">{model.badge}</span>
                      )}
                    </div>
                    <h2 className="font-bold text-apple-dark dark:text-apple-light text-[0.8rem] leading-tight">{model.name}</h2>
                    <p className="text-[0.65rem] text-apple-gray dark:text-apple-mid-gray mt-0.5 uppercase tracking-wide">
                      {model.brand} · {model.os}
                    </p>
                    <p className="text-sm font-black text-apple-dark dark:text-apple-light mt-1 tabular-nums">{model.priceLabel}</p>
                  </div>
                  <button
                    onClick={() => handleFav(model.id)}
                    aria-label={fav ? `Remove ${model.name} from favorites` : `Save ${model.name}`}
                    className={`text-lg leading-none transition-colors duration-150 ${fav ? 'text-apple-red' : 'text-apple-gray hover:text-apple-red'}`}
                  >
                    {fav ? '♥' : '♡'}
                  </button>
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[0.65rem] border-t border-black/8 dark:border-white/5 pt-2.5">
                  {[
                    { label: 'CPU',     value: model.cpu },
                    { label: 'RAM',     value: model.ram },
                    { label: 'GPU',     value: model.gpu },
                    { label: 'Storage', value: model.storage },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <dt className="font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray" style={{ fontSize: '0.55rem' }}>{label}</dt>
                      <dd className="font-medium text-apple-dark dark:text-apple-light truncate">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-col gap-1 border-t border-black/8 dark:border-white/5 pt-2">
                  {[
                    { label: 'PERF',  value: model.performanceScore },
                    { label: 'EFF',   value: model.efficiencyScore },
                    { label: 'VALUE', value: model.valueScore },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 text-[0.58rem]">
                      <span className="w-9 font-black text-apple-gray dark:text-apple-mid-gray shrink-0 tracking-wider">{s.label}</span>
                      <div className="flex-1 score-bar">
                        <div className="score-bar-fill" style={{ width: `${s.value}%` }} />
                      </div>
                      <span className="w-5 text-right font-black text-apple-blue tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleToggle(model.id)}
                  className={`w-full py-2 text-[0.6rem] font-bold uppercase tracking-widest border transition-all duration-150 ${
                    inCompare
                      ? 'border-apple-mint text-apple-mint hover:border-apple-red hover:text-apple-red'
                      : 'border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white'
                  }`}
                >
                  {inCompare ? '✓ In Compare (remove)' : '+ Add to Compare'}
                </button>
              </GlassCard>
            );
          })}

          {visible.length === 0 && (
            <div className="col-span-full text-center py-12 text-apple-gray text-[0.7rem] uppercase tracking-widest">
              No desktops in this category.
            </div>
          )}
        </div>
      </div>

      <div className="section-container mt-8">
        <button onClick={() => navigate('compare')} className="btn-primary">
          Open Compare Tool →
        </button>
      </div>
    </div>
  );
}
