import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps, User } from '../types';
import { apiGetMe, apiUpdateMe, clearAuth, ApiError } from '../lib/api';
import { getFavoriteIds, removeFavorite } from '../lib/favoritesStore';
import { ALL_MODELS } from '../lib/data';
import { addToCompare } from '../lib/compareStore';

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <GlassCard padding="md" radius="2xl">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold text-apple-dark dark:text-apple-light">{value}</p>
      <p className="text-xs text-apple-gray dark:text-apple-mid-gray mt-0.5">{label}</p>
    </GlassCard>
  );
}

export default function Dashboard({ navigate }: PageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [favIds, setFavIds] = useState<string[]>(() => getFavoriteIds());

  useEffect(() => {
    const handler = () => setFavIds(getFavoriteIds());
    window.addEventListener('favchange', handler);
    return () => window.removeEventListener('favchange', handler);
  }, []);

  useEffect(() => {
    apiGetMe()
      .then(u => {
        setUser(u);
        setFormName(u.name);
        setFormEmail(u.email);
      })
      .catch((err: unknown) => {
        // Only clear auth and redirect if the token is actually invalid (401)
        // For network errors (status 0) keep the user on the page and show a message
        if (err instanceof ApiError && err.status === 401) {
          clearAuth();
          navigate('signin');
        } else {
          setLoadError(err instanceof Error ? err.message : 'Could not load account');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate('home');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaveStatus('saving');
    setSaveError('');
    try {
      const updated = await apiUpdateMe({ name: formName, email: formEmail });
      setUser(updated);
      setSaveStatus('saved');
      setEditMode(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-apple-blue border-t-transparent animate-spin" />
          <p className="text-sm text-apple-gray">Loading…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <GlassCard padding="xl" radius="3xl" className="max-w-sm text-center">
          <span className="text-5xl block mb-4" aria-hidden="true">⚠️</span>
          <h2 className="font-bold text-lg text-apple-dark dark:text-apple-light mb-2">Could not load account</h2>
          <p className="text-sm text-apple-gray dark:text-apple-mid-gray mb-6">{loadError}</p>
          <div className="flex gap-3 justify-center">
            <button className="btn-secondary" onClick={() => { setLoadError(''); setLoading(true); apiGetMe().then(u => { setUser(u); setFormName(u.name); setFormEmail(u.email); }).catch((err: unknown) => { if (err instanceof ApiError && err.status === 401) { clearAuth(); navigate('signin'); } else { setLoadError(err instanceof Error ? err.message : 'Could not load account'); } }).finally(() => setLoading(false)); }}>
              Retry
            </button>
            <button className="btn-primary" onClick={() => { clearAuth(); navigate('signin'); }}>
              Sign In Again
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="pt-20 pb-28 min-h-screen">
      <div className="section-container py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-apple-blue to-apple-indigo flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-apple-blue/30"
                aria-label={`Avatar for ${user.name}`}
              >
                {initials}
              </div>
              <span
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-apple-mint border-2 border-white dark:border-apple-dark"
                title="Online"
                aria-label="Status: Online"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-apple-dark dark:text-apple-light">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <p className="text-sm text-apple-gray dark:text-apple-mid-gray">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-apple-blue/12 text-apple-blue flex items-center gap-1">
              ✦ {user.plan} Plan
            </span>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className="px-4 py-1.5 rounded-full text-xs font-medium glass text-apple-blue hover:bg-apple-blue/8 transition-all duration-200"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full text-xs font-medium glass text-apple-gray dark:text-apple-mid-gray hover:text-apple-red hover:bg-apple-red/8 transition-all duration-200"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>

        <section aria-labelledby="stats-heading" className="mb-10">
          <h2 id="stats-heading" className="sr-only">Your statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Member since" value={user.joinDate?.split(' ').pop() ?? '—'} icon="🗓" color="bg-orange-500/12 text-orange-500" />
            <StatCard label="Plan" value={user.plan} icon="✦" color="bg-blue-500/12 text-blue-500" />
            <StatCard label="Role" value={user.role === 'admin' ? 'Admin' : 'User'} icon="👤" color="bg-purple-500/12 text-purple-500" />
            <StatCard label="Status" value="Active" icon="✓" color="bg-green-500/12 text-green-500" />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <section aria-labelledby="settings-heading" className="lg:col-span-2">
            <GlassCard padding="lg" radius="3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 id="settings-heading" className="text-lg font-bold text-apple-dark dark:text-apple-light">
                  Account Settings
                </h2>
                <button
                  onClick={() => { setEditMode(e => !e); setSaveStatus('idle'); setSaveError(''); }}
                  className="text-sm text-apple-blue hover:opacity-75 transition-opacity font-medium"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5" htmlFor="dash-name">
                      Full Name
                    </label>
                    <input
                      id="dash-name"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      disabled={!editMode}
                      className="w-full px-4 py-3 rounded-2xl glass text-sm text-apple-dark dark:text-apple-light outline-none focus:ring-2 focus:ring-apple-blue/50 disabled:opacity-60 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5" htmlFor="dash-email">
                      Email Address
                    </label>
                    <input
                      id="dash-email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      disabled={!editMode}
                      className="w-full px-4 py-3 rounded-2xl glass text-sm text-apple-dark dark:text-apple-light outline-none focus:ring-2 focus:ring-apple-blue/50 disabled:opacity-60 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-apple-gray dark:text-apple-mid-gray mb-1.5" htmlFor="dash-plan">
                      Current Plan
                    </label>
                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl glass">
                      <span className="text-sm text-apple-dark dark:text-apple-light font-medium" id="dash-plan">
                        {user.plan}
                      </span>
                      <button type="button" onClick={() => navigate('upgrade')} className="text-xs text-apple-blue font-medium hover:opacity-75 transition-opacity">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-black/5 dark:border-white/5">
                  <h3 className="text-sm font-semibold text-apple-dark dark:text-apple-light">Preferences</h3>
                  {[
                    { label: 'Email Notifications', value: notifications, onChange: setNotifications },
                    { label: 'Two-Factor Authentication', value: twoFactor, onChange: setTwoFactor },
                  ].map(({ label, value, onChange }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-apple-gray dark:text-apple-mid-gray">{label}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={value}
                        aria-label={`Toggle ${label}`}
                        onClick={() => onChange(v => !v)}
                        className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer ${value ? 'bg-apple-blue' : 'bg-apple-mid-gray/50 dark:bg-apple-gray/40'}`}
                      >
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-1'}`} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                {saveStatus === 'error' && (
                  <div role="alert" className="mb-4 px-4 py-3 rounded-2xl bg-apple-red/8 border border-apple-red/15 text-apple-red text-xs font-medium">
                    {saveError}
                  </div>
                )}

                {editMode && (
                  <button
                    type="submit"
                    disabled={saveStatus === 'saving'}
                    className="btn-primary w-full disabled:opacity-60"
                    style={{ justifyContent: 'center' }}
                  >
                    {saveStatus === 'saving' ? (
                      <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden="true" /> Saving…</>
                    ) : saveStatus === 'saved' ? '✓ Saved!' : 'Save Changes'}
                  </button>
                )}
              </form>
            </GlassCard>
          </section>

          <aside className="space-y-4">
            <GlassCard padding="md" radius="2xl">
              <h3 className="text-sm font-semibold text-apple-dark dark:text-apple-light mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Open Compare Tool',  icon: '⚡', action: () => navigate('compare') },
                  { label: 'Browse Laptops',     icon: '💻', action: () => navigate('laptops') },
                  { label: 'Browse Components',  icon: '⚙️', action: () => navigate('components') },
                  { label: 'Buying Guides',      icon: '📖', action: () => navigate('guides') },
                ].map(({ label, icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-apple-blue/6 transition-colors duration-150 text-left"
                  >
                    <span className="text-base" aria-hidden="true">{icon}</span>
                    <span className="text-sm text-apple-dark dark:text-apple-light">{label}</span>
                    <svg className="w-3.5 h-3.5 text-apple-gray ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard padding="md" radius="2xl">
              <h3 className="text-sm font-semibold text-apple-dark dark:text-apple-light mb-4">Account Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'Member since', value: user.joinDate },
                  { label: 'Plan', value: user.plan },
                  { label: 'Role', value: user.role === 'admin' ? 'Administrator' : 'Member' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-apple-gray dark:text-apple-mid-gray">{item.label}</span>
                    <span className="text-xs font-medium text-apple-dark dark:text-apple-light">{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </aside>
        </div>

        {/* Saved models (favorites) */}
        {favIds.length > 0 && (
          <section aria-labelledby="favorites-heading" className="mt-8">
            <GlassCard padding="lg" radius="3xl">
              <div className="flex items-center justify-between mb-5">
                <h2 id="favorites-heading" className="text-lg font-bold text-apple-dark dark:text-apple-light">
                  Saved Models
                </h2>
                <span className="text-xs text-apple-gray">{favIds.length} saved</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favIds.map(id => {
                  const model = ALL_MODELS.find(m => m.id === id);
                  if (!model) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 px-3 py-3 rounded-2xl liquid-glass">
                      <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-xl shrink-0`} aria-hidden="true">
                        {model.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-apple-dark dark:text-apple-light truncate">{model.name}</p>
                        <p className="text-xs text-apple-gray dark:text-apple-mid-gray">{model.priceLabel}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => { addToCompare(id); navigate('compare'); }}
                          className="text-[10px] font-medium px-2 py-1 rounded-lg bg-apple-blue/10 text-apple-blue hover:bg-apple-blue hover:text-white transition-colors"
                          aria-label={`Compare ${model.name}`}
                        >
                          Compare
                        </button>
                        <button
                          onClick={() => removeFavorite(id)}
                          className="text-[10px] font-medium px-2 py-1 rounded-lg bg-black/5 dark:bg-white/8 text-apple-gray hover:text-apple-red hover:bg-apple-red/10 transition-colors"
                          aria-label={`Remove ${model.name} from saved`}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </section>
        )}
      </div>
    </div>
  );
}
