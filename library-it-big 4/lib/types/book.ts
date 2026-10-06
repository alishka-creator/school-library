export type BookType = 'textbook' | 'fiction' | 'reference';

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Informatics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Kazakh Language',
  'Kazakh Literature',
  'Russian Language',
  'Russian Literature',
  'English',
] as const;

export type Subject = typeof SUBJECTS[number];

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  subject: Subject;
  type: BookType;
  gradeLevel?: number; // for textbooks
  totalCopies: number;
  availableCopies: number;
  barcode: string; // reserved for future scanner UI
  shelfLocation: string; // e.g. "A-12"
}
