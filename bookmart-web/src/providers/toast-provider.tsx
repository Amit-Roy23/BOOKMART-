'use client';

import { IoAlertCircle, IoCheckmarkCircle, IoClose, IoInformationCircle } from 'react-icons/io5';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = { success: IoCheckmarkCircle, error: IoAlertCircle, info: IoInformationCircle };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { id, kind, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (m: string) => push('success', m),
      error: (m: string) => push('error', m),
      info: (m: string) => push('info', m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind];
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border-l-4 bg-white px-4 py-3 text-sm shadow-float animate-fade-in',
                toast.kind === 'success' && 'border-app-green',
                toast.kind === 'error' && 'border-app-red',
                toast.kind === 'info' && 'border-primary'
              )}
            >
              <Icon
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0',
                  toast.kind === 'success' && 'text-app-green',
                  toast.kind === 'error' && 'text-app-red',
                  toast.kind === 'info' && 'text-primary'
                )}
              />
              <p className="font-heading flex-1 font-medium text-ink">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-muted hover:text-ink"
                aria-label="Dismiss"
              >
                <IoClose className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
