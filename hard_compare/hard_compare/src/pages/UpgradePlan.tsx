import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';

interface Plan {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  badge?: string;
  gradient: string;
  icon: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    gradient: 'from-apple-gray/20 to-apple-gray/10',
    icon: '🌱',
    description: 'Perfect for casual hardware explorers.',
    cta: 'Get Started Free',
    features: [
      { text: 'Compare up to 2 devices', included: true },
      { text: 'Access to laptop & desktop data', included: true },
      { text: 'Basic spec tables', included: true },
      { text: 'Unlimited comparisons', included: false },
      { text: 'Export comparisons (PDF/CSV)', included: false },
      { text: 'AI recommendations', included: false },
      { text: 'Priority support', included: false },
      { text: 'Early access to new features', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    badge: 'Most Popular',
    gradient: 'from-apple-blue to-apple-indigo',
    icon: '⚡',
    description: 'For enthusiasts who compare seriously.',
    cta: 'Start Pro — 7 Days Free',
    popular: true,
    features: [
      { text: 'Compare up to 5 devices', included: true },
      { text: 'Access to laptop & desktop data', included: true },
      { text: 'Advanced spec tables', included: true },
      { text: 'Unlimited comparisons', included: true },
      { text: 'Export comparisons (PDF/CSV)', included: true },
      { text: 'AI recommendations', included: true },
      { text: 'Priority support', included: false },
      { text: 'Early access to new features', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: { monthly: 19, yearly: 15 },
    badge: 'Best Value',
    gradient: 'from-apple-indigo to-purple-600',
    icon: '✦',
    description: 'For power users and professionals.',
    cta: 'Go Elite',
    features: [
      { text: 'Compare unlimited devices', included: true },
      { text: 'Access to laptop & desktop data', included: true },
      { text: 'Advanced spec tables', included: true },
      { text: 'Unlimited comparisons', included: true },
      { text: 'Export comparisons (PDF/CSV)', included: true },
      { text: 'AI recommendations', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access to new features', included: true },
    ],
  },
];

const FAQ = [
  { q: 'Can I change plans at any time?', a: 'Yes! You can upgrade, downgrade, or cancel anytime. If you upgrade mid-cycle, you\'ll only be charged the prorated difference.' },
  { q: 'Is there a free trial for Pro or Elite?', a: 'Pro comes with a 7-day free trial, no credit card required. Elite has a 3-day trial.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, PayPal, and Apple Pay.' },
  { q: 'Does the yearly plan auto-renew?', a: 'Yes, yearly plans auto-renew unless you cancel at least 24 hours before the renewal date.' },
];

function CheckIcon({ included }: { included: boolean }) {
  return included ? (
    <svg className="w-4 h-4 text-apple-mint flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-apple-gray/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function UpgradePlan({ navigate }: PageProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelect = (planId: string) => {
    if (planId === 'free') {
      navigate('signin');
      return;
    }
    // Simulated checkout — store selection and go to dashboard
    const raw = localStorage.getItem('liquidOS-user');
    if (!raw) { navigate('signin'); return; }
    try {
      const user = JSON.parse(raw);
      const plan = PLANS.find(p => p.id === planId);
      localStorage.setItem('liquidOS-user', JSON.stringify({ ...user, plan: plan?.name ?? 'Pro' }));
    } catch { /* ignore */ }
    navigate('dashboard');
  };

  return (
    <div className="min-h-screen pb-24 pt-28 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-apple-blue/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-apple-indigo/4 blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative z-10">

        {/* Header */}
        <header className="text-center mb-14 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass text-xs font-semibold text-apple-blue mb-5">
            <span aria-hidden="true">✦</span> Simple, transparent pricing
          </div>
          <h1 className="headline-lg text-gradient mb-4">
            Choose your plan
          </h1>
          <p className="body-lg max-w-xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8" role="group" aria-label="Billing period">
            <span className={`text-sm font-medium transition-colors ${billing === 'monthly' ? 'text-apple-dark dark:text-apple-light' : 'text-apple-gray dark:text-apple-mid-gray'}`}>
              Monthly
            </span>
            <button
              id="billing-toggle"
              role="switch"
              aria-checked={billing === 'yearly'}
              aria-label="Toggle yearly billing"
              onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-12 h-7 rounded-full transition-all duration-300 ${billing === 'yearly' ? 'bg-apple-blue' : 'bg-apple-mid-gray/40'}`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${billing === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`}
                aria-hidden="true"
              />
            </button>
            <span className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${billing === 'yearly' ? 'text-apple-dark dark:text-apple-light' : 'text-apple-gray dark:text-apple-mid-gray'}`}>
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-apple-mint/15 text-apple-mint text-xs font-semibold">Save 20%</span>
            </span>
          </div>
        </header>

        {/* Plans grid */}
        <section aria-label="Pricing plans" className="grid md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl transition-transform duration-300 hover:-translate-y-1 ${plan.popular ? 'scale-[1.03] md:scale-[1.05]' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.gradient} shadow-sm whitespace-nowrap z-10`}>
                  {plan.badge}
                </div>
              )}

              <GlassCard
                padding="lg"
                radius="3xl"
                className={plan.popular ? 'ring-2 ring-apple-blue/30 shadow-xl shadow-apple-blue/10' : ''}
              >
                {/* Plan header */}
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-xl mb-4 ${plan.popular ? 'shadow-lg shadow-apple-blue/25' : ''}`}>
                    <span role="img" aria-label={plan.name}>{plan.icon}</span>
                  </div>
                  <h2 className="text-xl font-bold text-apple-dark dark:text-apple-light">{plan.name}</h2>
                  <p className="text-sm text-apple-gray dark:text-apple-mid-gray mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-apple-dark dark:text-apple-light">
                      ${billing === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-sm text-apple-gray dark:text-apple-mid-gray mb-1.5">/mo</span>
                    )}
                  </div>
                  {plan.price.monthly > 0 && billing === 'yearly' && (
                    <p className="text-xs text-apple-gray dark:text-apple-mid-gray mt-1">
                      Billed as ${plan.price.yearly * 12}/yr — save ${(plan.price.monthly - plan.price.yearly) * 12}/yr
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  id={`plan-cta-${plan.id}`}
                  onClick={() => handleSelect(plan.id)}
                  className={`w-full py-3 rounded-2xl text-sm font-semibold mb-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] ${
                    plan.popular
                      ? 'bg-gradient-to-r from-apple-blue to-apple-indigo text-white shadow-lg shadow-apple-blue/25 hover:shadow-apple-blue/35'
                      : plan.id === 'elite'
                      ? 'bg-gradient-to-r from-apple-indigo to-purple-600 text-white shadow-lg shadow-apple-indigo/20'
                      : 'liquid-glass text-apple-dark dark:text-apple-light hover:bg-apple-blue/5'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Divider */}
                <div className="divider mb-5" />

