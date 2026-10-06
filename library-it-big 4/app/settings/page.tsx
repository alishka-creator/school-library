'use client';

import { useState } from 'react';
import { ShieldAlert, Plus } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar } from '@/components/shared/Avatar';
import { useStaff } from '@/components/layout/StaffContext';
import { getStaffUsers } from '@/lib/data';

const TABS = ['Библиотека', 'Профиль', 'Уведомления', 'Внешний вид', 'Система', 'Сотрудники'] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const { currentStaff } = useStaff();
  const [tab, setTab] = useState<Tab>('Библиотека');

  if (!currentStaff.isAdmin) {
    return (
      <AppShell title="Настройки">
        <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border bg-surface px-6 py-16 text-center">
          <ShieldAlert className="h-8 w-8 text-slate" strokeWidth={1.5} />
          <p className="font-medium text-ink">Доступно только администратору</p>
          <p className="max-w-sm text-sm text-slate">
            Переключитесь на роль администратора в меню профиля, чтобы увидеть настройки.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Настройки">
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded px-3 py-1.5 text-sm ${
              tab === t ? 'bg-ink text-white' : 'text-ink hover:bg-slate-light'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 max-w-2xl">
        {tab === 'Библиотека' && (
          <div className="space-y-4 rounded border border-border bg-surface p-5">
            <h3 className="font-serif text-lg text-ink">Информация о библиотеке</h3>
            <Field label="Название школы" defaultValue="Школа №12, г. Кокшетау" />
            <Field label="Адрес" defaultValue="ул. Абая, 45, г. Кокшетау" />
            <Field label="Часы работы" defaultValue="Пн–Пт, 08:30–17:00" />
            <Field label="Срок выдачи по умолчанию (дней)" defaultValue="14" />
          </div>
        )}

        {tab === 'Профиль' && (
          <div className="rounded border border-border bg-surface p-5">
            <h3 className="font-serif text-lg text-ink">Профиль сотрудника</h3>
            <div className="mt-4 flex items-center gap-4">
              <Avatar seed={currentStaff.avatarSeed} size={56} />
              <div>
                <p className="font-medium text-ink">{currentStaff.name}</p>
                <p className="text-sm text-slate">{currentStaff.email}</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Имя" defaultValue={currentStaff.name} />
              <Field label="Email" defaultValue={currentStaff.email} />
            </div>
          </div>
        )}

        {tab === 'Уведомления' && (
          <div className="space-y-4 rounded border border-border bg-surface p-5">
            <h3 className="font-serif text-lg text-ink">Уведомления</h3>
            <Toggle label="Напоминания о просроченных книгах" defaultChecked />
            <Toggle label="Ежедневная сводка по email" defaultChecked={false} />
            <Toggle label="Уведомления о новых поступлениях" defaultChecked />
          </div>
        )}

        {tab === 'Внешний вид' && (
          <div className="space-y-4 rounded border border-border bg-surface p-5">
            <h3 className="font-serif text-lg text-ink">Внешний вид</h3>
            <p className="text-sm text-slate">Тема оформления фиксирована для соответствия стилю школы.</p>
            <div className="flex gap-3">
              <div className="flex h-16 w-24 items-center justify-center rounded border-2 border-ink bg-paper text-xs text-ink">
                Светлая (активна)
              </div>
              <div className="flex h-16 w-24 items-center justify-center rounded border border-border bg-slate-light text-xs text-slate">
                Тёмная (скоро)
              </div>
            </div>
          </div>
        )}

        {tab === 'Система' && (
          <div className="space-y-2 rounded border border-border bg-surface p-5 text-sm">
            <h3 className="mb-2 font-serif text-lg text-ink">Системная информация</h3>
            <Row label="Версия приложения" value="0.1.0 (mock-данные)" />
            <Row label="Источник данных" value="Локальные mock-данные" />
            <Row label="База данных" value="Supabase — не подключена" />
            <Row label="Хостинг" value="Vercel" />
          </div>
        )}

        {tab === 'Сотрудники' && (
          <div className="rounded border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">Сотрудники библиотеки</h3>
              <button className="flex items-center gap-1.5 rounded bg-ink px-3 py-1.5 text-xs text-white">
                <Plus className="h-3.5 w-3.5" /> Добавить
              </button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {getStaffUsers().map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-3">
                  <Avatar seed={s.avatarSeed} size={36} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-slate">{s.email}</p>
                  </div>
                  <span className="rounded bg-slate-light px-2 py-1 text-xs text-ink">
                    {s.isAdmin ? 'Администратор' : 'Библиотекарь'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate">{label}</span>
      <input
        defaultValue={defaultValue}
        className="w-full rounded border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-ink-light focus:outline-none"
      />
    </label>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm text-ink">{label}</span>
      <button
        onClick={() => setChecked((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-slate-light'}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2 last:border-0">
      <span className="text-slate">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
