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

  // Redirect already-authenticated users straight to their dashboard
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
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
      setErrorMsg(err instanceof Error ? err.message : 'Social login is not available — please use email/password.');
    }
  };

  const socialProviders = [
    {
      label: 'Continue with Google',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      label: 'Continue with GitHub',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.09.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-apple-blue/6 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-apple-indigo/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('home')}
            aria-label="Go to HardCompare Home"
            className="inline-flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-apple-blue to-apple-indigo flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-apple-blue/25"
              aria-hidden="true"
            >
              ⌥
            </span>
            <span className="font-bold text-xl tracking-tight text-apple-dark dark:text-apple-light">
              Hard<span className="text-apple-blue">Compare</span>
            </span>
          </button>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-apple-dark dark:text-apple-light">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 text-sm text-apple-gray dark:text-apple-mid-gray">
            {mode === 'signin'
              ? 'Sign in to access your dashboard and saved comparisons.'
              : 'Join HardCompare and start comparing hardware like a pro.'}
          </p>
        </div>

        <GlassCard padding="lg" radius="3xl">
          <div className="space-y-2.5 mb-6">
            {socialProviders.map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                onClick={handleSocialLogin}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl liquid-glass-light text-sm font-medium text-apple-dark dark:text-apple-light hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60"
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-black/8 dark:bg-white/8" />
            <span className="text-xs text-apple-gray dark:text-apple-mid-gray font-medium">or continue with email</span>
            <span className="flex-1 h-px bg-black/8 dark:bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 mb-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="signin-name" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="signin-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full px-4 py-3 rounded-2xl liquid-glass-light text-sm text-apple-dark dark:text-apple-light placeholder:text-apple-gray/50 outline-none focus:ring-2 focus:ring-apple-blue/40 transition-all duration-200"
                  />
                </div>
              )}

              <div>
                <label htmlFor="signin-email" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5">
                  Email Address
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-2xl liquid-glass-light text-sm text-apple-dark dark:text-apple-light placeholder:text-apple-gray/50 outline-none focus:ring-2 focus:ring-apple-blue/40 transition-all duration-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="signin-password" className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      className="text-xs text-apple-blue hover:opacity-75 transition-opacity font-medium"
                      onClick={() => alert('Password reset flow coming soon.')}
                    >
                      Forgot password?
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
                    className="w-full px-4 py-3 pr-11 rounded-2xl liquid-glass-light text-sm text-apple-dark dark:text-apple-light placeholder:text-apple-gray/50 outline-none focus:ring-2 focus:ring-apple-blue/40 transition-all duration-200"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div role="alert" className="mb-4 px-4 py-3 rounded-2xl bg-apple-red/8 border border-apple-red/15 text-apple-red text-xs font-medium flex items-center gap-2">
                <span aria-hidden="true">⚠</span>
                {errorMsg}
              </div>
            )}

            <button
              id="signin-submit"
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden="true" />
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-apple-gray dark:text-apple-mid-gray">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setErrorMsg(''); setStatus('idle'); }}
              className="text-apple-blue font-semibold hover:opacity-75 transition-opacity"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </GlassCard>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => navigate('upgrade')}
            className="text-xs text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue transition-colors"
          >
            View plans & pricing →
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-apple-gray/60 dark:text-apple-mid-gray/60">
          Demo admin: admin@hardcompare.com / admin123
        </p>
      </div>
    </div>
  );
}
