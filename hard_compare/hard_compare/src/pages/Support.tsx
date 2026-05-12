import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { FAQS } from '../lib/data';

const CATEGORIES = ['All', 'Comparing', 'Pricing', 'Technical', 'Platform'];

const QUICK_LINKS = [
  { icon: '📊', label: 'Open Compare Tool',  color: 'bg-blue-500/12 text-blue-600 dark:text-blue-400' },
  { icon: '📖', label: 'Buying Guides',       color: 'bg-green-500/12 text-green-600 dark:text-green-400' },
  { icon: '⚖', label:  'PC vs Mac guide',    color: 'bg-orange-500/12 text-orange-600 dark:text-orange-400' },
  { icon: '💬', label: 'Contact us',          color: 'bg-purple-500/12 text-purple-600 dark:text-purple-400' },
];

export default function Support({ navigate: _navigate }: PageProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = FAQS.filter(f => {
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-20 pb-28">
      {/* Hero with search */}
      <section className="section-container py-20 text-center">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Support</p>
        <h1 className="headline-xl text-gradient mb-6">How can we help?</h1>

        {/* Search box */}
        <div className="relative max-w-xl mx-auto mt-8">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search support articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-5 py-4 rounded-2xl glass text-base text-apple-dark dark:text-apple-light placeholder-apple-gray/60 outline-none focus:ring-2 focus:ring-apple-blue/50 shadow-sm"
            aria-label="Search support articles"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Quick links */}
      <div className="section-container mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.label}
              className="glass rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
              aria-label={link.label}
            >
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${link.color}`} aria-hidden="true">
                {link.icon}
              </span>
              <span className="text-sm font-medium text-apple-dark dark:text-apple-light text-center">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ section */}
      <section aria-labelledby="faq-heading" className="section-container">
        <h2 id="faq-heading" className="headline-md text-gradient mb-8">Frequently Asked Questions</h2>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-apple-blue text-white shadow-md shadow-apple-blue/30'
                  : 'glass text-apple-dark dark:text-apple-light hover:bg-apple-blue/8'
              }`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        {filtered.length > 0 ? (
          <dl className="space-y-3" aria-label="FAQ accordion">
            {filtered.map((faq) => {
              const isOpen = openIds.has(faq.id);
              return (
                <div key={faq.id} className="glass rounded-2xl overflow-hidden">
                  <dt>
                    <button
                      onClick={() => toggle(faq.id)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-apple-blue/4 transition-colors duration-150"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <span className="font-semibold text-base text-apple-dark dark:text-apple-light">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 text-apple-blue transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </dt>
                  <dd
                    id={`faq-answer-${faq.id}`}
                    className={`overflow-hidden transition-all duration-350 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <div className="px-6 pb-5 border-t border-black/5 dark:border-white/5">
                      <p className="pt-4 text-sm text-apple-gray dark:text-apple-mid-gray leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
            <p className="text-apple-gray dark:text-apple-mid-gray mb-2">No results for "{search}"</p>
            <button className="text-apple-blue text-sm underline" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Still need help */}
      <section aria-label="Additional support" className="section-container mt-20">
        <GlassCard padding="xl" radius="3xl" className="max-w-2xl mx-auto text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/6 to-apple-indigo/6" aria-hidden="true" />
          <div className="relative">
            <h2 className="headline-md text-gradient mb-3">Still need help?</h2>
            <p className="body-lg mb-7">Our support advisors are available 24/7 via chat, phone, or email.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="btn-primary">Chat Now</button>
              <button className="btn-secondary" onClick={() => _navigate('contact')}>Contact Support</button>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
