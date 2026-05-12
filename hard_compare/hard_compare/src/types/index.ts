// ─── Route Types ─────────────────────────────────────────────────────────────

export type RouteKey =
  | 'home' | 'laptops' | 'desktops' | 'pc-vs-mac'
  | 'components' | 'compare' | 'guides'
  | 'about' | 'contact' | 'support'
  | 'dashboard' | 'admin' | 'signin' | 'upgrade'
  | '404' | '500';

export interface NavigateFn { (route: RouteKey): void; }
export interface PageProps { navigate: NavigateFn; }

// ─── Theme ───────────────────────────────────────────────────────────────────
export interface ThemeState { isDark: boolean; toggleTheme: () => void; }

// ─── Computer / Hardware Models ───────────────────────────────────────────────
export type ModelCategory = 'laptop' | 'desktop' | 'component';
export type ComponentSubtype = 'cpu' | 'gpu' | 'ram' | 'storage' | 'display';
export type LaptopSubtype = 'ultrabook' | 'gaming' | 'professional' | 'creator';
export type DesktopSubtype = 'mini' | 'all-in-one' | 'tower' | 'workstation' | 'custom';

export interface ComputerModel {
  id: string;
  name: string;
  brand: string;
  category: ModelCategory;
  subtype: string;
  price: number;
  priceLabel: string;
  os: 'macOS' | 'Windows' | 'Linux' | 'N/A';
  releaseYear: number;

  // Core specs
  cpu: string;
  cpuCores?: string;
  gpu: string;
  gpuVram?: string;
  ram: string;
  ramType?: string;
  storage: string;

  // Display / physical
  display?: string;
  resolution?: string;
  refreshRate?: string;
  panelType?: string;
  battery?: string;
  weight?: string;
  ports?: string;
  webcam?: string;

  // Scores 0–100
  performanceScore: number;
  efficiencyScore: number;
  valueScore: number;
  batteryScore?: number;

  // Visual
  gradient: string;
  icon: string;
  badge?: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavLink { label: string; route: RouteKey; highlight?: boolean; }

// ─── Comparison ──────────────────────────────────────────────────────────────
export interface SpecRow {
  label: string;
  key: keyof ComputerModel;
  unit?: string;
  higherIsBetter: boolean;
  format: 'text' | 'currency' | 'score';
}

// ─── Guide ───────────────────────────────────────────────────────────────────
export interface Guide {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  gradient: string;
  icon: string;
  publishDate: string;
  highlights: string[];
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export interface FaqItem { id: string; question: string; answer: string; category: string; }

// ─── Admin ───────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string; name: string; email: string;
  role: string; status: 'active' | 'inactive' | 'pending'; joinDate: string;
}
export interface StatsCard { label: string; value: string; change: string; positive: boolean; icon: string; }

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: string;
  joinDate: string;
  savedComparisons?: string[][];
}
