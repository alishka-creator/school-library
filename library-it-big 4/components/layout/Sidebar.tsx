'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { navItems } from './nav-items';
import { useStaff } from './StaffContext';
import { cn } from '@/lib/utils/cn';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { currentStaff } = useStaff();

  return (
    <nav className="flex h-full flex-col bg-ink text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <BookOpen className="h-6 w-6 text-white" strokeWidth={1.75} />
        <span className="font-serif text-lg leading-tight">
          Библиотека
          <span className="block text-xs font-sans font-normal text-white/60">
            школа №12, г. Кокшетау
          </span>
        </span>
      </div>

      <div className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          if (item.adminOnly && !currentStaff.isAdmin) return null;
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/50">
        {currentStaff.isAdmin ? 'Администратор' : 'Библиотекарь'}
      </div>
    </nav>
  );
}
