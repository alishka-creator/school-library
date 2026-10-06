'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Send, Undo2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useToast } from '@/components/shared/ToastContext';
import { formatDate, daysUntil } from '@/lib/utils/format';
import { getOverdueLoans, getStudents, getBooks } from '@/lib/data';
import { returnBook } from '@/lib/services/loanService';

export default function OverduePage() {
  const { showToast } = useToast();
  const [version, setVersion] = useState(0); // bump to force re-derive after a return
  const [confirmingLoanId, setConfirmingLoanId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const students = getStudents();
    const books = getBooks();
    return getOverdueLoans()
      .map((loan) => ({
        loan,
        student: students.find((s) => s.id === loan.studentId),
        book: books.find((b) => b.id === loan.bookId),
      }))
      .sort((a, b) => a.loan.dueDate.localeCompare(b.loan.dueDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  async function confirmReturn() {
    if (!confirmingLoanId) return;
    await returnBook(confirmingLoanId);
    setConfirmingLoanId(null);
    setVersion((v) => v + 1);
    showToast('Книга отмечена как возвращённая.');
  }

  function notify(studentName: string) {
    showToast(`Уведомление отправлено: ${studentName} (демо, без реальной отправки).`);
  }

  return (
    <AppShell title="Просроченные книги">
      {rows.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="Просроченных книг нет" description="Отличная работа — все книги сданы вовремя." />
      ) : (
        <>
          <p className="text-sm text-slate">Всего просрочено: {rows.length}</p>

          {/* Mobile cards */}
          <div className="mt-4 space-y-2 md:hidden">
            {rows.map(({ loan, student, book }) => {
              const daysOverdue = Math.abs(daysUntil(loan.dueDate));
              return (
                <div key={loan.id} className="rounded border border-border bg-surface p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {student && (
                        <Link href={`/students/${student.id}`} className="font-medium text-ink hover:underline">
                          {student.lastName} {student.firstName}
                        </Link>
                      )}
                      <p className="text-sm text-slate">{book?.title}</p>
                    </div>
                    <StatusBadge variant="overdue">{daysOverdue} дн.</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-slate">Срок сдачи был: {formatDate(loan.dueDate)}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => student && notify(`${student.lastName} ${student.firstName}`)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded bg-slate-light py-1.5 text-sm text-ink"
                    >
                      <Send className="h-3.5 w-3.5" /> Уведомить
                    </button>
                    <button
                      onClick={() => setConfirmingLoanId(loan.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded bg-ink py-1.5 text-sm text-white"
                    >
                      <Undo2 className="h-3.5 w-3.5" /> Вернуть
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto rounded border border-border bg-surface md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3 font-medium">Ученик</th>
                  <th className="px-4 py-3 font-medium">Книга</th>
                  <th className="px-4 py-3 font-medium">Срок сдачи</th>
                  <th className="px-4 py-3 font-medium">Дней просрочки</th>
                  <th className="px-4 py-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ loan, student, book }) => {
                  const daysOverdue = Math.abs(daysUntil(loan.dueDate));
                  return (
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
                      <td className="px-4 py-2.5">
                        {book ? (
                          <Link href={`/catalog/${book.id}`} className="text-ink hover:underline">
                            {book.title}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate">{formatDate(loan.dueDate)}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge variant="overdue">{daysOverdue} дн.</StatusBadge>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => student && notify(`${student.lastName} ${student.firstName}`)}
                            className="rounded bg-slate-light px-2.5 py-1 text-xs text-ink hover:bg-border"
                          >
                            Уведомить
                          </button>
                          <button
                            onClick={() => setConfirmingLoanId(loan.id)}
                            className="rounded bg-ink px-2.5 py-1 text-xs text-white"
                          >
                            Отметить возврат
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmingLoanId !== null}
        title="Подтвердите возврат"
        description="Книга будет отмечена как возвращённая, доступность обновится."
        onConfirm={confirmReturn}
        onCancel={() => setConfirmingLoanId(null)}
      />
    </AppShell>
  );
}
