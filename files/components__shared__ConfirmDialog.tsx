'use client';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded border border-border bg-surface p-5 shadow-xl">
        <h3 className="font-serif text-lg text-ink">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate">{description}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded px-3 py-1.5 text-sm text-ink hover:bg-slate-light">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="rounded bg-ink px-3 py-1.5 text-sm text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
