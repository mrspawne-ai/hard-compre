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
      const ok = addToCompare(id);
      if (ok) setCompareState(prev => ({ ...prev, [id]: true }));
      else navigate('compare');
    }
  };

  return (
    <div className="pt-20 pb-28">
      {/* Header */}
      <section className="section-container py-16">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Components</p>
        <h1 className="headline-xl text-gradient mb-4">Inside the machine.</h1>
        <p className="body-lg max-w-xl">
          Compare CPUs, GPUs and more — understand what actually drives performance.
        </p>
      </section>

      {/* Filter */}
      <div className="section-container mb-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter components">
          {SUBTYPES.map(sub => (
            <button
              key={sub}
              role="tab"
              aria-selected={filter === sub}
              onClick={() => setFilter(sub)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 uppercase tracking-wide ${
                filter === sub
                  ? 'bg-apple-blue text-white shadow-sm shadow-apple-blue/30'
                  : 'liquid-glass text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue'
              }`}
            >
              {sub === 'cpu' ? 'CPUs' : sub === 'gpu' ? 'GPUs' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(model => {
            const inCompare = isSelected(model.id) || compareState[model.id];
            const isCpu = model.subtype === 'cpu';
            return (
              <GlassCard key={model.id} padding="lg" radius="2xl" className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-3xl shadow-md shrink-0`} aria-hidden="true">
                    {model.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-apple-dark dark:text-apple-light text-sm leading-snug">{model.name}</h2>
                      {model.badge && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-apple-blue/12 text-apple-blue">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-apple-gray dark:text-apple-mid-gray mt-0.5">
                      {model.brand} · {isCpu ? 'Processor' : 'Graphics Card'}
                    </p>
                    <p className="text-sm font-bold text-apple-dark dark:text-apple-light mt-1">{model.priceLabel}</p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {(isCpu ? [
                    { label: 'Cores', value: model.cpuCores ?? '—' },
                    { label: 'Type', value: model.cpu },
                    { label: 'GPU', value: model.gpu },
                    { label: 'RAM Type', value: model.ramType ?? '—' },
                  ] : [
                    { label: 'VRAM', value: model.gpuVram ?? '—' },
                    { label: 'Architecture', value: model.gpu },
                    { label: 'Memory Bus', value: model.ramType ?? '—' },
                    { label: 'CUDA/CUs', value: model.cpuCores ?? '—' },
                  ]).map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-apple-gray dark:text-apple-mid-gray">{label}</dt>
                      <dd className="font-medium text-apple-dark dark:text-apple-light truncate">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex gap-2">
                  {[
                    { label: 'Perf', value: model.performanceScore },
                    { label: 'Eff', value: model.efficiencyScore },
                    { label: 'Value', value: model.valueScore },
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-xl bg-apple-blue/6 dark:bg-apple-blue/10 py-2 text-center">
                      <p className="text-sm font-bold text-apple-blue">{s.value}</p>
                      <p className="text-[10px] text-apple-gray">{s.label}</p>
                    </div>
                  ))}
                </div>

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

      <div className="section-container mt-10">
        <button onClick={() => navigate('compare')} className="btn-primary">
          Open Compare Tool →
        </button>
      </div>
    </div>
  );
}
