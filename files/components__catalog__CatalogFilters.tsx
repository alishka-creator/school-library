'use client';

import { SUBJECTS, type BookType, type Subject } from '@/lib/types';

const TYPE_OPTIONS: { value: BookType | 'all'; label: string }[] = [
  { value: 'all', label: 'Все типы' },
  { value: 'textbook', label: 'Учебники' },
  { value: 'fiction', label: 'Худ. литература' },
  { value: 'reference', label: 'Справочники' },
];

interface Props {
  subject: Subject | 'all';
  type: BookType | 'all';
  availableOnly: boolean;
  onSubjectChange: (s: Subject | 'all') => void;
  onTypeChange: (t: BookType | 'all') => void;
  onAvailableOnlyChange: (v: boolean) => void;
}

export function CatalogFilters({
  subject,
  type,
  availableOnly,
  onSubjectChange,
  onTypeChange,
  onAvailableOnlyChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <select
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value as Subject | 'all')}
        className="rounded border border-border bg-surface px-3 py-2 text-sm text-ink"
      >
        <option value="all">Все предметы</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex gap-1 overflow-x-auto">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            className={`shrink-0 rounded px-3 py-1.5 text-sm ${
              type === opt.value ? 'bg-ink text-white' : 'bg-slate-light text-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <label className="flex shrink-0 items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableOnlyChange(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        Только доступные
      </label>
    </div>
  );
}
