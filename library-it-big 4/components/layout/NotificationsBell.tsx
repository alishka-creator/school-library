'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { getOverdueLoans, getStudents, getBooks } from '@/lib/data';

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const items = useMemo(() => {
    const overdue = getOverdueLoans();
    const students = getStudents();
    const books = getBooks();
    return overdue.slice(0, 6).map((loan) => ({
      id: loan.id,
      studentId: loan.studentId,
      studentName: (() => {
        const s = students.find((x) => x.id === loan.studentId);
        return s ? `${s.lastName} ${s.firstName}` : 'Ученик';
      })(),
      bookTitle: books.find((b) => b.id === loan.bookId)?.title ?? 'Книга',
    }));
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded p-2 text-ink hover:bg-slate-light"
        aria-label="Уведомления"
      >
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-overdue text-[10px] text-white">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-72 rounded border border-border bg-surface py-2 shadow-lg">
          <p className="border-b border-border px-3 pb-2 text-sm font-medium text-ink">Просроченные книги</p>
          {items.length === 0 ? (
            <p className="px-3 py-3 text-sm text-slate">Просроченных книг нет.</p>
          ) : (
            items.map((n) => (
              <Link
                key={n.id}
                href={`/students/${n.studentId}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm hover:bg-slate-light"
              >
                <span className="text-ink">{n.studentName}</span>
                <span className="block text-xs text-slate">не сдал(а) «{n.bookTitle}»</span>
              </Link>
            ))
          )}
          <Link
            href="/overdue"
            onClick={() => setOpen(false)}
            className="mt-1 block border-t border-border px-3 pt-2 text-sm text-accent hover:underline"
          >
            Смотреть все просроченные →
          </Link>
        </div>
      )}
    </div>
  );
}
