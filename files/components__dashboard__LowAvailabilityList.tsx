import Link from 'next/link';

interface Item {
  id: string;
  title: string;
  available: number;
  total: number;
}

export function LowAvailabilityList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate">Дефицита книг не обнаружено.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li key={b.id} className="flex items-center justify-between text-sm">
          <Link href={`/catalog/${b.id}`} className="truncate text-ink hover:underline">
            {b.title}
          </Link>
          <span className="shrink-0 text-slate">
            {b.available} / {b.total}
          </span>
        </li>
      ))}
    </ul>
  );
}
