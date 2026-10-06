import Link from 'next/link';
import { BookX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-4 text-center">
      <BookX className="h-10 w-10 text-slate" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-ink">Страница не найдена</h1>
      <p className="max-w-sm text-sm text-slate">
        Возможно, запись была удалена или ссылка устарела.
      </p>
      <Link href="/dashboard" className="mt-2 rounded bg-ink px-4 py-2 text-sm text-white">
        На дашборд
      </Link>
    </div>
  );
}
