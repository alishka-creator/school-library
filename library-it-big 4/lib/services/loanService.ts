import * as mock from '@/lib/data';
import type { Loan } from '@/lib/types';

export async function getLoansForStudent(studentId: string): Promise<Loan[]> {
  return mock.getLoansForStudent(studentId);
}

export async function getCurrentLoansForStudent(studentId: string): Promise<Loan[]> {
  return mock.getCurrentLoansForStudent(studentId);
}

export async function getLoansForBook(bookId: string): Promise<Loan[]> {
  return mock.getLoansForBook(bookId);
}

export async function getOpenLoans(): Promise<Loan[]> {
  return mock.getOpenLoans();
}

export async function getOverdueLoans(): Promise<Loan[]> {
  return mock.getOverdueLoans();
}

export async function getAllLoans(): Promise<Loan[]> {
  return mock.getLoans();
}

// Circulation actions — mutate the in-memory mock array for this demo.
// A real backend call (Supabase insert/update) replaces the body only.
export async function issueBook(studentId: string, bookId: string, staffId: string): Promise<Loan> {
  const book = mock.getBookById(bookId);
  if (!book) throw new Error('Book not found');
  if (book.availableCopies <= 0) throw new Error('No available copies');

  const issuedDate = new Date().toISOString().slice(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 14);

  const newLoan: Loan = {
    id: `ln-new-${Date.now()}`,
    studentId,
    bookId,
    issuedDate,
    dueDate: due.toISOString().slice(0, 10),
    returnedDate: null,
    issuedByStaffId: staffId,
  };

  mock.getLoans().push(newLoan);
  book.availableCopies -= 1;
  return newLoan;
}

export async function returnBook(loanId: string): Promise<Loan> {
  const loan = mock.getLoans().find((l) => l.id === loanId);
  if (!loan) throw new Error('Loan not found');
  if (loan.returnedDate) return loan;

  loan.returnedDate = new Date().toISOString().slice(0, 10);
  const book = mock.getBookById(loan.bookId);
  if (book) book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  return loan;
}
