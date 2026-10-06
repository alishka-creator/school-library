'use client';

import { useState } from 'react';
import { CheckCircle2, Undo2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PersonPicker } from '@/components/circulation/PersonPicker';
import { Avatar } from '@/components/shared/Avatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToast } from '@/components/shared/ToastContext';
import { formatDate } from '@/lib/utils/format';
import { getCurrentLoansForStudent, getBookById } from '@/lib/data';
import { returnBook } from '@/lib/services/loanService';
import { studentClassLabel, studentFullName, type Student } from '@/lib/types';
import { BookOpen } from 'lucide-react';

export default function ReturnPage() {
  const { showToast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [version, setVersion] = useState(0);
  const [lastReturned, setLastReturned] = useState<string | null>(null);

  const currentLoans = student ? getCurrentLoansForStudent(student.id) : [];

  async function handleReturn(loanId: string, bookTitle: string) {
    await returnBook(loanId);
    setVersion((v) => v + 1);
    setLastReturned(bookTitle);
    showToast(`«${bookTitle}» отмечена как возвращённая.`);
  }

  return (
    <AppShell title="Возврат книги">
      <div className="flex gap-2 border-b border-border pb-4">
        <a href="/circulation/issue" className="rounded bg-slate-light px-3 py-1.5 text-sm text-ink">
          Выдать
        </a>
        <a href="/circulation/return" className="rounded bg-ink px-3 py-1.5 text-sm text-white">
          Вернуть
        </a>
      </div>

      <div className="mt-4 max-w-xl">
        {!student ? (
          <div className="rounded border border-border bg-surface p-5">
            <h3 className="font-serif text-lg text-ink">Найдите ученика</h3>
            <div className="mt-3">
              <PersonPicker onSelect={setStudent} />
            </div>
          </div>
        ) : (
          <div key={version} className="rounded border border-border bg-surface p-5">
            <div className="flex items-center gap-3 rounded bg-slate-light p-3">
              <Avatar seed={student.avatarSeed} size={36} />
              <div>
                <p className="text-sm font-medium text-ink">{studentFullName(student)}</p>
                <p className="text-xs text-slate">{studentClassLabel(student)} класс</p>
              </div>
              <button
                onClick={() => {
                  setStudent(null);
                  setLastReturned(null);
                }}
                className="ml-auto text-xs text-slate hover:underline"
              >
                Другой ученик
              </button>
            </div>

            <h3 className="mt-4 font-serif text-lg text-ink">Книги на руках ({currentLoans.length})</h3>

            {lastReturned && (
              <div className="mt-3 flex items-center gap-2 rounded border border-accent/30 bg-accent-light px-3 py-2 text-sm text-ink">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                «{lastReturned}» успешно возвращена.
              </div>
            )}

            <div className="mt-3">
              {currentLoans.length === 0 ? (
                <EmptyState icon={BookOpen} title="Нет книг на руках" description="Все книги уже возвращены." />
              ) : (
                <ul className="divide-y divide-border">
                  {currentLoans.map((loan) => {
                    const book = getBookById(loan.bookId);
                    if (!book) return null;
                    return (
                      <li key={loan.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{book.title}</p>
                          <p className="text-xs text-slate">
                            Выдано {formatDate(loan.issuedDate)} · Сдать до {formatDate(loan.dueDate)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleReturn(loan.id, book.title)}
                          className="flex shrink-0 items-center gap-1.5 rounded bg-ink px-3 py-1.5 text-xs text-white"
                        >
                          <Undo2 className="h-3.5 w-3.5" /> Вернуть
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
