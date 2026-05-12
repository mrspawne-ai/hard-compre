import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';

const VALUES = [
  { icon: '📊', title: 'Data-Driven', desc: 'Every score is backed by real benchmarks — Geekbench, Cinebench, and real-world workloads. No marketing fluff.' },
  { icon: '⚖', title: 'Honest Reviews', desc: 'We don\'t take sponsored rankings. Our recommendations are based on performance, not partnerships.' },
  { icon: '🌍', title: 'Universal Access', desc: 'Whether you\'re choosing a $699 mini-PC or a $4,500 workstation, we have guides for every budget.' },
  { icon: '🔬', title: 'Deep Tech', desc: 'We go beyond clock speeds. We explain architecture, thermal limits, memory bandwidth, and why it matters.' },
  { icon: '🤝', title: 'Community First', desc: 'HardCompare grew from a community of hardware enthusiasts who were tired of biased recommendations.' },
  { icon: '✨', title: 'Always Updated', desc: 'We track every hardware launch and update benchmarks quarterly so you always see current data.' },
];

const TIMELINE = [
  { year: '2022', title: 'Founded', desc: 'Two hardware nerds frustrated by biased review sites built a spreadsheet. Then a website.' },
  { year: '2023', title: 'Beta Launch', desc: '50 models, 1K users in the first month. Benchmark database goes live.' },
  { year: '2024', title: 'Compare Tool', desc: 'The interactive side-by-side Compare Tool launches, used 200K times in year one.' },
  { year: '2025', title: 'Apple Silicon Era', desc: 'M4/M5 coverage launches alongside NVIDIA RTX 50 series integration.' },
  { year: '2026', title: 'HardCompare v2', desc: 'Full 2026 hardware database with enhanced scoring, guides, and PC vs Mac analysis.' },
];

export default function About({ navigate }: PageProps) {
  return (
    <div className="pt-20 pb-28">
      {/* Hero */}
      <section className="relative section-container py-24 text-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-apple-blue/6 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-apple-indigo/5 blur-[80px]" />
        </div>
        <p className="relative text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">About HardCompare</p>
        <h1 className="relative headline-xl text-gradient mb-6 max-w-4xl mx-auto">
          We believe you deserve honest hardware data.
        </h1>
        <p className="relative body-lg max-w-3xl mx-auto">
          HardCompare was built by hardware enthusiasts who were tired of affiliate-biased reviews.
          We track benchmarks, compare specs, and help you make the best buying decision — without the noise.
        </p>
      </section>

      {/* Mission statement */}
      <section aria-label="Our mission" className="py-16 border-y border-black/6 dark:border-white/6">
        <div className="section-container max-w-3xl">
          <GlassCard padding="xl" radius="3xl" className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/5 to-apple-indigo/5" aria-hidden="true" />
            <div className="relative">
              <p className="text-3xl font-semibold tracking-tight text-apple-dark dark:text-apple-light leading-tight">
                "The best comparison tool is the one that tells you exactly what you need, even when the answer is 'spend less'."
              </p>
              <p className="mt-5 text-sm text-apple-gray dark:text-apple-mid-gray">— HardCompare Team</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="section-container py-24">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-3">What We Believe</p>
          <h2 id="values-heading" className="headline-lg text-gradient">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((v) => (
            <GlassCard key={v.title} hover padding="lg" radius="2xl" className="group">
              <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                {v.icon}
              </span>
              <h3 className="font-bold text-lg text-apple-dark dark:text-apple-light mb-2 group-hover:text-apple-blue transition-colors">
                {v.title}
              </h3>
              <p className="text-sm text-apple-gray dark:text-apple-mid-gray leading-relaxed">{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-heading" className="py-24 border-t border-black/6 dark:border-white/6">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-3">Our Journey</p>
            <h2 id="timeline-heading" className="headline-lg text-gradient">From idea to icon.</h2>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-apple-blue/40 via-apple-indigo/30 to-transparent" aria-hidden="true" />

            <ol className="space-y-8">
              {TIMELINE.map((event, i) => (
                <li key={event.year} className="relative flex gap-8 items-start pl-20">
                  {/* Dot */}
                  <span
                    className="absolute left-6 top-3 w-4 h-4 rounded-full border-2 border-apple-blue bg-apple-light dark:bg-apple-dark flex-shrink-0"
                    aria-hidden="true"
                    style={{
                      backgroundColor: i === TIMELINE.length - 1 ? '#0071e3' : undefined,
                      boxShadow: i === TIMELINE.length - 1 ? '0 0 0 4px rgba(0,113,227,0.2)' : undefined,
                    }}
                  />
                  <GlassCard padding="md" radius="2xl" className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-xs font-bold text-apple-blue uppercase tracking-wider">{event.year}</span>
                      <h3 className="font-semibold text-apple-dark dark:text-apple-light">{event.title}</h3>
                    </div>
                    <p className="text-sm text-apple-gray dark:text-apple-mid-gray">{event.desc}</p>
                  </GlassCard>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section aria-label="Join the team" className="section-container">
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard padding="xl" radius="3xl" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/8 to-transparent" aria-hidden="true" />
            <div className="relative">
              <h2 className="headline-md text-gradient mb-4">Start comparing.</h2>
              <p className="body-lg mb-6">Pick any 2–4 models and see every spec side by side in seconds.</p>
              <button className="btn-primary" onClick={() => navigate('compare')}>Open Compare Tool</button>
            </div>
          </GlassCard>
          <GlassCard padding="xl" radius="3xl">
            <h2 className="headline-md text-gradient mb-4">Get in touch.</h2>
            <p className="body-lg mb-6">Press inquiries, partnerships, or just want to say hello?</p>
            <button className="btn-secondary" onClick={() => navigate('contact')}>Contact us</button>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
