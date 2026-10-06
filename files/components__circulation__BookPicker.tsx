'use client';

import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getBooks } from '@/lib/data';
import type { Book } from '@/lib/types';

export function BookPicker({ onSelect, onlyAvailable = true }: { onSelect: (book: Book) => void; onlyAvailable?: boolean }) {
  const allBooks = useMemo(() => getBooks(), []);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    let pool = allBooks;
    if (onlyAvailable) pool = pool.filter((b) => b.availableCopies > 0);
    return pool
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q) ||
          b.barcode.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [allBooks, query, onlyAvailable]);

  return (
    <div>
      <SearchInput placeholder="Введите название, автора или ISBN..." onChange={setQuery} />
      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-border rounded border border-border bg-surface">
          {results.map((b) => (
            <li key={b.id}>
              <button
                onClick={() => onSelect(b)}
                className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-light"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">{b.title}</span>
                  <span className="block text-xs text-slate">{b.author}</span>
                </span>
                <StatusBadge variant={b.availableCopies > 0 ? 'available' : 'unavailable'}>
                  {b.availableCopies} доступно
                </StatusBadge>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim() && results.length === 0 && (
        <p className="mt-2 text-sm text-slate">Книги не найдены{onlyAvailable ? ' (или нет доступных экземпляров)' : ''}.</p>
      )}
    </div>
  );
}
