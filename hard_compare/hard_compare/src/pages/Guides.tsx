import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { GUIDES } from '../lib/data';

export default function Guides({ navigate }: PageProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="pt-12 pb-24">
      <section className="section-container py-10 border-b border-black/8 dark:border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-chip text-apple-blue border-apple-blue">Buying Guides</span>
          <span className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">
            {GUIDES.length} guides
          </span>
        </div>
        <h1 className="headline-xl text-gradient mb-3">Buy smarter.</h1>
        <p className="body-lg max-w-xl">
          Expert-written guides to help you choose the right hardware for your needs and budget.
        </p>
      </section>

      <div className="section-container mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GUIDES.map(guide => {
            const isOpen = expanded === guide.id;
            return (
              <GlassCard key={guide.id} padding="md" className="flex flex-col gap-3">
                {/* Icon + category */}
                <div className="flex items-start justify-between gap-2">
                  <span className="ascii-icon w-12 h-7 text-[0.6rem] text-apple-blue border-apple-blue">
                    {guide.category.slice(0, 4).toUpperCase()}
                  </span>
                  <span className="label-chip text-apple-gray border-apple-gray">{guide.readTime}</span>
                </div>

                <div>
                  <h2 className="font-bold text-apple-dark dark:text-apple-light text-[0.8rem] leading-tight mb-1.5 uppercase tracking-tight">{guide.title}</h2>
                  <p className="text-[0.7rem] text-apple-gray dark:text-apple-mid-gray leading-relaxed">{guide.excerpt}</p>
                </div>

                <p className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">
                  {guide.publishDate}
                </p>

                {isOpen && (
                  <ul className="flex flex-col gap-1.5 border-t border-black/8 dark:border-white/5 pt-3">
                    {guide.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-[0.7rem] text-apple-dark dark:text-apple-light">
                        <span className="text-apple-mint font-bold shrink-0" aria-hidden="true">&gt;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setExpanded(isOpen ? null : guide.id)}
                    className="flex-1 py-1.5 text-[0.6rem] font-bold uppercase tracking-widest border border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white transition-all duration-150"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Collapse ↑' : 'Read Guide →'}
                  </button>
                  <button
                    onClick={() => navigate('compare')}
                    className="py-1.5 px-3 liquid-glass-light text-[0.6rem] font-bold uppercase tracking-widest text-apple-gray hover:text-apple-blue border border-current hover:border-apple-blue transition-colors duration-150"
                    aria-label="Open compare tool"
                    title="Compare now"
                  >
                    CMP
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="section-container mt-8">
        <div className="liquid-glass p-8">
          <h2 className="headline-md mb-3">Ready to compare?</h2>
          <p className="body-lg mb-5 max-w-sm">
            Jump into the Compare Tool and test drive any combination of models.
          </p>
          <button className="btn-primary" onClick={() => navigate('compare')}>
            Open Compare Tool
          </button>
        </div>
      </div>
    </div>
  );
}
