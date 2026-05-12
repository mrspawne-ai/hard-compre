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

// ─── Read share IDs from URL hash on first load ───────────────────────────────
function getInitialIds(): string[] {
  const hash = window.location.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex !== -1) {
    const params = new URLSearchParams(hash.slice(qIndex + 1));
    const ids = (params.get('ids') ?? '').split(',').filter(Boolean);
    if (ids.length > 0) {
      setCompareIds(ids);
      return ids.slice(0, MAX_COMPARE);
    }
  }
  return getSelectedIds();
}

// ─── Model picker ─────────────────────────────────────────────────────────────
function ModelPicker({
  onSelect,
  selectedIds,
}: {
  onSelect: (id: string) => void;
  selectedIds: string[];
}) {
  const [query, setQuery] = useState('');

  const results = query.trim().length < 1
    ? ALL_MODELS
    : ALL_MODELS.filter(m =>
        `${m.name} ${m.brand} ${m.cpu} ${m.gpu}`.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search models…"
        aria-label="Search hardware models"
        className="w-full px-4 py-3 rounded-2xl liquid-glass text-sm text-apple-dark dark:text-apple-light placeholder:text-apple-gray outline-none focus:ring-2 focus:ring-apple-blue/50"
      />
      <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
        {results.map(m => {
          const isIn = selectedIds.includes(m.id);
          const full = selectedIds.length >= MAX_COMPARE && !isIn;
          return (
            <button
              key={m.id}
              onClick={() => !full && onSelect(m.id)}
              disabled={full}
              aria-pressed={isIn}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                isIn
                  ? 'bg-apple-blue/10 text-apple-blue'
                  : full
                  ? 'opacity-40 cursor-not-allowed text-apple-gray'
                  : 'hover:bg-apple-blue/6 text-apple-dark dark:text-apple-light'
              }`}
            >
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl shrink-0`} aria-hidden="true">
                {m.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{m.name}</p>
                <p className="text-xs text-apple-gray dark:text-apple-mid-gray">{m.brand} · {m.priceLabel}</p>
              </div>
              {isIn && (
                <span className="ml-auto text-xs font-semibold text-apple-blue shrink-0">✓ Added</span>
              )}
            </button>
          );
        })}
        {results.length === 0 && (
          <p className="text-sm text-apple-gray text-center py-6">No results for "{query}"</p>
        )}
      </div>
    </div>
  );
}

// ─── Compare Page ─────────────────────────────────────────────────────────────
export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => getInitialIds());
  const [showPicker, setShowPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync with compareStore events (from other pages)
  useEffect(() => {
    const handler = () => setSelectedIds(getSelectedIds());
    window.addEventListener('comparechange', handler);
    return () => window.removeEventListener('comparechange', handler);
  }, []);

  const models: ComputerModel[] = selectedIds
    .map(id => ALL_MODELS.find(m => m.id === id))
    .filter((m): m is ComputerModel => m !== undefined);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      removeFromCompare(id);
    } else {
      addToCompare(id);
    }
  };

  const handleRemove = (id: string) => {
    removeFromCompare(id);
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
    <div className="pt-20 pb-28">
      {/* Header */}
      <section className="section-container py-16">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Compare Tool</p>
        <h1 className="headline-xl text-gradient mb-4">Side by side.</h1>
        <p className="body-lg max-w-xl">
          Select 2–{MAX_COMPARE} models to compare every spec, score and price in one view.
        </p>
      </section>

      {/* Selection bar */}
      <section className="section-container mb-8">
        <GlassCard padding="md" radius="2xl" className="flex flex-wrap items-center gap-4">
          {/* Selected chips */}
          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            {models.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass text-sm"
              >
                <span aria-hidden="true">{m.icon}</span>
                <span className="font-medium text-apple-dark dark:text-apple-light max-w-[140px] truncate">{m.name}</span>
                <button
                  onClick={() => handleRemove(m.id)}
                  aria-label={`Remove ${m.name}`}
                  className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] hover:bg-apple-red/20 hover:text-apple-red transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            {models.length === 0 && (
              <p className="text-sm text-apple-gray dark:text-apple-mid-gray">No models selected yet</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {models.length >= 2 && (
              <button
                onClick={handleShare}
                aria-label="Copy share link"
                className="text-xs font-medium px-3 py-1.5 rounded-xl liquid-glass text-apple-blue hover:bg-apple-blue/8 transition-colors"
              >
                {copied ? '✓ Copied!' : 'Share link'}
              </button>
            )}
            {models.length > 0 && (
              <button
                onClick={() => clearCompare()}
                className="text-xs text-apple-gray hover:text-apple-red transition-colors font-medium"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setShowPicker(p => !p)}
              disabled={selectedIds.length >= MAX_COMPARE}
              className="btn-primary !py-2 !text-xs disabled:opacity-50"
            >
              {showPicker ? 'Close' : `+ Add model (${selectedIds.length}/${MAX_COMPARE})`}
            </button>
          </div>
        </GlassCard>

        {/* Picker dropdown */}
        {showPicker && (
          <div className="mt-3">
            <GlassCard padding="md" radius="2xl">
              <ModelPicker onSelect={handleSelect} selectedIds={selectedIds} />
            </GlassCard>
          </div>
        )}
      </section>

      {/* Comparison content */}
      <section className="section-container">
        {models.length >= 2 ? (
          <div className="flex flex-col gap-8">
            {/* Radar chart */}
            <GlassCard padding="lg" radius="3xl">
              <h2 className="text-sm font-semibold text-apple-gray uppercase tracking-widest mb-6 text-center">
                Score Overview
              </h2>
              <RadarChart models={models} />
            </GlassCard>

            {/* Spec table */}
            <CompareTable models={models} onRemove={handleRemove} />
          </div>
        ) : (
          <GlassCard padding="xl" radius="3xl" className="text-center">
            <p className="text-5xl mb-4" aria-hidden="true">📊</p>
            <h2 className="text-xl font-bold text-apple-dark dark:text-apple-light mb-2">
              Select at least 2 models
            </h2>
            <p className="body-lg mb-6">
              Use the picker above or browse Laptops / Desktops pages and click "+ Add to Compare".
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="btn-primary"
            >
              + Add model
            </button>
          </GlassCard>
        )}
      </section>
    </div>
  );
}
