// Service layer — pages call these, never lib/data directly. When
// Supabase is connected later, only the internals here change.
import * as mock from '@/lib/data';
import type { Student } from '@/lib/types';

export async function listStudents(): Promise<Student[]> {
  return mock.getStudents();
}

export async function searchStudents(query: string): Promise<Student[]> {
  return mock.searchStudents(query);
}

export async function getStudent(id: string): Promise<Student | undefined> {
  return mock.getStudentById(id);
}
