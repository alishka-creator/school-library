'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  initialValue?: string;
  className?: string;
}

export function SearchInput({ placeholder, onChange, initialValue = '', className }: SearchInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const handle = setTimeout(() => onChange(value), 200);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? 'Поиск...'}
        className="w-full rounded border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate focus:border-ink-light focus:outline-none"
      />
    </div>
  );
}
