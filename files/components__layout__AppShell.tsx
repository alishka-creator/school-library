'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StaffProvider } from './StaffContext';
import { ToastProvider } from '@/components/shared/ToastContext';

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <StaffProvider>
      <ToastProvider>
      <div className="flex min-h-screen bg-paper">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="fixed h-screen w-64">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72">
              <div className="relative h-full">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute right-3 top-4 z-10 rounded p-1.5 text-white/70 hover:bg-white/10"
                  aria-label="Закрыть меню"
                >
                  <X className="h-5 w-5" />
                </button>
                <Sidebar onNavigate={() => setDrawerOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <div className="flex min-h-screen flex-1 flex-col md:ml-64">
          <TopBar title={title} onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
      </ToastProvider>
    </StaffProvider>
  );
}
