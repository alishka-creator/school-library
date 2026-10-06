import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: 'neutral' | 'warning' | 'good';
}) {
  const toneStyles = {
    neutral: 'text-ink',
    warning: 'text-overdue',
    good: 'text-accent',
  }[tone];

  return (
    <div className="rounded border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate">{label}</span>
        <Icon className={cn('h-4 w-4', toneStyles)} strokeWidth={1.75} />
      </div>
      <p className={cn('mt-2 font-serif text-3xl', toneStyles)}>{value}</p>
    </div>
  );
}
