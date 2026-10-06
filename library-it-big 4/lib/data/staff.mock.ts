import type { StaffUser } from '@/lib/types';

// Two staff accounts: one librarian, one admin (admin is a flag, not a
// separate app — see StaffUser.isAdmin).
export const staffUsers: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Гульмира Ахметова',
    email: 'akhmetova.g@school-lib.kz',
    isAdmin: false,
    avatarSeed: 'staff-1',
  },
  {
    id: 'staff-2',
    name: 'Марат Сериков',
    email: 'serikov.m@school-lib.kz',
    isAdmin: true,
    avatarSeed: 'staff-2',
  },
];

export function getStaffUsers(): StaffUser[] {
  return staffUsers;
}

export function getStaffById(id: string): StaffUser | undefined {
  return staffUsers.find((u) => u.id === id);
}