                {/* Features */}
                <ul className="space-y-3" role="list">
                  {plan.features.map(({ text, included }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <CheckIcon included={included} />
                      <span className={`text-sm ${included ? 'text-apple-dark dark:text-apple-light' : 'text-apple-gray/50 dark:text-apple-mid-gray/50 line-through'}`}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          ))}
        </section>

        {/* Feature comparison callout */}
        <section aria-label="Why upgrade" className="mb-20">
          <GlassCard padding="lg" radius="3xl">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: '🚀', title: 'Instant Access', desc: 'Unlock all features the moment you upgrade. No waiting, no approval.' },
                { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Stripe. Your payment info is encrypted and never stored.' },
                { icon: '💬', title: 'Human Support', desc: 'Real people ready to help, not just bots. Pro & Elite get priority queues.' },
              ].map(({ icon, title, desc }) => (
                <div key={title}>
                  <span className="text-3xl" role="img" aria-hidden="true">{icon}</span>
                  <h3 className="mt-3 font-semibold text-apple-dark dark:text-apple-light">{title}</h3>
                  <p className="mt-1.5 text-sm text-apple-gray dark:text-apple-mid-gray">{desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="max-w-2xl mx-auto">
          <h2 id="faq-heading" className="text-2xl font-bold text-center text-apple-dark dark:text-apple-light mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div key={q}>
                <GlassCard padding="md" radius="2xl">
                  <button
                    id={`faq-btn-${i}`}
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-medium text-sm text-apple-dark dark:text-apple-light">{q}</span>
                    <span
                      className={`w-6 h-6 rounded-full liquid-glass-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}
                      aria-hidden="true"
                    >
                      <svg className="w-3 h-3 text-apple-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 mt-3' : 'max-h-0'}`}
                  >
                    <p className="text-sm text-apple-gray dark:text-apple-mid-gray">{a}</p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-apple-gray dark:text-apple-mid-gray text-sm mb-4">
            Already have an account?
          </p>
          <button
            id="upgrade-signin-cta"
            onClick={() => navigate('signin')}
            className="btn-secondary"
          >
            Sign In →
          </button>
        </div>
      </div>
    </div>
  );
}
