import * as mock from '@/lib/data';
import type { StaffUser } from '@/lib/types';

export async function listStaff(): Promise<StaffUser[]> {
  return mock.getStaffUsers();
}

export async function getStaff(id: string): Promise<StaffUser | undefined> {
  return mock.getStaffById(id);
}

// The "logged-in" user for this mock-data phase — swapped for real
// session/auth once Supabase is connected.
export async function getCurrentStaff(): Promise<StaffUser> {
  const all = mock.getStaffUsers();
  return all[0];
}
