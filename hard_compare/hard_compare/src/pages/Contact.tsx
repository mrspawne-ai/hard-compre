import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { apiSubmitContact } from '../lib/api';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setServerError('');
    try {
      await apiSubmitContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-3 rounded-2xl glass text-sm text-apple-dark dark:text-apple-light placeholder-apple-gray/60 dark:placeholder-apple-mid-gray/50 outline-none transition-all duration-200 focus:ring-2 ${
      errors[field]
        ? 'ring-2 ring-apple-red/60'
        : 'focus:ring-apple-blue/50 hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  return (
    <div className="pt-20 pb-28">
      {/* Header */}
      <section className="section-container py-20 text-center">
        <p className="text-sm font-semibold text-apple-blue uppercase tracking-widest mb-4">Get in Touch</p>
        <h1 className="headline-xl text-gradient mb-6">We'd love to hear from you.</h1>
        <p className="body-lg max-w-2xl mx-auto">
          Whether you have a question, feedback, or just want to say hello — our team is here.
        </p>
      </section>

      <div className="section-container grid lg:grid-cols-5 gap-8">
        {/* Contact info sidebar */}
        <aside className="lg:col-span-2 space-y-5" aria-label="Contact information">
          {/* Info cards */}
          {[
            {
              icon: '📍',
              title: 'Headquarters',
              lines: ['One LiquidOS Park', 'Cupertino, CA 95014', 'United States'],
            },
            {
              icon: '📞',
              title: 'Phone',
              lines: ['+1 (800) 275-2273', 'Mon–Fri, 9am–9pm PST'],
            },
            {
              icon: '✉️',
              title: 'Email',
              lines: ['hello@liquidOS.com', 'press@liquidOS.com'],
            },
            {
              icon: '💬',
              title: 'Live Chat',
              lines: ['Available 24/7', 'Average response < 2 min'],
            },
          ].map((info) => (
            <GlassCard key={info.title} padding="md" radius="2xl" className="flex gap-4">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{info.icon}</span>
              <div>
                <h3 className="font-semibold text-sm text-apple-dark dark:text-apple-light mb-1">{info.title}</h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-sm text-apple-gray dark:text-apple-mid-gray">{line}</p>
                ))}
              </div>
            </GlassCard>
          ))}

          {/* Fake map */}
          <GlassCard padding="none" radius="2xl" className="overflow-hidden">
            <div
              className="h-44 bg-gradient-to-br from-green-400/20 via-teal-500/15 to-blue-500/20 flex items-center justify-center relative"
              aria-label="Map placeholder — Cupertino, CA"
              role="img"
            >
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px),
                  repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px)`,
              }} aria-hidden="true" />
              <div className="relative flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">📍</span>
                <span className="text-xs font-medium text-apple-dark/70 dark:text-apple-light/70 glass px-3 py-1 rounded-full">
                  Cupertino, CA
                </span>
              </div>
            </div>
          </GlassCard>
        </aside>

        {/* Contact form */}
        <main className="lg:col-span-3">
          <GlassCard padding="xl" radius="3xl">
            <h2 className="text-xl font-bold text-apple-dark dark:text-apple-light mb-7">Send a message</h2>

            {status === 'sent' ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-5" aria-hidden="true">✅</span>
                <h3 className="text-xl font-bold text-apple-dark dark:text-apple-light mb-3">Message sent!</h3>
                <p className="text-apple-gray dark:text-apple-mid-gray mb-7">
                  We'll get back to you within one business day.
                </p>
                <button className="btn-secondary" onClick={() => setStatus('idle')}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
                      className={inputClass('name')}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <p id="name-error" className="text-xs text-apple-red mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                      className={inputClass('email')}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-xs text-apple-red mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                    className={inputClass('subject')}
                  />
                </div>

                <div className="mb-7">
                  <label htmlFor="contact-message" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={(e) => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }}
                    className={`${inputClass('message')} resize-none`}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && <p id="message-error" className="text-xs text-apple-red mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ justifyContent: 'center' }}
                >
                  {status === 'sending' ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : 'Send Message'}
                </button>

                {status === 'error' && serverError && (
                  <div role="alert" className="mt-4 px-4 py-3 rounded-2xl bg-apple-red/8 border border-apple-red/15 text-apple-red text-xs font-medium">
                    {serverError}
                  </div>
                )}

                <p className="text-xs text-apple-gray dark:text-apple-mid-gray text-center mt-4">
                  By submitting this form, you agree to our{' '}
                  <span className="text-apple-blue underline cursor-default">
                    Privacy Policy
                  </span>.
                </p>
              </form>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
