'use client';

import { useMemo, useState } from 'react';
import { ClipboardList, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/format';
import { getLoans, getStudents, getBooks } from '@/lib/data';
import { isOverdue } from '@/lib/types';

type SortKey = 'issuedDate' | 'dueDate' | 'student' | 'book';
type StatusFilter = 'all' | 'open' | 'overdue' | 'returned';

export default function LoansPage() {
  const loans = useMemo(() => getLoans(), []);
  const students = useMemo(() => getStudents(), []);
  const books = useMemo(() => getBooks(), []);
  const studentById = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);
  const bookById = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('open');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    let results = loans.map((loan) => ({
      loan,
      student: studentById.get(loan.studentId),
      book: bookById.get(loan.bookId),
    }));

    if (status === 'open') results = results.filter((r) => r.loan.returnedDate === null);
    if (status === 'overdue') results = results.filter((r) => isOverdue(r.loan));
    if (status === 'returned') results = results.filter((r) => r.loan.returnedDate !== null);

    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((r) => {
        const studentName = r.student ? `${r.student.lastName} ${r.student.firstName}`.toLowerCase() : '';
        return (
          studentName.includes(q) ||
          r.student?.studentNumber.toLowerCase().includes(q) ||
          r.book?.title.toLowerCase().includes(q)
        );
      });
    }

    results.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'issuedDate') cmp = a.loan.issuedDate.localeCompare(b.loan.issuedDate);
      if (sortKey === 'dueDate') cmp = a.loan.dueDate.localeCompare(b.loan.dueDate);
      if (sortKey === 'student') cmp = (a.student?.lastName ?? '').localeCompare(b.student?.lastName ?? '', 'ru');
      if (sortKey === 'book') cmp = (a.book?.title ?? '').localeCompare(b.book?.title ?? '', 'ru');
      return sortAsc ? cmp : -cmp;
    });

    return results;
  }, [loans, studentById, bookById, status, query, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'open', label: 'Активные' },
    { value: 'overdue', label: 'Просроченные' },
    { value: 'returned', label: 'Возвращённые' },
    { value: 'all', label: 'Все' },
  ];

  return (
    <AppShell title="Все выдачи">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Поиск по ученику или книге..." onChange={setQuery} className="sm:max-w-sm" />
        <div className="flex gap-1 overflow-x-auto">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`shrink-0 rounded px-3 py-1.5 text-sm ${
                status === opt.value ? 'bg-ink text-white' : 'bg-slate-light text-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate">Найдено: {rows.length}</p>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={ClipboardList} title="Выдачи не найдены" description="Попробуйте изменить фильтр или запрос." />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-slate">
                <th className="px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('student')} className="flex items-center gap-1">
                    Ученик <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Номер</th>
                <th className="px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('book')} className="flex items-center gap-1">
                    Книга <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('issuedDate')} className="flex items-center gap-1">
                    Выдано <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('dueDate')} className="flex items-center gap-1">
                    Сдать до <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ loan, student, book }) => (
                <tr key={loan.id} className="border-b border-border last:border-0 hover:bg-slate-light/50">
                  <td className="px-4 py-2.5">
                    {student ? (
                      <Link href={`/students/${student.id}`} className="font-medium text-ink hover:underline">
                        {student.lastName} {student.firstName}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate">{student?.studentNumber ?? '—'}</td>
                  <td className="px-4 py-2.5">
                    {book ? (
                      <Link href={`/catalog/${book.id}`} className="text-ink hover:underline">
                        {book.title}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-slate">{formatDate(loan.issuedDate)}</td>
                  <td className="px-4 py-2.5 text-sm text-slate">{formatDate(loan.dueDate)}</td>
                  <td className="px-4 py-2.5">
                    {loan.returnedDate ? (
                      <StatusBadge variant="inactive">Возвращена</StatusBadge>
                    ) : isOverdue(loan) ? (
                      <StatusBadge variant="overdue" />
                    ) : (
                      <StatusBadge variant="ontime" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
