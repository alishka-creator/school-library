import * as mock from '@/lib/data';
import type { Book, Subject, BookType } from '@/lib/types';

export interface CatalogFilters {
  subject?: Subject | 'all';
  type?: BookType | 'all';
  availableOnly?: boolean;
}

export async function listBooks(): Promise<Book[]> {
  return mock.getBooks();
}

export async function searchCatalog(query: string, filters?: CatalogFilters): Promise<Book[]> {
  let results = mock.searchBooks(query);
  if (filters?.subject && filters.subject !== 'all') {
    results = results.filter((b) => b.subject === filters.subject);
  }
  if (filters?.type && filters.type !== 'all') {
    results = results.filter((b) => b.type === filters.type);
  }
  if (filters?.availableOnly) {
    results = results.filter((b) => b.availableCopies > 0);
  }
  return results;
}

export async function getBook(id: string): Promise<Book | undefined> {
  return mock.getBookById(id);
}
