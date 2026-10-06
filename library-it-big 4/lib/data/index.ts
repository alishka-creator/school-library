// Central import point — guarantees module initialization order
// (students -> books -> staff -> loans) so loans.mock's availability
// reconciliation always runs before any consumer reads book data.
export * from './students.mock';
export * from './books.mock';
export * from './staff.mock';
export * from './loans.mock';
