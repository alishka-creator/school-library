export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(iso);
  const diff = target.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
