import { useState, useEffect, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import type { PageProps } from '../types';
import {
  apiGetAdminStats, apiGetAdminUsers, apiGetAdminProducts,
  apiUpdateAdminUser, apiDeleteAdminUser,
  type BackendUser, type AdminStats,
} from '../lib/api';

type AdminProduct = { id: string; name: string; brand: string; category: string; price: number; priceLabel: string; status: string };

const STATUS_BADGE: Record<string, string> = {
  active:   'bg-green-500/12 text-green-600 dark:text-green-400',
  inactive: 'bg-apple-gray/12 text-apple-gray',
  pending:  'bg-amber-500/12 text-amber-600 dark:text-amber-400',
};

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-16" aria-hidden="true">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <div
            className={`rounded-sm ${color} transition-all duration-500`}
            style={{ height: `${(v / max) * 100}%`, minHeight: '4px' }}
          />
        </div>
      ))}
    </div>
  );
}

type AdminTab = 'overview' | 'users' | 'products';

export default function Admin({ navigate }: PageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [userFilter, setUserFilter] = useState('');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Check admin access via token role
  const [accessDenied, setAccessDenied] = useState(false);
  const token = localStorage.getItem('hc-token');
  useEffect(() => {
    if (!token) { setAccessDenied(true); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') setAccessDenied(true);
    } catch { setAccessDenied(true); }
  }, [token]);

  // Load stats on mount
  useEffect(() => {
    if (accessDenied) return;
    apiGetAdminStats().then(setStats).catch(() => {});
  }, [accessDenied]);

  // Load users when tab is active
  const loadUsers = useCallback(() => {
    setLoadingUsers(true);
    apiGetAdminUsers(userFilter || undefined)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [userFilter]);

  useEffect(() => {
    if (activeTab === 'users' && !accessDenied) loadUsers();
  }, [activeTab, loadUsers, accessDenied]);

  // Load products when tab is active
  useEffect(() => {
    if (activeTab === 'products' && !accessDenied && products.length === 0) {
      setLoadingProducts(true);
      apiGetAdminProducts()
        .then(setProducts)
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [activeTab, accessDenied, products.length]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Remove this user?')) return;
    try {
      await apiDeleteAdminUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      apiGetAdminStats().then(setStats).catch(() => {});
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleToggleStatus = async (user: BackendUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await apiUpdateAdminUser(user.id, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <GlassCard padding="xl" radius="3xl" className="max-w-sm text-center">
          <span className="text-5xl block mb-4" aria-hidden="true">🔒</span>
          <h1 className="font-bold text-xl text-apple-dark dark:text-apple-light mb-3">Access Restricted</h1>
          <p className="text-sm text-apple-gray dark:text-apple-mid-gray mb-6">This area requires admin privileges.</p>
          <button className="btn-primary" onClick={() => navigate('signin')}>Sign In</button>
        </GlassCard>
      </div>
    );
  }

  const filteredUsers = userFilter
    ? users.filter(u =>
        u.name.toLowerCase().includes(userFilter.toLowerCase()) ||
        u.email.toLowerCase().includes(userFilter.toLowerCase())
      )
    : users;

  return (
    <div className="pt-12 min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`flex-shrink-0 transition-all duration-400 glass border-r border-black/5 dark:border-white/5 flex flex-col ${
            sidebarOpen ? 'w-56' : 'w-16'
          }`}
          style={{ minHeight: 'calc(100vh - 3rem)', transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
          aria-label="Admin sidebar"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-black/5 dark:border-white/5">
            {sidebarOpen && (
              <span className="text-xs font-bold text-apple-gray dark:text-apple-mid-gray uppercase tracking-widest">Admin</span>
            )}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8 transition-colors ml-auto"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={sidebarOpen}
            >
              <svg className={`w-4 h-4 text-apple-gray transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Admin navigation">
            {([
              { id: 'overview' as AdminTab, label: 'Overview',  icon: '◼' },
              { id: 'users'    as AdminTab, label: 'Users',     icon: '👥' },
              { id: 'products' as AdminTab, label: 'Products',  icon: '📦' },
            ]).map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-apple-blue/12 text-apple-blue font-medium'
                    : 'text-apple-gray dark:text-apple-mid-gray hover:bg-black/5 dark:hover:bg-white/8'
                }`}
                aria-current={activeTab === id ? 'page' : undefined}
                title={!sidebarOpen ? label : undefined}
              >
                <span className="text-base flex-shrink-0" aria-hidden="true">{icon}</span>
                {sidebarOpen && <span className="text-sm">{label}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div className="p-4 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => navigate('home')}
                className="w-full flex items-center gap-2 text-xs text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to site
              </button>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {/* ── Overview tab ── */}
          {activeTab === 'overview' && (
            <section aria-labelledby="overview-heading">
              <h1 id="overview-heading" className="text-2xl font-bold text-apple-dark dark:text-apple-light mb-8">
                Overview
              </h1>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Users',    value: stats ? String(stats.totalUsers)    : '—', change: stats ? `+${stats.newUsersThisMonth} this month` : '', icon: '👥', positive: true },
                  { label: 'Active Users',   value: stats ? String(stats.activeUsers)   : '—', change: '',    icon: '✅', positive: true },
                  { label: 'Hardware Models',value: stats ? String(stats.totalModels)   : '—', change: '',    icon: '💻', positive: true },
                  { label: 'Contact Msgs',   value: stats ? String(stats.totalContacts) : '—', change: stats && stats.pendingContacts > 0 ? `${stats.pendingContacts} pending` : '', icon: '✉️', positive: false },
                ].map((stat) => (
                  <GlassCard key={stat.label} padding="md" radius="2xl">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
                      {stat.change ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          stat.positive ? 'bg-green-500/12 text-green-600 dark:text-green-400' : 'bg-apple-red/12 text-apple-red'
                        }`}>
                          {stat.change}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xl font-bold text-apple-dark dark:text-apple-light">{stat.value}</p>
                    <p className="text-xs text-apple-gray dark:text-apple-mid-gray mt-0.5">{stat.label}</p>
                  </GlassCard>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-8">
                <GlassCard padding="lg" radius="2xl">
                  <h2 className="text-sm font-semibold text-apple-dark dark:text-apple-light mb-1">Monthly Sign-ups</h2>
                  <p className="text-xs text-apple-gray dark:text-apple-mid-gray mb-4">Last 12 months (sample)</p>
                  <MiniBarChart data={[42, 58, 65, 71, 80, 75, 90, 88, 95, 102, 115, 130]} color="bg-apple-blue/60" />
                  <div className="flex justify-between mt-2 text-xs text-apple-gray dark:text-apple-mid-gray">
                    <span>Apr</span><span>Jul</span><span>Oct</span><span>Mar</span>
                  </div>
                </GlassCard>
                <GlassCard padding="lg" radius="2xl">
                  <h2 className="text-sm font-semibold text-apple-dark dark:text-apple-light mb-1">Revenue (M$)</h2>
                  <p className="text-xs text-apple-gray dark:text-apple-mid-gray mb-4">Last 12 months (sample)</p>
                  <MiniBarChart data={[2.1, 2.4, 2.8, 3.0, 3.2, 3.1, 3.5, 3.4, 3.7, 3.9, 4.1, 4.2]} color="bg-apple-mint/60" />
                  <div className="flex justify-between mt-2 text-xs text-apple-gray dark:text-apple-mid-gray">
                    <span>Apr</span><span>Jul</span><span>Oct</span><span>Mar</span>
                  </div>
                </GlassCard>
              </div>
            </section>
          )}

          {/* ── Users tab ── */}
          {activeTab === 'users' && (
            <section aria-labelledby="users-heading">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 id="users-heading" className="text-2xl font-bold text-apple-dark dark:text-apple-light">
                  Users {stats && <span className="text-sm font-normal text-apple-gray ml-2">({stats.totalUsers} total)</span>}
                </h1>
                <div className="flex gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      type="search"
                      placeholder="Search users…"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                      className="pl-9 pr-4 py-2 rounded-full glass text-sm text-apple-dark dark:text-apple-light placeholder-apple-gray/60 outline-none focus:ring-2 focus:ring-apple-blue/50"
                      aria-label="Filter users"
                    />
                  </div>
                  <button className="btn-primary !py-2 !px-4 !text-sm" onClick={loadUsers}>Refresh</button>
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 rounded-full border-2 border-apple-blue border-t-transparent animate-spin" />
                </div>
              ) : (
                <GlassCard padding="none" radius="2xl" className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full" aria-label="Users table">
                      <thead>
                        <tr className="border-b border-black/5 dark:border-white/5">
                          {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-apple-gray dark:text-apple-mid-gray uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <tr
                            key={u.id}
                            className={`border-b border-black/3 dark:border-white/3 hover:bg-apple-blue/3 transition-colors duration-150 ${i === filteredUsers.length - 1 ? 'border-b-0' : ''}`}
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-apple-blue/60 to-apple-indigo/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0" aria-hidden="true">
                                  {u.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-apple-dark dark:text-apple-light">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-apple-gray dark:text-apple-mid-gray">{u.email}</td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-apple-blue/12 text-apple-blue' : 'bg-apple-gray/12 text-apple-gray'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[u.status] ?? ''}`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-apple-gray dark:text-apple-mid-gray">{u.joinDate}</td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleStatus(u)}
                                  className="text-xs text-apple-blue hover:opacity-70 transition-opacity font-medium"
                                >
                                  {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="text-xs text-apple-red hover:opacity-70 transition-opacity font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12 text-sm text-apple-gray dark:text-apple-mid-gray">
                        {userFilter ? `No users found matching "${userFilter}"` : 'No users yet'}
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}
            </section>
          )}

          {/* ── Products tab ── */}
          {activeTab === 'products' && (
            <section aria-labelledby="products-admin-heading">
              <div className="flex items-center justify-between mb-8">
                <h1 id="products-admin-heading" className="text-2xl font-bold text-apple-dark dark:text-apple-light">
                  Hardware Catalog
                </h1>
              </div>

              {loadingProducts ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 rounded-full border-2 border-apple-blue border-t-transparent animate-spin" />
                </div>
              ) : (
                <GlassCard padding="none" radius="2xl" className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full" aria-label="Products table">
                      <thead>
                        <tr className="border-b border-black/5 dark:border-white/5">
                          {['Product', 'Brand', 'Category', 'Price', 'Status'].map(h => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-apple-gray dark:text-apple-mid-gray uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, i) => (
                          <tr
                            key={p.id}
                            className={`border-b border-black/3 dark:border-white/3 hover:bg-apple-blue/3 transition-colors ${i === products.length - 1 ? 'border-b-0' : ''}`}
                          >
                            <td className="px-5 py-4 text-sm font-medium text-apple-dark dark:text-apple-light">{p.name}</td>
                            <td className="px-5 py-4 text-sm text-apple-gray dark:text-apple-mid-gray">{p.brand}</td>
                            <td className="px-5 py-4 text-sm text-apple-gray dark:text-apple-mid-gray capitalize">{p.category}</td>
                            <td className="px-5 py-4 text-sm font-semibold text-apple-dark dark:text-apple-light">{p.priceLabel}</td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/12 text-green-600 dark:text-green-400 capitalize">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
