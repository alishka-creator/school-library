'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  variant: 'success' | 'error';
}

interface ToastContextValue {
  showToast: (message: string, variant?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded border px-4 py-3 text-sm shadow-lg ${
              t.variant === 'success'
                ? 'border-accent/30 bg-accent-light text-ink'
                : 'border-overdue/30 bg-overdue-light text-ink'
            }`}
          >
            {t.variant === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-overdue" />
            )}
            <span>{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-2 text-slate hover:text-ink"
              aria-label="Закрыть"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
