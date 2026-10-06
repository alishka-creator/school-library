import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Book } from '@/lib/types';

const TYPE_LABEL: Record<Book['type'], string> = {
  textbook: 'Учебник',
  fiction: 'Худ. литература',
  reference: 'Справочник',
};

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/catalog/${book.id}`}
      className="flex flex-col gap-1 rounded border border-border bg-surface p-3 active:bg-slate-light"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-ink">{book.title}</p>
        <StatusBadge variant={book.availableCopies > 0 ? 'available' : 'unavailable'} />
      </div>
      <p className="text-sm text-slate">{book.author}</p>
      <p className="text-xs text-slate">
        {TYPE_LABEL[book.type]} · {book.subject}
        {book.gradeLevel ? ` · ${book.gradeLevel} класс` : ''}
      </p>
      <p className="text-xs text-slate">
        {book.availableCopies} из {book.totalCopies} доступно · полка {book.shelfLocation}
      </p>
    </Link>
  );
}
