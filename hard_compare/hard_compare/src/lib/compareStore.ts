// ─── Lightweight comparison store using localStorage + CustomEvents ───────────
// Allows cross-page "add to compare" without a heavy state manager.

const STORAGE_KEY = 'hardcompare-selected';
export const MAX_COMPARE = 4;

export function getSelectedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addToCompare(id: string): boolean {
  const ids = getSelectedIds();
  if (ids.includes(id) || ids.length >= MAX_COMPARE) return false;
  const next = [...ids, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('comparechange', { detail: next }));
  return true;
}

export function removeFromCompare(id: string): void {
  const next = getSelectedIds().filter(i => i !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('comparechange', { detail: next }));
}

export function setCompareIds(ids: string[]): void {
  const safe = ids.slice(0, MAX_COMPARE);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  window.dispatchEvent(new CustomEvent('comparechange', { detail: safe }));
}

export function clearCompare(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('comparechange', { detail: [] }));
}

export function isSelected(id: string): boolean {
  return getSelectedIds().includes(id);
}
