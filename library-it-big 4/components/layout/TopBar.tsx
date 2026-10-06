'use client';

import { Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { useStaff } from './StaffContext';
import { QuickSearch } from './QuickSearch';
import { NotificationsBell } from './NotificationsBell';

export function TopBar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { currentStaff, toggleRole } = useStaff();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-2 text-ink hover:bg-slate-light md:hidden"
          aria-label="Открыть меню"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate font-serif text-xl text-ink">{title}</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <QuickSearch />
        <NotificationsBell />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-light"
          >
            <Avatar seed={currentStaff.avatarSeed} size={32} />
            <span className="hidden text-sm text-ink lg:inline">{currentStaff.name}</span>
            <ChevronDown className="h-4 w-4 text-slate" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-30 w-64 rounded border border-border bg-surface py-2 shadow-lg">
              <div className="border-b border-border px-3 pb-2">
                <p className="text-sm font-medium text-ink">{currentStaff.name}</p>
                <p className="text-xs text-slate">{currentStaff.email}</p>
              </div>
              <button
                onClick={() => {
                  toggleRole();
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-slate-light"
              >
                Переключить на: {currentStaff.isAdmin ? 'Библиотекарь' : 'Администратор'}
                <span className="block text-xs text-slate">Только для демонстрации ролей</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
