'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StepIndicator } from '@/components/circulation/StepIndicator';
import { PersonPicker } from '@/components/circulation/PersonPicker';
import { BookPicker } from '@/components/circulation/BookPicker';
import { Avatar } from '@/components/shared/Avatar';
import { useStaff } from '@/components/layout/StaffContext';
import { useToast } from '@/components/shared/ToastContext';
import { issueBook } from '@/lib/services/loanService';
import { studentClassLabel, studentFullName, type Student, type Book } from '@/lib/types';

const STEPS = ['Ученик', 'Книга', 'Подтверждение'];

export default function IssuePage() {
  const { currentStaff } = useStaff();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [student, setStudent] = useState<Student | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [dueDays, setDueDays] = useState(14);
  const [done, setDone] = useState(false);

  function reset() {
    setStep(1);
    setStudent(null);
    setBook(null);
    setDueDays(14);
    setDone(false);
  }

  async function confirmIssue() {
    if (!student || !book) return;
    try {
      await issueBook(student.id, book.id, currentStaff.id);
      setDone(true);
      showToast(`«${book.title}» выдана ученику ${studentFullName(student)}.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось выдать книгу.', 'error');
    }
  }

  return (
    <AppShell title="Выдача книги">
      <div className="flex gap-2 border-b border-border pb-4">
        <a href="/circulation/issue" className="rounded bg-ink px-3 py-1.5 text-sm text-white">
          Выдать
        </a>
        <a href="/circulation/return" className="rounded bg-slate-light px-3 py-1.5 text-sm text-ink">
          Вернуть
        </a>
      </div>

      <div className="mt-4 max-w-xl">
        {done ? (
          <div className="rounded border border-border bg-surface p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent" strokeWidth={1.5} />
            <p className="mt-3 font-serif text-lg text-ink">Книга выдана</p>
            <p className="mt-1 text-sm text-slate">
              «{book?.title}» → {student && studentFullName(student)}, срок {dueDays} дней.
            </p>
            <button onClick={reset} className="mt-4 rounded bg-ink px-4 py-2 text-sm text-white">
              Выдать ещё книгу
            </button>
          </div>
        ) : (
          <>
            <StepIndicator step={step} labels={STEPS} />

            <div className="mt-5 rounded border border-border bg-surface p-5">
              {step === 1 && (
                <>
                  <h3 className="font-serif text-lg text-ink">Найдите ученика</h3>
                  <div className="mt-3">
                    <PersonPicker
                      onSelect={(s) => {
                        setStudent(s);
                        setStep(2);
                      }}
                    />
                  </div>
                </>
              )}

              {step === 2 && student && (
                <>
                  <div className="flex items-center gap-3 rounded bg-slate-light p-3">
                    <Avatar seed={student.avatarSeed} size={36} />
                    <div>
                      <p className="text-sm font-medium text-ink">{studentFullName(student)}</p>
                      <p className="text-xs text-slate">{studentClassLabel(student)} класс</p>
                    </div>
                    <button onClick={() => setStep(1)} className="ml-auto text-xs text-slate hover:underline">
                      Изменить
                    </button>
                  </div>
                  <h3 className="mt-4 font-serif text-lg text-ink">Найдите книгу</h3>
                  <div className="mt-3">
                    <BookPicker
                      onSelect={(b) => {
                        setBook(b);
                        setStep(3);
                      }}
                    />
                  </div>
                </>
              )}

              {step === 3 && student && book && (
                <>
                  <h3 className="font-serif text-lg text-ink">Подтвердите выдачу</h3>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-center justify-between rounded bg-slate-light p-3">
                      <span className="text-ink">{studentFullName(student)}</span>
                      <button onClick={() => setStep(1)} className="text-xs text-slate hover:underline">
                        Изменить
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded bg-slate-light p-3">
                      <span className="text-ink">{book.title}</span>
                      <button onClick={() => setStep(2)} className="text-xs text-slate hover:underline">
                        Изменить
                      </button>
                    </div>
                    <label className="flex items-center justify-between">
                      <span className="text-ink">Срок выдачи (дней)</span>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={dueDays}
                        onChange={(e) => setDueDays(Number(e.target.value))}
                        className="w-20 rounded border border-border px-2 py-1 text-right"
                      />
                    </label>
                  </div>
                  <button
                    onClick={confirmIssue}
                    className="mt-4 w-full rounded bg-ink py-2.5 text-sm font-medium text-white"
                  >
                    Подтвердить выдачу
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
