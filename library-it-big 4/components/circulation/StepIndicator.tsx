export function StepIndicator({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {labels.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                active
                  ? 'bg-ink text-white'
                  : done
                  ? 'bg-accent text-white'
                  : 'bg-slate-light text-slate'
              }`}
            >
              {n}
            </div>
            <span className={`text-sm ${active ? 'text-ink' : 'text-slate'}`}>{label}</span>
            {n < labels.length && <div className="mx-1 h-px w-6 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
