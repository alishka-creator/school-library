'use client';

import { createContext, useContext, useState } from 'react';
import type { StaffUser } from '@/lib/types';

// Demo-only: no real auth yet (mock-data phase). Lets you preview how
// the Admin flag changes the UI without building a login flow.
const DEMO_LIBRARIAN: StaffUser = {
  id: 'staff-1',
  name: 'Гульмира Ахметова',
  email: 'akhmetova.g@school-lib.kz',
  isAdmin: false,
  avatarSeed: 'staff-1',
};

const DEMO_ADMIN: StaffUser = {
  id: 'staff-2',
  name: 'Марат Сериков',
  email: 'serikov.m@school-lib.kz',
  isAdmin: true,
  avatarSeed: 'staff-2',
};

interface StaffContextValue {
  currentStaff: StaffUser;
  toggleRole: () => void;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(true);
  const currentStaff = isAdmin ? DEMO_ADMIN : DEMO_LIBRARIAN;

  return (
    <StaffContext.Provider value={{ currentStaff, toggleRole: () => setIsAdmin((v) => !v) }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used within StaffProvider');
  return ctx;
}
