'use client';

import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { StudentCard } from '@/components/students/StudentCard';
import { StudentRow } from '@/components/students/StudentRow';
import { getStudents, getOverdueLoans } from '@/lib/data';
import { studentClassLabel } from '@/lib/types';

const GRADE_OPTIONS = ['Все классы', '7', '8', '9', '10', '11'];

export default function StudentsPage() {
  const allStudents = useMemo(() => getStudents(), []);
  const overdueLoans = useMemo(() => getOverdueLoans(), []);
  const overdueCountByStudent = useMemo(() => {
    const map = new Map<string, number>();
    for (const loan of overdueLoans) {
      map.set(loan.studentId, (map.get(loan.studentId) ?? 0) + 1);
    }
    return map;
  }, [overdueLoans]);

  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('Все классы');

  const filtered = useMemo(() => {
    let results = allStudents;
    if (gradeFilter !== 'Все классы') {
      results = results.filter((s) => String(s.grade) === gradeFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((s) => {
        const fullName = `${s.lastName} ${s.firstName}`.toLowerCase();
        return (
          s.studentNumber.toLowerCase().includes(q) ||
          fullName.includes(q) ||
          s.barcode.toLowerCase().includes(q)
        );
      });
    }
    return results.sort((a, b) => a.grade - b.grade || a.lastName.localeCompare(b.lastName, 'ru'));
  }, [allStudents, query, gradeFilter]);

  return (
    <AppShell title="Ученики">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Поиск по ФИО или номеру..."
          onChange={setQuery}
          className="sm:max-w-sm"
        />
        <div className="flex gap-1 overflow-x-auto">
          {GRADE_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`shrink-0 rounded px-3 py-1.5 text-sm ${
                gradeFilter === g ? 'bg-ink text-white' : 'bg-slate-light text-ink'
              }`}
            >
              {g === 'Все классы' ? g : `${g} класс`}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate">Найдено: {filtered.length}</p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={Users} title="Ученики не найдены" description="Попробуйте изменить запрос или фильтр по классу." />
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="mt-4 space-y-2 md:hidden">
            {filtered.map((s) => (
              <StudentCard key={s.id} student={s} overdueCount={overdueCountByStudent.get(s.id) ?? 0} />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="mt-4 hidden overflow-x-auto rounded border border-border bg-surface md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3 font-medium">Ученик</th>
                  <th className="px-4 py-3 font-medium">Номер</th>
                  <th className="px-4 py-3 font-medium">Класс</th>
                  <th className="px-4 py-3 font-medium">Просрочка</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <StudentRow key={s.id} student={s} overdueCount={overdueCountByStudent.get(s.id) ?? 0} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppShell>
  );
}
