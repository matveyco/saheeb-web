'use client';

import { useEffect, useState } from 'react';

/**
 * Module-level cache so multiple components share one fetch.
 * Resets on full page reload but deduplicates within a single render.
 */
let cachedCount: number | null = null;
let fetchPromise: Promise<number | null> | null = null;

function fetchCount(): Promise<number | null> {
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetch('/api/waitlist/count')
    .then((res) => res.json())
    .then((data: { count?: number }) => {
      if (typeof data.count === 'number') {
        cachedCount = data.count;
        return data.count;
      }
      return null;
    })
    .catch(() => null);

  return fetchPromise;
}

export function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(cachedCount);

  useEffect(() => {
    if (cachedCount !== null) {
      setCount(cachedCount);
      return;
    }

    let cancelled = false;

    fetchCount().then((result) => {
      if (!cancelled && result !== null) {
        setCount(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}
