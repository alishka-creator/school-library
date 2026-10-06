'use client';

import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/shared/SearchInput';
import { Avatar } from '@/components/shared/Avatar';
import { getStudents } from '@/lib/data';
import { studentClassLabel, studentFullName, type Student } from '@/lib/types';

export function PersonPicker({ onSelect }: { onSelect: (student: Student) => void }) {
  const allStudents = useMemo(() => getStudents(), []);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allStudents
      .filter((s) => {
        const fullName = `${s.lastName} ${s.firstName}`.toLowerCase();
        return s.studentNumber.toLowerCase().includes(q) || fullName.includes(q) || s.barcode.toLowerCase().includes(q);
      })
      .slice(0, 8);
  }, [allStudents, query]);

  return (
    <div>
      <SearchInput placeholder="Введите ID или ФИО ученика..." onChange={setQuery} />
      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-border rounded border border-border bg-surface">
          {results.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onSelect(s)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-light"
              >
                <Avatar seed={s.avatarSeed} size={32} />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{studentFullName(s)}</span>
                  <span className="block text-xs text-slate">
                    {studentClassLabel(s)} класс · {s.studentNumber}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim() && results.length === 0 && (
        <p className="mt-2 text-sm text-slate">Ученики не найдены.</p>
      )}
    </div>
  );
}
