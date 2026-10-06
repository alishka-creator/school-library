import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils/format';
import { getBookById, getLoansForBook, getStudents } from '@/lib/data';
import { History } from 'lucide-react';

const TYPE_LABEL: Record<string, string> = {
  textbook: 'Учебник',
  fiction: 'Художественная литература',
  reference: 'Справочник',
};

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = getBookById(params.id);
  if (!book) notFound();

  const loans = getLoansForBook(book.id);
  const students = getStudents();
  const studentById = new Map(students.map((s) => [s.id, s]));

  const openLoans = loans.filter((l) => l.returnedDate === null);
  const pastLoans = loans
    .filter((l) => l.returnedDate !== null)
    .sort((a, b) => (a.returnedDate! < b.returnedDate! ? 1 : -1));

  return (
    <AppShell title="Карточка книги">
      <Link href="/catalog" className="text-sm text-slate hover:text-ink hover:underline">
        ← К каталогу
      </Link>

      <div className="mt-4 rounded border border-border bg-surface p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <h2 className="font-serif text-2xl text-ink">{book.title}</h2>
            <p className="mt-1 text-sm text-slate">{book.author}</p>
            <p className="mt-2 text-sm text-slate">
              {TYPE_LABEL[book.type]} · {book.subject}
              {book.gradeLevel ? ` · ${book.gradeLevel} класс` : ''}
            </p>
          </div>
          <StatusBadge variant={book.availableCopies > 0 ? 'available' : 'unavailable'} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">ISBN</dt>
            <dd className="text-sm text-ink">{book.isbn}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Полка</dt>
            <dd className="text-sm text-ink">{book.shelfLocation}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Штрих-код</dt>
            <dd className="text-sm text-ink">{book.barcode}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Экземпляры</dt>
            <dd className="text-sm text-ink">
              {book.availableCopies} доступно из {book.totalCopies}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded border border-border bg-surface p-5">
          <h3 className="font-serif text-lg text-ink">Сейчас у учеников ({openLoans.length})</h3>
          <div className="mt-3">
            {openLoans.length === 0 ? (
              <EmptyState icon={History} title="Все экземпляры на полке" />
            ) : (
              <ul className="divide-y divide-border">
                {openLoans.map((loan) => {
                  const student = studentById.get(loan.studentId);
                  return (
                    <li key={loan.id} className="flex items-center justify-between py-3 text-sm">
                      {student ? (
                        <Link href={`/students/${student.id}`} className="text-ink hover:underline">
                          {student.lastName} {student.firstName}
                        </Link>
                      ) : (
                        '—'
                      )}
                      <span className="text-slate">до {formatDate(loan.dueDate)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded border border-border bg-surface p-5">
          <h3 className="font-serif text-lg text-ink">История выдач ({pastLoans.length})</h3>
          <div className="mt-3">
            {pastLoans.length === 0 ? (
              <EmptyState icon={History} title="Книгу ещё не возвращали" />
            ) : (
              <ul className="max-h-80 divide-y divide-border overflow-y-auto scrollbar-thin">
                {pastLoans.map((loan) => {
                  const student = studentById.get(loan.studentId);
                  return (
                    <li key={loan.id} className="flex items-center justify-between py-3 text-sm">
                      {student ? (
                        <Link href={`/students/${student.id}`} className="text-ink hover:underline">
                          {student.lastName} {student.firstName}
                        </Link>
                      ) : (
                        '—'
                      )}
                      <span className="text-slate">{formatDate(loan.returnedDate!)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
