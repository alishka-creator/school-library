import type { Loan } from '@/lib/types';
import { createRng, pick, intBetween, daysAgoISO, daysFromISO } from './seed-random';
import { students } from './students.mock';
import { books } from './books.mock';
import { staffUsers } from './staff.mock';

const LOAN_PERIOD_DAYS = 14;

function textbooksForGrade(grade: number) {
  return books.filter((b) => b.type === 'textbook' && b.gradeLevel === grade);
}

function generateLoans(): Loan[] {
  const rng = createRng(20240703);
  const loans: Loan[] = [];
  let counter = 1;

  // 1. Baseline: most active students have their grade's textbooks
  // currently checked out (this is the normal, expected state of a
  // school library — everyone is holding their subject books).
  for (const student of students) {
    if (student.status !== 'active') continue;
    const gradeBooks = textbooksForGrade(student.grade);
    if (gradeBooks.length === 0) continue;

    // Each student is currently holding 3-6 of their grade's textbooks.
    const holdCount = intBetween(rng, 3, Math.min(6, gradeBooks.length));
    const shuffledBooks = [...gradeBooks].sort(() => rng() - 0.5).slice(0, holdCount);

    for (const book of shuffledBooks) {
      const issuedDaysAgo = intBetween(rng, 1, 40);
      const dueDate = daysFromISO(LOAN_PERIOD_DAYS, new Date(daysAgoISO(issuedDaysAgo)));
      loans.push({
        id: `ln-${counter++}`,
        studentId: student.id,
        bookId: book.id,
        issuedDate: daysAgoISO(issuedDaysAgo),
        dueDate,
        returnedDate: null,
        issuedByStaffId: pick(rng, staffUsers).id,
      });
    }
  }

  // 2. Fiction/reference loans — smaller, more varied set, some returned
  // (reading history), some still open, a handful overdue on purpose so
  // the dashboard's overdue metric has real data.
  const leisureBooks = books.filter((b) => b.type !== 'textbook');
  const activeStudents = students.filter((s) => s.status === 'active');

  for (let i = 0; i < 260; i++) {
    const student = pick(rng, activeStudents);
    const book = pick(rng, leisureBooks);
    const issuedDaysAgo = intBetween(rng, 1, 200);
    const issuedDate = daysAgoISO(issuedDaysAgo);
    const dueDate = daysFromISO(LOAN_PERIOD_DAYS, new Date(issuedDate));

    // Older loans are more likely returned; recent ones more likely open.
    const returnProbability = Math.min(0.95, issuedDaysAgo / 60);
    const isReturned = rng() < returnProbability;

    let returnedDate: string | null = null;
    if (isReturned) {
      const returnDelay = intBetween(rng, 3, LOAN_PERIOD_DAYS + 10);
      returnedDate = daysFromISO(returnDelay, new Date(issuedDate));
      // Never let a returned date land in the future.
      if (new Date(returnedDate) > new Date()) returnedDate = daysAgoISO(intBetween(rng, 0, 3));
    }

    loans.push({
      id: `ln-${counter++}`,
      studentId: student.id,
      bookId: book.id,
      issuedDate,
      dueDate,
      returnedDate,
      issuedByStaffId: pick(rng, staffUsers).id,
    });
  }

  // 3. Force a realistic handful of overdue loans among the currently-open ones,
  // so the dashboard and student profiles have something meaningful to flag.
  const openLoans = loans.filter((l) => l.returnedDate === null);
  const overdueTargets = openLoans
    .sort(() => rng() - 0.5)
    .slice(0, Math.min(22, openLoans.length));
  for (const loan of overdueTargets) {
    loan.dueDate = daysAgoISO(intBetween(rng, 1, 15));
  }

  return loans;
}

export const loans: Loan[] = generateLoans();

// Keep book.availableCopies consistent with actually-open loans, so the
// catalog never shows availability that contradicts circulation data.
function reconcileAvailability() {
  const openCountByBook = new Map<string, number>();
  for (const loan of loans) {
    if (loan.returnedDate === null) {
      openCountByBook.set(loan.bookId, (openCountByBook.get(loan.bookId) ?? 0) + 1);
    }
  }
  for (const book of books) {
    const openCount = openCountByBook.get(book.id) ?? 0;
    book.availableCopies = Math.max(0, book.totalCopies - openCount);
  }
}
reconcileAvailability();

export function getLoans(): Loan[] {
  return loans;
}

export function getLoansForStudent(studentId: string): Loan[] {
  return loans.filter((l) => l.studentId === studentId);
}

export function getCurrentLoansForStudent(studentId: string): Loan[] {
  return loans.filter((l) => l.studentId === studentId && l.returnedDate === null);
}

export function getLoansForBook(bookId: string): Loan[] {
  return loans.filter((l) => l.bookId === bookId);
}

export function getOpenLoans(): Loan[] {
  return loans.filter((l) => l.returnedDate === null);
}

export function getOverdueLoans(today: Date = new Date()): Loan[] {
  return loans.filter((l) => l.returnedDate === null && new Date(l.dueDate) < today);
}
