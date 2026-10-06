import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Book } from '@/lib/types';

const TYPE_LABEL: Record<Book['type'], string> = {
  textbook: 'Учебник',
  fiction: 'Худ. литература',
  reference: 'Справочник',
};

export function BookRow({ book }: { book: Book }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-slate-light/50">
      <td className="py-2.5 pl-4 pr-4">
        <Link href={`/catalog/${book.id}`} className="font-medium text-ink hover:underline">
          {book.title}
        </Link>
      </td>
      <td className="py-2.5 pr-4 text-sm text-slate">{book.author}</td>
      <td className="py-2.5 pr-4 text-sm text-ink">{book.subject}</td>
      <td className="py-2.5 pr-4 text-sm text-slate">{TYPE_LABEL[book.type]}</td>
      <td className="py-2.5 pr-4 text-sm text-slate">
        {book.availableCopies} / {book.totalCopies}
      </td>
      <td className="py-2.5 pr-4">
        <StatusBadge variant={book.availableCopies > 0 ? 'available' : 'unavailable'} />
      </td>
    </tr>
  );
}
