import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import CompareTable from '../components/CompareTable';
import RadarChart from '../components/RadarChart';
import type { ComputerModel } from '../types';
import { ALL_MODELS } from '../lib/data';
import {
  getSelectedIds, addToCompare, removeFromCompare,
  clearCompare, setCompareIds, MAX_COMPARE,
} from '../lib/compareStore';

function getInitialIds(): string[] {
  const hash = window.location.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex !== -1) {
    const params = new URLSearchParams(hash.slice(qIndex + 1));
    const ids = (params.get('ids') ?? '').split(',').filter(Boolean);
    if (ids.length > 0) { setCompareIds(ids); return ids.slice(0, MAX_COMPARE); }
  }
  return getSelectedIds();
}

function ModelPicker({ onSelect, selectedIds }: { onSelect: (id: string) => void; selectedIds: string[] }) {
  const [query, setQuery] = useState('');
  const results = query.trim().length < 1
    ? ALL_MODELS
    : ALL_MODELS.filter(m => `${m.name} ${m.brand} ${m.cpu} ${m.gpu}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search models…"
        aria-label="Search hardware models"
        className="w-full px-3 py-2.5 liquid-glass text-xs text-apple-dark dark:text-apple-light placeholder:text-apple-gray/60 outline-none focus:border-apple-blue transition-colors duration-150 uppercase tracking-wide"
      />
      <div className="max-h-64 overflow-y-auto flex flex-col divide-y divide-black/5 dark:divide-white/5">
        {results.map(m => {
          const isIn = selectedIds.includes(m.id);
          const full = selectedIds.length >= MAX_COMPARE && !isIn;
          return (
            <button
              key={m.id}
              onClick={() => !full && onSelect(m.id)}
              disabled={full}
              aria-pressed={isIn}
              className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 ${
                isIn
                  ? 'bg-apple-blue/8 text-apple-blue'
                  : full
                  ? 'opacity-35 cursor-not-allowed text-apple-gray'
                  : 'hover:bg-apple-blue/5 text-apple-dark dark:text-apple-light'
              }`}
            >
              <span
                className="ascii-icon w-10 h-7 shrink-0 text-[0.55rem]"
                style={{ color: isIn ? '#0066ff' : '#888', borderColor: isIn ? '#0066ff' : '#888' }}
                aria-hidden="true"
              >
                {(m.subtype ?? m.type ?? 'DEV').slice(0, 3).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.75rem] font-bold uppercase tracking-wide truncate">{m.name}</p>
                <p className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-wide">{m.brand} · {m.priceLabel}</p>
              </div>
              {isIn && <span className="text-[0.6rem] font-black text-apple-blue shrink-0 uppercase tracking-wide">✓ In</span>}
            </button>
          );
        })}
        {results.length === 0 && (
          <p className="text-[0.7rem] text-apple-gray text-center py-6 uppercase tracking-widest">No results for "{query}"</p>
        )}
      </div>
    </div>
  );
}

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => getInitialIds());
  const [showPicker, setShowPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = () => setSelectedIds(getSelectedIds());
    window.addEventListener('comparechange', handler);
    return () => window.removeEventListener('comparechange', handler);
  }, []);

  const models: ComputerModel[] = selectedIds
    .map(id => ALL_MODELS.find(m => m.id === id))
    .filter((m): m is ComputerModel => m !== undefined);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) removeFromCompare(id);
    else addToCompare(id);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#compare?ids=${selectedIds.join(',')}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copy this link:', url);
    }
  };

  return (
    <div className="pt-12 pb-24">

      {/* Header */}
      <section className="section-container py-10 border-b border-black/8 dark:border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-chip text-apple-blue border-apple-blue">Compare Tool</span>
        </div>
        <h1 className="headline-xl text-gradient mb-3">Side by side.</h1>
        <p className="body-lg max-w-xl">
          Select 2–{MAX_COMPARE} models to compare every spec, score and price in one view.
        </p>
      </section>

      {/* Selection bar */}
      <section className="section-container mt-6 mb-6">
        <GlassCard padding="md" className="flex flex-wrap items-center gap-3">
          {/* Chips */}
          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            {models.map(m => (
              <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 border border-black/15 dark:border-white/10 text-[0.65rem] font-bold uppercase tracking-wide text-apple-dark dark:text-apple-light">
                <span aria-hidden="true" className="text-apple-blue">[{(m.subtype ?? 'DEV').slice(0, 3).toUpperCase()}]</span>
                <span className="max-w-[100px] truncate">{m.name}</span>
                <button
                  onClick={() => removeFromCompare(m.id)}
                  aria-label={`Remove ${m.name}`}
                  className="w-4 h-4 flex items-center justify-center text-apple-gray hover:text-apple-red transition-colors text-xs ml-0.5"
                >
                  ×
                </button>
              </div>
            ))}
            {models.length === 0 && (
              <p className="text-[0.7rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">No models selected</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {models.length >= 2 && (
              <button
                onClick={handleShare}
                aria-label="Copy share link"
                className="text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1.5 border border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white transition-all duration-150"
              >
                {copied ? '✓ Copied' : 'Share'}
              </button>
            )}
            {models.length > 0 && (
              <button
                onClick={() => clearCompare()}
                className="text-[0.6rem] font-bold uppercase tracking-widest text-apple-gray hover:text-apple-red transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowPicker(p => !p)}
              disabled={selectedIds.length >= MAX_COMPARE}
              className="btn-primary !py-1.5 !text-[0.6rem] disabled:opacity-40"
            >
              {showPicker ? '× Close' : `+ Add (${selectedIds.length}/${MAX_COMPARE})`}
            </button>
          </div>
        </GlassCard>

        {showPicker && (
          <div className="mt-2">
            <GlassCard padding="md">
              <ModelPicker onSelect={handleSelect} selectedIds={selectedIds} />
            </GlassCard>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="section-container">
        {models.length >= 2 ? (
          <div className="flex flex-col gap-6">
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-5">
                <span className="label-chip text-apple-gray border-apple-gray">Score Overview</span>
              </div>
              <RadarChart models={models} />
            </GlassCard>

            <CompareTable models={models} onRemove={removeFromCompare} />
          </div>
        ) : (
          <GlassCard padding="xl" className="text-center">
            <div className="ascii-icon w-14 h-10 text-[0.8rem] text-apple-gray border-apple-gray mx-auto mb-5">
              CMP
            </div>
            <h2 className="headline-md text-apple-dark dark:text-apple-light mb-3">
              Select 2+ models
            </h2>
            <p className="body-lg mb-6 max-w-sm mx-auto">
              Use the picker above or browse Laptops/Desktops and click "+ Add to Compare".
            </p>
            <button onClick={() => setShowPicker(true)} className="btn-primary">
              + Add model
            </button>
          </GlassCard>
        )}
      </section>
    </div>
  );
}
