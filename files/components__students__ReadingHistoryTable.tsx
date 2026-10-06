import Link from 'next/link';
import { History } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils/format';
import type { Loan, Book } from '@/lib/types';

interface Row {
  loan: Loan;
  book: Book | undefined;
}

export function ReadingHistoryTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <EmptyState icon={History} title="История пуста" description="Ученик ещё не брал книги." />;
  }

  const sorted = [...rows].sort((a, b) => (a.loan.issuedDate < b.loan.issuedDate ? 1 : -1));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-slate">
            <th className="py-2 pr-4 font-medium">Книга</th>
            <th className="py-2 pr-4 font-medium">Выдано</th>
            <th className="py-2 pr-4 font-medium">Возвращено</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ loan, book }) => (
            <tr key={loan.id} className="border-b border-border last:border-0">
              <td className="py-2.5 pr-4">
                {book ? (
                  <Link href={`/catalog/${book.id}`} className="text-ink hover:underline">
                    {book.title}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td className="py-2.5 pr-4 text-slate">{formatDate(loan.issuedDate)}</td>
              <td className="py-2.5 pr-4 text-slate">
                {loan.returnedDate ? formatDate(loan.returnedDate) : 'на руках'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
