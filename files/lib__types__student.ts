export type Grade = 7 | 8 | 9 | 10 | 11;
export type Section = 'А' | 'Б' | 'В';

export interface Student {
  id: string;
  studentNumber: string; // e.g. "S-2024-0142" — the searchable ID
  firstName: string;
  lastName: string;
  grade: Grade;
  section: Section;
  barcode: string; // reserved for future QR/scanner UI
  status: 'active' | 'inactive';
  avatarSeed: string;
}

export function studentFullName(s: Student): string {
  return `${s.lastName} ${s.firstName}`;
}

export function studentClassLabel(s: Student): string {
  return `${s.grade}${s.section}`;
}
