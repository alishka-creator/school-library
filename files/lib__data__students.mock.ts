import type { Student, Grade, Section } from '@/lib/types';
import { createRng, pick, intBetween, daysAgoISO } from './seed-random';
import {
  KAZAKH_MALE_FIRST,
  KAZAKH_FEMALE_FIRST,
  RUSSIAN_MALE_FIRST,
  RUSSIAN_FEMALE_FIRST,
  KAZAKH_LAST,
  RUSSIAN_LAST,
  feminize,
} from './names';

const GRADES: Grade[] = [7, 8, 9, 10, 11];

// Grades 7-9 run three sections (larger cohort), 10-11 run two
// (students narrow into fewer classes after grade 9) — mirrors a
// typical KZ secondary school structure rather than a flat count.
function sectionsForGrade(grade: Grade): Section[] {
  return grade <= 9 ? ['А', 'Б', 'В'] : ['А', 'Б'];
}

function generateStudents(): Student[] {
  const rng = createRng(20240701);
  const students: Student[] = [];
  let counter = 1;

  for (const grade of GRADES) {
    for (const section of sectionsForGrade(grade)) {
      // Uneven section sizes (16-24) so the roster doesn't look machine-generated.
      const size = intBetween(rng, 16, 24);
      for (let i = 0; i < size; i++) {
        const isKazakh = rng() < 0.62; // roughly reflects national demographic mix
        const isMale = rng() < 0.5;

        let firstName: string;
        let lastName: string;

        if (isKazakh) {
          firstName = isMale ? pick(rng, KAZAKH_MALE_FIRST) : pick(rng, KAZAKH_FEMALE_FIRST);
          lastName = pick(rng, KAZAKH_LAST);
        } else {
          firstName = isMale ? pick(rng, RUSSIAN_MALE_FIRST) : pick(rng, RUSSIAN_FEMALE_FIRST);
          lastName = pick(rng, RUSSIAN_LAST);
          if (!isMale) lastName = feminize(lastName);
        }

        const studentNumber = `S-${2020 + (11 - grade)}-${String(counter).padStart(4, '0')}`;
        const id = `stu-${counter}`;

        students.push({
          id,
          studentNumber,
          firstName,
          lastName,
          grade,
          section,
          barcode: `STB${String(counter).padStart(6, '0')}`,
          status: rng() < 0.03 ? 'inactive' : 'active',
          avatarSeed: studentNumber,
        });

        counter++;
      }
    }
  }

  return students;
}

export const students: Student[] = generateStudents();

export function getStudents(): Student[] {
  return students;
}

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function searchStudents(query: string): Student[] {
  const q = query.trim().toLowerCase();
  if (!q) return students;
  return students.filter((s) => {
    const fullName = `${s.lastName} ${s.firstName}`.toLowerCase();
    return (
      s.studentNumber.toLowerCase().includes(q) ||
      fullName.includes(q) ||
      s.barcode.toLowerCase().includes(q)
    );
  });
}

// exported for use by loans.mock.ts
export { daysAgoISO };
