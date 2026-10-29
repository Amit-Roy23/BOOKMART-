import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENDPOINTS } from '@/lib/endpoints';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/+$/,
  ''
);

const ACCESS_KEY = 'bookmart:access_token';
const REFRESH_KEY = 'bookmart:refresh_token';
export const AUTH_CHANGE_EVENT = 'bookmart:auth-change';

// ── Token storage (localStorage; the mobile app uses SecureStore) ──

export const tokenStorage = {
  getAccess(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(tokens: { access: string; refresh?: string }) {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    if (tokens.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  },
};

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A single in-flight refresh shared by every request that hits a 401 at once,
// so a rotated refresh token is never used twice.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${API_URL}${ENDPOINTS.AUTH.REFRESH}`, { refresh });
    if (!data?.access) return null;
    tokenStorage.set({ access: data.access, refresh: data.refresh });
    return data.access as string;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const isAuthCall = original?.url?.includes('/auth/');

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccess = await refreshPromise;
      if (newAccess) {
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }
      tokenStorage.clear();
    }
    return Promise.reject(error);
  }
);

/** Turn a DRF error payload into one readable message. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  if (!error.response) return 'Cannot reach the Bookmart server. Check your connection.';
  const data = error.response.data as unknown;
  if (typeof data === 'string') return data.length < 200 ? data : fallback;
  if (Array.isArray(data)) return String(data[0] ?? fallback);
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === 'string') return record.detail;
    for (const [key, value] of Object.entries(record)) {
      const first = Array.isArray(value) ? value[0] : value;
      if (typeof first === 'string') {
        return key === 'non_field_errors' ? first : `${humanize(key)}: ${first}`;
      }
      if (first && typeof first === 'object') {
        const nested = Object.values(first as Record<string, unknown>)[0];
        if (typeof nested === 'string') return nested;
      }
    }
  }
  return fallback;
}

function humanize(key: string) {
  const text = key.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Fetch every page of a DRF paginated list endpoint. */
export async function fetchAllPages<T>(
  url: string,
  params: Record<string, unknown> = {},
  maxPages = 20
): Promise<T[]> {
  const results: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const { data } = await api.get(url, { params: { ...params, page, page_size: 100 } });
    if (Array.isArray(data)) return data as T[];
    results.push(...((data?.results ?? []) as T[]));
    if (!data?.next) break;
  }
  return results;
}
