// Universal key-value storage: localStorage on web, in-memory fallback on native
// (demo mode only — cloud mode persists in Supabase).
const hasLS = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const mem = {};

export function get(key) {
  try {
    return hasLS ? window.localStorage.getItem(key) : mem[key] ?? null;
  } catch {
    return null;
  }
}

export function set(key, value) {
  try {
    if (hasLS) window.localStorage.setItem(key, value);
    else mem[key] = value;
  } catch {}
}

export function del(key) {
  try {
    if (hasLS) window.localStorage.removeItem(key);
    else delete mem[key];
  } catch {}
}
