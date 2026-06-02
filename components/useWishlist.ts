'use client';
import { useEffect, useState, useCallback } from 'react';

const KEY = 'gcalen.wishlist.v1';

function load(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function save(s: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...s]));
  } catch { /* quota */ }
}

export function useWishlist() {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  // hydrate on mount (avoid SSR mismatch)
  useEffect(() => { setIds(load()); }, []);

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      save(next);
      return next;
    });
  }, []);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  return { ids, toggle, has };
}
