export interface Loan {
  id: string;
  studentId: string;
  bookId: string;
  issuedDate: string; // ISO date
  dueDate: string; // ISO date
  returnedDate: string | null; // null = currently borrowed
  issuedByStaffId: string;
}

export function isOverdue(loan: Loan, today: Date = new Date()): boolean {
  if (loan.returnedDate) return false;
  return new Date(loan.dueDate) < today;
}

export function isCurrentlyBorrowed(loan: Loan): boolean {
  return loan.returnedDate === null;
}
