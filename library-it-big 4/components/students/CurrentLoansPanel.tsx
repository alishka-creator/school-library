import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, daysUntil } from '@/lib/utils/format';
import type { Loan, Book } from '@/lib/types';

interface Row {
  loan: Loan;
  book: Book | undefined;
}

export function CurrentLoansPanel({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <EmptyState icon={BookOpen} title="Нет книг на руках" description="Все книги возвращены." />;
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map(({ loan, book }) => {
        if (!book) return null;
        const remaining = daysUntil(loan.dueDate);
        const overdue = remaining < 0;
        return (
          <li key={loan.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <Link href={`/catalog/${book.id}`} className="font-medium text-ink hover:underline">
                {book.title}
              </Link>
              <p className="text-xs text-slate">
                Выдано {formatDate(loan.issuedDate)} · Сдать до {formatDate(loan.dueDate)}
              </p>
            </div>
            {overdue ? (
              <StatusBadge variant="overdue">Просрочено на {Math.abs(remaining)} дн.</StatusBadge>
            ) : (
              <span className="shrink-0 text-xs text-slate">осталось {remaining} дн.</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
