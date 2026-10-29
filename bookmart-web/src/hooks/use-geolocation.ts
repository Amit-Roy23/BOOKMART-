'use client';

import { useCallback, useEffect, useState } from 'react';

export interface Coords {
  lat: number;
  lng: number;
}

type GeoStatus = 'idle' | 'locating' | 'granted' | 'denied' | 'unsupported';

const CACHE_KEY = 'bookmart:last_coords';

function readCache(): Coords | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Coords) : null;
  } catch {
    return null;
  }
}

/** Browser geolocation with a per-session cache so pages don't re-prompt on every visit. */
export function useGeolocation({ auto = true }: { auto?: boolean } = {}) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');

  const locate = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(next);
        setStatus('granted');
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // Storage may be unavailable (private mode); the cache is only a convenience.
        }
      },
      () => setStatus('denied'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from sessionStorage after mount
      setCoords(cached);
      setStatus('granted');
    } else if (auto) {
      locate();
    }
  }, [auto, locate]);

  return { coords, status, locate, setCoords };
}
