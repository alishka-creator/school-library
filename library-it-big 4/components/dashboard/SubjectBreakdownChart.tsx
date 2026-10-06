export function SubjectBreakdownBar({ subject, count, max }: { subject: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 truncate text-sm text-ink">{subject}</span>
      <div className="h-2 flex-1 rounded-full bg-slate-light">
        <div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-sm text-slate">{count}</span>
    </div>
  );
}
