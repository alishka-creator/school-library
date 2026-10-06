import Link from 'next/link';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { ActivityEvent } from '@/lib/services/dashboardService';
import { EmptyState } from '@/components/shared/EmptyState';
import { Clock } from 'lucide-react';

export function RecentActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon={Clock} title="Пока нет активности" />;
  }

  return (
    <ul className="divide-y divide-border">
      {events.map((e) => (
        <li key={e.id} className="flex items-start gap-3 py-3">
          <div className="mt-0.5 rounded-full bg-slate-light p-1.5">
            {e.type === 'issued' ? (
              <ArrowUpFromLine className="h-3.5 w-3.5 text-ink" />
            ) : (
              <ArrowDownToLine className="h-3.5 w-3.5 text-accent" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">
              <Link href={`/students/${e.studentId}`} className="font-medium hover:underline">
                {e.studentName}
              </Link>{' '}
              {e.type === 'issued' ? 'взял(а)' : 'вернул(а)'}{' '}
              <Link href={`/catalog/${e.bookId}`} className="hover:underline">
                {e.bookTitle}
              </Link>
            </p>
            <p className="text-xs text-slate">{formatDate(e.date)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
