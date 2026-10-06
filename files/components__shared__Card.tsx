import { cn } from '@/lib/utils/cn';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded border border-border bg-surface', className)}>
      {children}
    </div>
  );
}
