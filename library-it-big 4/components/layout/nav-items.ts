import { LayoutDashboard, Users, BookOpen, ArrowLeftRight, ClipboardList, AlertTriangle, Settings } from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Дашборд', icon: LayoutDashboard, adminOnly: false },
  { href: '/students', label: 'Ученики', icon: Users, adminOnly: false },
  { href: '/catalog', label: 'Каталог', icon: BookOpen, adminOnly: false },
  { href: '/circulation/issue', label: 'Выдача / Возврат', icon: ArrowLeftRight, adminOnly: false },
  { href: '/loans', label: 'Все выдачи', icon: ClipboardList, adminOnly: false },
  { href: '/overdue', label: 'Просроченные', icon: AlertTriangle, adminOnly: false },
  { href: '/settings', label: 'Настройки', icon: Settings, adminOnly: true },
] as const;
