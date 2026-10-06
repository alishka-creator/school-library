import Link from 'next/link';
import { Avatar } from '@/components/shared/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Student } from '@/lib/types';
import { studentClassLabel, studentFullName } from '@/lib/types';

export function StudentCard({ student, overdueCount }: { student: Student; overdueCount: number }) {
  return (
    <Link
      href={`/students/${student.id}`}
      className="flex items-center gap-3 rounded border border-border bg-surface p-3 active:bg-slate-light"
    >
      <Avatar seed={student.avatarSeed} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{studentFullName(student)}</p>
        <p className="text-xs text-slate">
          {studentClassLabel(student)} класс · {student.studentNumber}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {overdueCount > 0 && <StatusBadge variant="overdue">{overdueCount} просроч.</StatusBadge>}
        {student.status === 'inactive' && <StatusBadge variant="inactive" />}
      </div>
    </Link>
  );
}
