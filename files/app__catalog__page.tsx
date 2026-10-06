'use client';

import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { BookCard } from '@/components/catalog/BookCard';
import { BookRow } from '@/components/catalog/BookRow';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { getBooks } from '@/lib/data';
import type { BookType, Subject } from '@/lib/types';

export default function CatalogPage() {
  const allBooks = useMemo(() => getBooks(), []);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<Subject | 'all'>('all');
  const [type, setType] = useState<BookType | 'all'>('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    let results = allBooks;
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.subject.toLowerCase().includes(q) ||
          b.isbn.includes(q)
      );
    }
    if (subject !== 'all') results = results.filter((b) => b.subject === subject);
    if (type !== 'all') results = results.filter((b) => b.type === type);
    if (availableOnly) results = results.filter((b) => b.availableCopies > 0);
    return results.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  }, [allBooks, query, subject, type, availableOnly]);

  return (
    <AppShell title="Каталог">
      <div className="flex flex-col gap-3">
        <SearchInput
          placeholder="Поиск по названию, автору, предмету..."
          onChange={setQuery}
          className="sm:max-w-md"
        />
        <CatalogFilters
          subject={subject}
          type={type}
          availableOnly={availableOnly}
          onSubjectChange={setSubject}
          onTypeChange={setType}
          onAvailableOnlyChange={setAvailableOnly}
        />
      </div>

      <p className="mt-3 text-sm text-slate">Найдено: {filtered.length}</p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={BookOpen} title="Книги не найдены" description="Попробуйте изменить запрос или фильтры." />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:hidden">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>

          <div className="mt-4 hidden overflow-x-auto rounded border border-border bg-surface md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3 font-medium">Название</th>
                  <th className="px-4 py-3 font-medium">Автор</th>
                  <th className="px-4 py-3 font-medium">Предмет</th>
                  <th className="px-4 py-3 font-medium">Тип</th>
                  <th className="px-4 py-3 font-medium">Экземпляры</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <BookRow key={b.id} book={b} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppShell>
  );
}
