import Link from 'next/link';
import { Avatar } from '@/components/shared/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Student } from '@/lib/types';
import { studentClassLabel, studentFullName } from '@/lib/types';

export function StudentRow({ student, overdueCount }: { student: Student; overdueCount: number }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-slate-light/50">
      <td className="py-2.5 pl-4 pr-4">
        <Link href={`/students/${student.id}`} className="flex items-center gap-3">
          <Avatar seed={student.avatarSeed} size={32} />
          <span className="font-medium text-ink hover:underline">{studentFullName(student)}</span>
        </Link>
      </td>
      <td className="py-2.5 pr-4 text-sm text-slate">{student.studentNumber}</td>
      <td className="py-2.5 pr-4 text-sm text-ink">{studentClassLabel(student)}</td>
      <td className="py-2.5 pr-4">
        {overdueCount > 0 ? (
          <StatusBadge variant="overdue">{overdueCount} просрочено</StatusBadge>
        ) : (
          <span className="text-sm text-slate">—</span>
        )}
      </td>
      <td className="py-2.5 pr-4">
        <StatusBadge variant={student.status === 'active' ? 'active' : 'inactive'} />
      </td>
    </tr>
  );
}
