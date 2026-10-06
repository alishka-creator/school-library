import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border bg-surface px-6 py-14 text-center">
      <Icon className="h-8 w-8 text-slate" strokeWidth={1.5} />
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate">{description}</p>}
    </div>
  );
}
