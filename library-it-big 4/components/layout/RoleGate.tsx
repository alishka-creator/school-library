'use client';

import { useStaff } from './StaffContext';

export function RoleGate({ children }: { children: React.ReactNode }) {
  const { currentStaff } = useStaff();
  if (!currentStaff.isAdmin) return null;
  return <>{children}</>;
}
