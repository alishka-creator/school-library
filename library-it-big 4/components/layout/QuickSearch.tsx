'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, BookOpen } from 'lucide-react';
import { getStudents, getBooks } from '@/lib/data';
import { studentClassLabel, studentFullName } from '@/lib/types';

export function QuickSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const { students, books } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { students: [], books: [] };
    const s = getStudents()
      .filter((st) => `${st.lastName} ${st.firstName}`.toLowerCase().includes(q) || st.studentNumber.toLowerCase().includes(q))
      .slice(0, 4);
    const b = getBooks()
      .filter((bk) => bk.title.toLowerCase().includes(q) || bk.author.toLowerCase().includes(q))
      .slice(0, 4);
    return { students: s, books: b };
  }, [query]);

  const hasResults = students.length > 0 || books.length > 0;

  return (
    <div ref={containerRef} className="relative hidden w-full max-w-xs sm:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Быстрый поиск..."
        className="w-full rounded border border-border bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate focus:border-ink-light focus:outline-none"
      />

      {open && query.trim() && (
        <div className="absolute left-0 top-11 z-30 w-80 rounded border border-border bg-surface py-2 shadow-lg">
          {!hasResults && <p className="px-3 py-2 text-sm text-slate">Ничего не найдено</p>}

          {students.length > 0 && (
            <div>
              <p className="px-3 pb-1 text-xs uppercase tracking-wide text-slate">Ученики</p>
              {students.map((s) => (
                <Link
                  key={s.id}
                  href={`/students/${s.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-slate-light"
                >
                  <User className="h-3.5 w-3.5 text-slate" />
                  {studentFullName(s)}
                  <span className="text-xs text-slate">{studentClassLabel(s)}</span>
                </Link>
              ))}
            </div>
          )}

          {books.length > 0 && (
            <div className="mt-1 border-t border-border pt-1">
              <p className="px-3 pb-1 pt-1 text-xs uppercase tracking-wide text-slate">Книги</p>
              {books.map((b) => (
                <Link
                  key={b.id}
                  href={`/catalog/${b.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-slate-light"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate" />
                  {b.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
