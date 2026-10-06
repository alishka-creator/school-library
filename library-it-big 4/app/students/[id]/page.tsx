import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar } from '@/components/shared/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CurrentLoansPanel } from '@/components/students/CurrentLoansPanel';
import { ReadingHistoryTable } from '@/components/students/ReadingHistoryTable';
import { getStudentById, getLoansForStudent, getBooks } from '@/lib/data';
import { studentClassLabel, studentFullName } from '@/lib/types';
import { isOverdue } from '@/lib/types';

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudentById(params.id);
  if (!student) notFound();

  const loans = getLoansForStudent(student.id);
  const books = getBooks();
  const bookById = new Map(books.map((b) => [b.id, b]));

  const currentRows = loans
    .filter((l) => l.returnedDate === null)
    .map((loan) => ({ loan, book: bookById.get(loan.bookId) }));

  const historyRows = loans.map((loan) => ({ loan, book: bookById.get(loan.bookId) }));

  const overdueCount = loans.filter((l) => isOverdue(l)).length;

  return (
    <AppShell title="Профиль ученика">
      <Link href="/students" className="text-sm text-slate hover:text-ink hover:underline">
        ← К списку учеников
      </Link>

      <div className="mt-4 flex flex-col gap-4 rounded border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar seed={student.avatarSeed} size={64} />
          <div>
            <h2 className="font-serif text-2xl text-ink">{studentFullName(student)}</h2>
            <p className="text-sm text-slate">
              {studentClassLabel(student)} класс · {student.studentNumber} · штрих-код {student.barcode}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge variant={student.status === 'active' ? 'active' : 'inactive'} />
          {overdueCount > 0 && <StatusBadge variant="overdue">{overdueCount} просрочено</StatusBadge>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded border border-border bg-surface p-5">
          <h3 className="font-serif text-lg text-ink">На руках сейчас ({currentRows.length})</h3>
          <div className="mt-3">
            <CurrentLoansPanel rows={currentRows} />
          </div>
        </div>

        <div className="rounded border border-border bg-surface p-5">
          <h3 className="font-serif text-lg text-ink">История чтения ({historyRows.length})</h3>
          <div className="mt-3">
            <ReadingHistoryTable rows={historyRows} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
