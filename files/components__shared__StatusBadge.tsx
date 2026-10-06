import { cn } from '@/lib/utils/cn';

type Variant = 'available' | 'unavailable' | 'overdue' | 'ontime' | 'active' | 'inactive';

const styles: Record<Variant, string> = {
  available: 'bg-accent-light text-accent',
  unavailable: 'bg-slate-light text-slate',
  overdue: 'bg-overdue-light text-overdue',
  ontime: 'bg-accent-light text-accent',
  active: 'bg-accent-light text-accent',
  inactive: 'bg-slate-light text-slate',
};

const labels: Record<Variant, string> = {
  available: 'Доступна',
  unavailable: 'Нет в наличии',
  overdue: 'Просрочено',
  ontime: 'В срок',
  active: 'Активен',
  inactive: 'Неактивен',
};

export function StatusBadge({ variant, children }: { variant: Variant; children?: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        styles[variant]
      )}
    >
      {children ?? labels[variant]}
    </span>
  );
}
