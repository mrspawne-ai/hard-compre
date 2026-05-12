const STORAGE_KEY = 'hardcompare-favorites';

export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): boolean {
  const ids = getFavoriteIds();
  const next = ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('favchange', { detail: next }));
  return !ids.includes(id);
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

export function removeFavorite(id: string): void {
  const next = getFavoriteIds().filter(i => i !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('favchange', { detail: next }));
}
