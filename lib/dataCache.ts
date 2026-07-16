type CacheEntry<T> = { data: T; timestamp: number };

const cache = new Map<string, CacheEntry<unknown>>();

// In-memory only: cleared automatically when the app process restarts.
// Screens should treat a stale/missing entry as "go fetch from Supabase".
export function getCached<T>(key: string, maxAgeMs: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > maxAgeMs) return null;
  return entry.data as T;
}

export function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Called after any schedule write so a cached read never survives an edit.
// The cache only holds a couple of small screens' worth of data, so clearing
// all of it is simpler and safer than tracking per-screen dependencies.
export function invalidateCache(): void {
  cache.clear();
}
