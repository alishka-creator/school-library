import * as mock from '@/lib/data';

export interface DashboardMetrics {
  currentlyCheckedOut: number;
  overdueCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  issuedTodayCount: number;
  mostActiveSubject: { subject: string; count: number } | null;
  lowAvailabilityBooks: { id: string; title: string; available: number; total: number }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const loans = mock.getLoans();
  const books = mock.getBooks();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const openLoans = loans.filter((l) => l.returnedDate === null);
  const overdue = openLoans.filter((l) => new Date(l.dueDate) < today);
  const dueToday = openLoans.filter((l) => l.dueDate === todayStr);
  const dueThisWeek = openLoans.filter(
    (l) => new Date(l.dueDate) >= today && new Date(l.dueDate) <= weekFromNow
  );
  const issuedToday = loans.filter((l) => l.issuedDate === todayStr);

  // Most active subject in the last 30 days by loans issued.
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const subjectCounts = new Map<string, number>();
  for (const loan of loans) {
    if (new Date(loan.issuedDate) < thirtyDaysAgo) continue;
    const book = books.find((b) => b.id === loan.bookId);
    if (!book) continue;
    subjectCounts.set(book.subject, (subjectCounts.get(book.subject) ?? 0) + 1);
  }
  let mostActiveSubject: DashboardMetrics['mostActiveSubject'] = null;
  for (const [subject, count] of subjectCounts.entries()) {
    if (!mostActiveSubject || count > mostActiveSubject.count) {
      mostActiveSubject = { subject, count };
    }
  }

  const lowAvailabilityBooks = books
    .filter((b) => b.availableCopies === 0 || b.availableCopies / b.totalCopies <= 0.1)
    .sort((a, b) => a.availableCopies / a.totalCopies - b.availableCopies / b.totalCopies)
    .slice(0, 6)
    .map((b) => ({ id: b.id, title: b.title, available: b.availableCopies, total: b.totalCopies }));

  return {
    currentlyCheckedOut: openLoans.length,
    overdueCount: overdue.length,
    dueTodayCount: dueToday.length,
    dueThisWeekCount: dueThisWeek.length,
    issuedTodayCount: issuedToday.length,
    mostActiveSubject,
    lowAvailabilityBooks,
  };
}

export interface ActivityEvent {
  id: string;
  type: 'issued' | 'returned';
  date: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
}

export async function getRecentActivity(limit = 10): Promise<ActivityEvent[]> {
  const loans = mock.getLoans();
  const students = mock.getStudents();
  const books = mock.getBooks();

  const events: ActivityEvent[] = [];
  for (const loan of loans) {
    const student = students.find((s) => s.id === loan.studentId);
    const book = books.find((b) => b.id === loan.bookId);
    if (!student || !book) continue;
    events.push({
      id: `${loan.id}-issued`,
      type: 'issued',
      date: loan.issuedDate,
      studentId: student.id,
      studentName: `${student.lastName} ${student.firstName}`,
      bookId: book.id,
      bookTitle: book.title,
    });
    if (loan.returnedDate) {
      events.push({
        id: `${loan.id}-returned`,
        type: 'returned',
        date: loan.returnedDate,
        studentId: student.id,
        studentName: `${student.lastName} ${student.firstName}`,
        bookId: book.id,
        bookTitle: book.title,
      });
    }
  }

  return events.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}
