import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { COMPONENTS } from '../lib/data';
import { addToCompare, isSelected, removeFromCompare } from '../lib/compareStore';

const SUBTYPES = ['All', 'cpu', 'gpu'] as const;
type SubFilter = typeof SUBTYPES[number];

export default function Components({ navigate }: PageProps) {
  const [filter, setFilter] = useState<SubFilter>('All');
  const [compareState, setCompareState] = useState<Record<string, boolean>>({});

  const visible = filter === 'All' ? COMPONENTS : COMPONENTS.filter(m => m.subtype === filter);

  const handleToggle = (id: string) => {
    if (isSelected(id) || compareState[id]) {
      removeFromCompare(id);
      setCompareState(prev => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      if (addToCompare(id)) setCompareState(prev => ({ ...prev, [id]: true }));
      else navigate('compare');
    }
  };

  return (
    <div className="pt-12 pb-24">
      <section className="section-container py-10 border-b border-black/8 dark:border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-chip text-apple-blue border-apple-blue">Components</span>
          <span className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">
            {COMPONENTS.length} parts indexed
          </span>
        </div>
        <h1 className="headline-xl text-gradient mb-3">Inside the machine.</h1>
        <p className="body-lg max-w-xl">
          Compare CPUs, GPUs and more — understand what actually drives performance.
        </p>
      </section>

      <div className="section-container mt-6 mb-5">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter components">
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
              {sub === 'cpu' ? 'CPUs' : sub === 'gpu' ? 'GPUs' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map(model => {
            const inCompare = isSelected(model.id) || compareState[model.id];
            const isCpu = model.subtype === 'cpu';
            return (
              <GlassCard key={model.id} padding="md" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="ascii-icon w-10 h-5 text-[0.55rem] text-apple-blue border-apple-blue">
                        {isCpu ? 'CPU' : 'GPU'}
                      </span>
                      {model.badge && (
                        <span className="label-chip text-apple-orange border-apple-orange">{model.badge}</span>
                      )}
                    </div>
                    <h2 className="font-bold text-apple-dark dark:text-apple-light text-[0.8rem] leading-tight">{model.name}</h2>
                    <p className="text-[0.65rem] text-apple-gray dark:text-apple-mid-gray mt-0.5 uppercase tracking-wide">
                      {model.brand} · {isCpu ? 'Processor' : 'Graphics Card'}
                    </p>
                    <p className="text-sm font-black text-apple-dark dark:text-apple-light mt-1 tabular-nums">{model.priceLabel}</p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[0.65rem] border-t border-black/8 dark:border-white/5 pt-2.5">
                  {(isCpu ? [
                    { label: 'Cores',    value: model.cpuCores ?? '—' },
                    { label: 'Type',     value: model.cpu },
                    { label: 'GPU',      value: model.gpu },
                    { label: 'RAM Type', value: model.ramType ?? '—' },
                  ] : [
                    { label: 'VRAM',         value: model.gpuVram ?? '—' },
                    { label: 'Architecture', value: model.gpu },
                    { label: 'Memory Bus',   value: model.ramType ?? '—' },
                    { label: 'CUDA/CUs',     value: model.cpuCores ?? '—' },
                  ]).map(({ label, value }) => (
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
