import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import { apiSignIn, apiSignUp, saveAuth, isAuthenticated } from '../lib/api';

type Mode = 'signin' | 'signup';

export default function SignIn({ navigate }: PageProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate('dashboard');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = mode === 'signup'
        ? await apiSignUp(name, email, password)
        : await apiSignIn(email, password);
      saveAuth(result.token, result.user);
      setStatus('idle');
      navigate('dashboard');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const handleSocialLogin = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await apiSignIn('admin@hardcompare.com', 'admin123');
      saveAuth(result.token, result.user);
      navigate('dashboard');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Social login unavailable — use email/password.');
    }
  };

  const inputClass = 'w-full px-3 py-2.5 liquid-glass text-xs text-apple-dark dark:text-apple-light placeholder:text-apple-gray/50 dark:placeholder:text-apple-mid-gray/50 outline-none focus:border-apple-blue transition-colors duration-150';

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4">
      <div className="w-full max-w-sm animate-scale-in">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('home')}
            aria-label="Go home"
            className="flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
          >
            <span className="w-8 h-5 border border-apple-blue flex items-center justify-center text-[9px] font-black tracking-widest text-apple-blue" aria-hidden="true">HC</span>
            <span className="font-black text-sm tracking-tight uppercase text-apple-dark dark:text-apple-light">
              Hard<span className="text-apple-blue">Compare</span>
            </span>
          </button>
          <h1 className="headline-md text-apple-dark dark:text-apple-light mb-1">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-[0.7rem] text-apple-gray dark:text-apple-mid-gray">
            {mode === 'signin'
              ? 'Access your dashboard and saved comparisons.'
              : 'Join HardCompare and start comparing hardware.'}
          </p>
        </div>

        <GlassCard padding="lg">
          {/* Social buttons */}
          <div className="flex flex-col gap-2 mb-5">
            {['Google', 'GitHub'].map(provider => (
              <button
                key={provider}
                type="button"
                onClick={handleSocialLogin}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 liquid-glass-light text-[0.68rem] font-bold uppercase tracking-widest text-apple-dark dark:text-apple-light hover:border-apple-blue transition-colors duration-150 disabled:opacity-50"
              >
                [{provider}]
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="flex-1 h-px bg-black/8 dark:bg-white/8" />
            <span className="text-[0.6rem] uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">or email</span>
            <span className="flex-1 h-px bg-black/8 dark:bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-3 mb-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="signin-name" className="block text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="signin-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="signin-email" className="block text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray mb-1.5">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="signin-password" className="block text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      className="text-[0.6rem] text-apple-blue hover:opacity-70 transition-opacity uppercase tracking-wide"
                      onClick={() => alert('Password reset coming soon.')}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.6rem] font-bold uppercase tracking-wide text-apple-gray hover:text-apple-blue transition-colors"
                  >
                    {showPassword ? 'hide' : 'show'}
                  </button>
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div role="alert" className="mb-4 px-3 py-2 border border-apple-red bg-apple-red/5 text-apple-red text-[0.68rem] font-medium flex items-center gap-2">
                <span aria-hidden="true">[!]</span>
                {errorMsg}
              </div>
            )}

            <button
              id="signin-submit"
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                  {mode === 'signin' ? 'Signing in…' : 'Creating…'}
                </>
              ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-[0.68rem] text-apple-gray dark:text-apple-mid-gray">
            {mode === 'signin' ? "No account? " : 'Have an account? '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setErrorMsg(''); setStatus('idle'); }}
              className="text-apple-blue font-bold uppercase tracking-wide hover:opacity-70 transition-opacity"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </GlassCard>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('upgrade')}
            className="text-[0.65rem] uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue transition-colors"
          >
            View plans →
          </button>
        </div>

        <p className="mt-3 text-center text-[0.6rem] text-apple-gray/50 dark:text-apple-mid-gray/50 uppercase tracking-wide">
          Demo: admin@hardcompare.com / admin123
        </p>
      </div>
    </div>
  );
}
