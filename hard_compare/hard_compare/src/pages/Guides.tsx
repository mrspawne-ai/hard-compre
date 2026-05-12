import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { GUIDES } from '../lib/data';

export default function Guides({ navigate }: PageProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="pt-20 pb-28">
      {/* Header */}
      <section className="section-container py-16">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Buying Guides</p>
        <h1 className="headline-xl text-gradient mb-4">Buy smarter.</h1>
        <p className="body-lg max-w-xl">
          Expert-written guides to help you choose the right hardware for your needs and budget.
        </p>
      </section>

      {/* Guide cards */}
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GUIDES.map(guide => {
            const isOpen = expanded === guide.id;
            return (
              <GlassCard key={guide.id} padding="lg" radius="2xl" className="flex flex-col gap-4">
                {/* Icon + category */}
                <div className="flex items-start justify-between">
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center text-2xl shadow-md`} aria-hidden="true">
                    {guide.icon}
                  </span>
                  <span className="px-2 py-1 rounded-full liquid-glass text-[10px] font-semibold text-apple-gray uppercase tracking-widest">
                    {guide.category}
                  </span>
                </div>

                {/* Title + excerpt */}
                <div>
                  <h2 className="font-semibold text-apple-dark dark:text-apple-light mb-2 leading-snug">{guide.title}</h2>
                  <p className="text-sm text-apple-gray dark:text-apple-mid-gray">{guide.excerpt}</p>
                </div>

                {/* Meta */}
                <p className="text-xs text-apple-gray">
                  {guide.readTime} · {guide.publishDate}
                </p>

                {/* Expandable highlights */}
                {isOpen && (
                  <ul className="space-y-2">
                    {guide.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-sm text-apple-dark dark:text-apple-light">
                        <span className="w-4 h-4 rounded-full bg-apple-blue/12 text-apple-blue flex items-center justify-center text-[10px] shrink-0 mt-0.5" aria-hidden="true">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Read / CTA */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setExpanded(isOpen ? null : guide.id)}
                    className="flex-1 py-2 rounded-xl bg-apple-blue/10 text-apple-blue text-sm font-medium hover:bg-apple-blue hover:text-white transition-all duration-200"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Collapse ↑' : 'Read guide →'}
                  </button>
                  <button
                    onClick={() => navigate('compare')}
                    className="py-2 px-3 rounded-xl liquid-glass text-sm font-medium text-apple-gray hover:text-apple-blue transition-colors"
                    aria-label="Open compare tool"
                    title="Compare now"
                  >
                    ⌥
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="section-container mt-16">
        <GlassCard padding="lg" radius="3xl" className="text-center">
          <h2 className="headline-md mb-3">Ready to compare?</h2>
          <p className="body-lg mb-6 max-w-sm mx-auto">Jump into the Compare Tool and test drive any combination of models.</p>
          <button className="btn-primary" onClick={() => navigate('compare')}>Open Compare Tool</button>
        </GlassCard>
      </div>
    </div>
  );
}
