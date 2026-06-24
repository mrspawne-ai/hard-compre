import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps, User } from '../types';
import { apiGetMe, apiUpdateMe, clearAuth, ApiError } from '../lib/api';
import { getFavoriteIds, removeFavorite } from '../lib/favoritesStore';
import { ALL_MODELS } from '../lib/data';
import { addToCompare } from '../lib/compareStore';

function StatCard({ label, value, tag }: { label: string; value: string; tag: string }) {
  return (
    <GlassCard padding="md" className="flex flex-col gap-2">
      <span className="ascii-icon w-10 h-6 text-[0.55rem] text-apple-blue border-apple-blue">{tag}</span>
      <p className="text-xl font-black text-apple-dark dark:text-apple-light tabular-nums">{value}</p>
      <p className="text-[0.6rem] font-bold uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">{label}</p>
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
      .then(u => { setUser(u); setFormName(u.name); setFormEmail(u.email); })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          clearAuth(); navigate('signin');
        } else {
          setLoadError(err instanceof Error ? err.message : 'Could not load account');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { clearAuth(); navigate('home'); };

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

  const inputClass = 'w-full px-3 py-2.5 liquid-glass text-xs text-apple-dark dark:text-apple-light outline-none focus:border-apple-blue transition-colors duration-150 disabled:opacity-50';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-apple-blue border-t-transparent animate-spin" />
          <p className="text-[0.65rem] uppercase tracking-widest text-apple-gray">Loading…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <GlassCard padding="xl" className="max-w-sm text-center">
          <span className="text-[0.7rem] font-black uppercase tracking-widest text-apple-red block mb-3">[error]</span>
          <h2 className="font-bold text-apple-dark dark:text-apple-light mb-2 uppercase tracking-wide">Could not load account</h2>
          <p className="text-xs text-apple-gray dark:text-apple-mid-gray mb-5">{loadError}</p>
          <div className="flex gap-3 justify-center">
            <button className="btn-secondary" onClick={() => { setLoadError(''); setLoading(true); apiGetMe().then(u => { setUser(u); setFormName(u.name); setFormEmail(u.email); }).catch((err: unknown) => { if (err instanceof ApiError && err.status === 401) { clearAuth(); navigate('signin'); } else { setLoadError(err instanceof Error ? err.message : 'Error'); } }).finally(() => setLoading(false)); }}>
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
    <div className="pt-12 pb-24 min-h-screen">
      <div className="section-container py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-black/8 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 border border-apple-blue flex items-center justify-center text-apple-blue font-black text-base"
              aria-label={`Avatar for ${user.name}`}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wide text-apple-dark dark:text-apple-light">
                {user.name}
              </h1>
              <p className="text-[0.65rem] text-apple-gray dark:text-apple-mid-gray mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="label-chip text-apple-blue border-apple-blue">{user.plan} Plan</span>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className="label-chip text-apple-orange border-apple-orange hover:bg-apple-orange hover:text-white transition-colors duration-150"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="text-[0.6rem] font-bold uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray hover:text-apple-red border border-current hover:border-apple-red px-2.5 py-1 transition-colors duration-150"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <section aria-labelledby="stats-heading" className="mb-8">
          <h2 id="stats-heading" className="sr-only">Your statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Member since" value={user.joinDate?.split(' ').pop() ?? '—'} tag="DAT" />
            <StatCard label="Plan" value={user.plan} tag="PLN" />
            <StatCard label="Role" value={user.role === 'admin' ? 'Admin' : 'User'} tag="USR" />
            <StatCard label="Status" value="Active" tag="STS" />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Account settings */}
          <section aria-labelledby="settings-heading" className="lg:col-span-2">
            <GlassCard padding="lg">
              <div className="flex items-center justify-between mb-5">
                <h2 id="settings-heading" className="text-xs font-black uppercase tracking-widest text-apple-dark dark:text-apple-light">
                  Account Settings
                </h2>
                <button
                  onClick={() => { setEditMode(e => !e); setSaveStatus('idle'); setSaveError(''); }}
                  className="text-[0.6rem] font-bold uppercase tracking-widest text-apple-blue border border-apple-blue px-2.5 py-1 hover:bg-apple-blue hover:text-white transition-all duration-150"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="flex flex-col gap-3 mb-5">
                  <div>
                    <label className="block text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray mb-1.5" htmlFor="dash-name">
                      Full Name
                    </label>
                    <input id="dash-name" type="text" value={formName} onChange={e => setFormName(e.target.value)} disabled={!editMode} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray mb-1.5" htmlFor="dash-email">
                      Email
                    </label>
                    <input id="dash-email" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} disabled={!editMode} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray mb-1.5" htmlFor="dash-plan">
                      Plan
                    </label>
                    <div className="flex items-center justify-between px-3 py-2.5 liquid-glass">
                      <span className="text-xs font-bold text-apple-dark dark:text-apple-light uppercase" id="dash-plan">{user.plan}</span>
                      <button type="button" onClick={() => navigate('upgrade')} className="text-[0.6rem] font-bold uppercase tracking-widest text-apple-blue hover:opacity-70 transition-opacity">
                        Upgrade →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-5 pt-4 border-t border-black/5 dark:border-white/5">
                  <h3 className="text-[0.6rem] font-black uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">Preferences</h3>
                  {[
                    { label: 'Email Notifications', value: notifications, onChange: setNotifications },
                    { label: 'Two-Factor Auth', value: twoFactor, onChange: setTwoFactor },
                  ].map(({ label, value, onChange }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5">
                      <span className="text-xs text-apple-dark dark:text-apple-light uppercase tracking-wide font-medium">{label}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={value}
                        aria-label={`Toggle ${label}`}
                        onClick={() => onChange(v => !v)}
                        className={`w-10 h-5 border transition-colors duration-150 relative ${value ? 'bg-apple-blue border-apple-blue' : 'bg-transparent border-current text-apple-gray'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-current transition-all duration-150 ${value ? 'translate-x-5 bg-white' : 'translate-x-0.5'}`} aria-hidden="true" style={{ background: value ? '#fff' : 'currentColor' }} />
                      </button>
                    </div>
                  ))}
                </div>

                {saveStatus === 'error' && (
                  <div role="alert" className="mb-4 px-3 py-2 border border-apple-red bg-apple-red/5 text-apple-red text-[0.68rem] font-medium">
                    [!] {saveError}
                  </div>
                )}

                {editMode && (
                  <button type="submit" disabled={saveStatus === 'saving'} className="btn-primary w-full justify-center disabled:opacity-50">
                    {saveStatus === 'saving' ? (
                      <><span className="w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin" aria-hidden="true" /> Saving…</>
                    ) : saveStatus === 'saved' ? '✓ Saved' : 'Save Changes'}
                  </button>
                )}
              </form>
            </GlassCard>
          </section>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <GlassCard padding="md">
              <h3 className="text-[0.6rem] font-black uppercase tracking-widest text-apple-dark dark:text-apple-light mb-4">Quick Actions</h3>
              <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
                {[
                  { label: 'Compare Tool',  tag: 'CMP', action: () => navigate('compare') },
                  { label: 'Laptops',       tag: 'LAP', action: () => navigate('laptops') },
                  { label: 'Components',    tag: 'CMP', action: () => navigate('components') },
                  { label: 'Buying Guides', tag: 'GDE', action: () => navigate('guides') },
                ].map(({ label, tag, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex items-center gap-3 py-2.5 text-left hover:text-apple-blue transition-colors duration-150"
                  >
                    <span className="ascii-icon w-9 h-5 text-[0.5rem] text-apple-gray dark:text-apple-mid-gray shrink-0">{tag}</span>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wide text-apple-dark dark:text-apple-light">{label}</span>
                    <span className="ml-auto text-apple-gray text-xs">→</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard padding="md">
              <h3 className="text-[0.6rem] font-black uppercase tracking-widest text-apple-dark dark:text-apple-light mb-3">Account Info</h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Member since', value: user.joinDate },
                  { label: 'Plan',         value: user.plan },
                  { label: 'Role',         value: user.role === 'admin' ? 'Administrator' : 'Member' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-black/5 dark:border-white/5 last:border-0">
                    <span className="text-[0.6rem] uppercase tracking-widest text-apple-gray dark:text-apple-mid-gray">{item.label}</span>
                    <span className="text-[0.7rem] font-bold text-apple-dark dark:text-apple-light">{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </aside>
        </div>

        {/* Favorites */}
        {favIds.length > 0 && (
          <section aria-labelledby="favorites-heading" className="mt-6">
            <GlassCard padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="label-chip text-apple-orange border-apple-orange">Saved</span>
                  <h2 id="favorites-heading" className="text-xs font-black uppercase tracking-widest text-apple-dark dark:text-apple-light">
                    Saved Models
                  </h2>
                </div>
                <span className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">{favIds.length} items</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {favIds.map(id => {
                  const model = ALL_MODELS.find(m => m.id === id);
                  if (!model) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 px-3 py-3 liquid-glass">
                      <span className="ascii-icon w-9 h-6 text-[0.5rem] text-apple-blue border-apple-blue shrink-0" aria-hidden="true">
                        {(model.subtype ?? 'DEV').slice(0, 3).toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.7rem] font-bold text-apple-dark dark:text-apple-light truncate uppercase tracking-wide">{model.name}</p>
                        <p className="text-[0.6rem] text-apple-gray dark:text-apple-mid-gray">{model.priceLabel}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => { addToCompare(id); navigate('compare'); }}
                          className="text-[0.58rem] font-bold uppercase tracking-wide px-2 py-1 border border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white transition-colors duration-150"
                          aria-label={`Compare ${model.name}`}
                        >
                          CMP
                        </button>
                        <button
                          onClick={() => removeFavorite(id)}
                          className="text-[0.58rem] font-bold px-2 py-1 border border-current text-apple-gray hover:text-apple-red hover:border-apple-red transition-colors duration-150"
                          aria-label={`Remove ${model.name}`}
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
