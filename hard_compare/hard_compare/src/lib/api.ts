import type { User } from '../types';

const BASE = '/api';

// Custom error that carries the HTTP status so callers can distinguish
// 401 (bad token → redirect to signin) from network errors (backend down → show message)
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('hc-token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(options.headers as Record<string, string>),
      },
      ...options,
    });
  } catch {
    // Network error (backend down, no proxy, etc.)
    throw new ApiError('Cannot connect to server. Make sure the backend is running.', 0);
  }

  const data = await res.json().catch(() => ({ error: 'Invalid server response' }));
  if (!res.ok) throw new ApiError(data.error || 'Request failed', res.status);
  return data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiSignUp(name: string, email: string, password: string) {
  return request<{ user: User; token: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function apiSignIn(email: string, password: string) {
  return request<{ user: User; token: string }>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetMe(): Promise<User> {
  return request<User>('/auth/me');
}

export async function apiUpdateMe(data: { name?: string; email?: string }): Promise<User> {
  return request<User>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
}

// ── Contact ───────────────────────────────────────────────────────────────────

export async function apiSubmitContact(form: {
  name: string; email: string; subject?: string; message: string;
}): Promise<{ message: string }> {
  return request('/contact', { method: 'POST', body: JSON.stringify(form) });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface BackendUser {
  id: string; name: string; email: string;
  role: string; status: 'active' | 'inactive' | 'pending';
  plan: string; joinDate: string; createdAt: string;
}

export interface AdminStats {
  totalUsers: number; activeUsers: number; newUsersThisMonth: number;
  totalModels: number; totalContacts: number; pendingContacts: number;
}

export async function apiGetAdminStats(): Promise<AdminStats> {
  return request('/admin/stats');
}

export async function apiGetAdminUsers(q?: string): Promise<BackendUser[]> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : '';
  return request(`/admin/users${qs}`);
}

export async function apiUpdateAdminUser(id: string, data: Partial<BackendUser>): Promise<BackendUser> {
  return request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function apiDeleteAdminUser(id: string): Promise<{ message: string }> {
  return request(`/admin/users/${id}`, { method: 'DELETE' });
}

export async function apiGetAdminProducts() {
  return request<{ id: string; name: string; brand: string; category: string; price: number; priceLabel: string; status: string }[]>('/admin/products');
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export function saveAuth(token: string, user: User): void {
  localStorage.setItem('hc-token', token);
  localStorage.setItem('liquidOS-user', JSON.stringify(user));
  localStorage.setItem('liquidOS-auth', 'true');
}

export function clearAuth(): void {
  localStorage.removeItem('hc-token');
  localStorage.removeItem('liquidOS-user');
  localStorage.removeItem('liquidOS-auth');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('hc-token');
}
