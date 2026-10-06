import type { Book, Subject } from '@/lib/types';
import { createRng, pick, intBetween, shuffle } from './seed-random';

// Curated required textbooks per subject/grade, matching the KZ secondary
// (grades 7-11) curriculum in spirit — this is what makes the textbook
// side of the catalog feel authentic instead of randomly generated.
interface TextbookSeed {
  subject: Subject;
  grade: number;
  title: string;
  author: string;
}

const TEXTBOOK_SEEDS: TextbookSeed[] = [
  { subject: 'Mathematics', grade: 7, title: 'Алгебра 7', author: 'А. Абдиев' },
  { subject: 'Mathematics', grade: 8, title: 'Алгебра 8', author: 'А. Абдиев' },
  { subject: 'Mathematics', grade: 9, title: 'Алгебра 9', author: 'А. Абдиев' },
  { subject: 'Mathematics', grade: 10, title: 'Алгебра и начала анализа 10', author: 'Ю. Скляров' },
  { subject: 'Mathematics', grade: 11, title: 'Алгебра и начала анализа 11', author: 'Ю. Скляров' },
  { subject: 'Mathematics', grade: 7, title: 'Геометрия 7', author: 'Р. Смирнова' },
  { subject: 'Physics', grade: 7, title: 'Физика 7', author: 'Қ. Тұрдиев' },
  { subject: 'Physics', grade: 8, title: 'Физика 8', author: 'Қ. Тұрдиев' },
  { subject: 'Physics', grade: 9, title: 'Физика 9', author: 'Қ. Тұрдиев' },
  { subject: 'Physics', grade: 10, title: 'Физика 10', author: 'Н. Бекенов' },
  { subject: 'Physics', grade: 11, title: 'Физика 11', author: 'Н. Бекенов' },
  { subject: 'Informatics', grade: 7, title: 'Информатика 7', author: 'Е. Балафанов' },
  { subject: 'Informatics', grade: 8, title: 'Информатика 8', author: 'Е. Балафанов' },
  { subject: 'Informatics', grade: 9, title: 'Информатика 9', author: 'Е. Балафанов' },
  { subject: 'Informatics', grade: 10, title: 'Информатика 10', author: 'С. Иргалиев' },
  { subject: 'Informatics', grade: 11, title: 'Информатика 11', author: 'С. Иргалиев' },
  { subject: 'Chemistry', grade: 7, title: 'Химия 7', author: 'Н. Нурахметов' },
  { subject: 'Chemistry', grade: 8, title: 'Химия 8', author: 'Н. Нурахметов' },
  { subject: 'Chemistry', grade: 9, title: 'Химия 9', author: 'Н. Нурахметов' },
  { subject: 'Chemistry', grade: 10, title: 'Химия 10', author: 'Ә. Темірболатова' },
  { subject: 'Chemistry', grade: 11, title: 'Химия 11', author: 'Ә. Темірболатова' },
  { subject: 'Biology', grade: 7, title: 'Биология 7', author: 'Б. Жаппарова' },
  { subject: 'Biology', grade: 8, title: 'Биология 8', author: 'Б. Жаппарова' },
  { subject: 'Biology', grade: 9, title: 'Биология 9', author: 'Б. Жаппарова' },
  { subject: 'Biology', grade: 10, title: 'Биология 10', author: 'Р. Аймагамбетова' },
  { subject: 'Biology', grade: 11, title: 'Биология 11', author: 'Р. Аймагамбетова' },
  { subject: 'History', grade: 7, title: 'Қазақстан тарихы 7', author: 'Ж. Қасымбаев' },
  { subject: 'History', grade: 8, title: 'Қазақстан тарихы 8', author: 'Ж. Қасымбаев' },
  { subject: 'History', grade: 9, title: 'Қазақстан тарихы 9', author: 'Ж. Қасымбаев' },
  { subject: 'History', grade: 10, title: 'Дүниежүзі тарихы 10', author: 'М. Тәтімов' },
  { subject: 'History', grade: 11, title: 'Дүниежүзі тарихы 11', author: 'М. Тәтімов' },
  { subject: 'Geography', grade: 7, title: 'География 7', author: 'С. Асанова' },
  { subject: 'Geography', grade: 8, title: 'География 8', author: 'С. Асанова' },
  { subject: 'Geography', grade: 9, title: 'География 9', author: 'С. Асанова' },
  { subject: 'Geography', grade: 10, title: 'Экономикалық география 10', author: 'Ж. Дюсенова' },
  { subject: 'Kazakh Language', grade: 7, title: 'Қазақ тілі 7', author: 'Ф. Оразбаева' },
  { subject: 'Kazakh Language', grade: 8, title: 'Қазақ тілі 8', author: 'Ф. Оразбаева' },
  { subject: 'Kazakh Language', grade: 9, title: 'Қазақ тілі 9', author: 'Ф. Оразбаева' },
  { subject: 'Kazakh Literature', grade: 7, title: 'Қазақ әдебиеті 7', author: 'Р. Нұрғали' },
  { subject: 'Kazakh Literature', grade: 8, title: 'Қазақ әдебиеті 8', author: 'Р. Нұрғали' },
  { subject: 'Kazakh Literature', grade: 9, title: 'Қазақ әдебиеті 9', author: 'Р. Нұрғали' },
  { subject: 'Russian Language', grade: 7, title: 'Русский язык 7', author: 'Л. Никитина' },
  { subject: 'Russian Language', grade: 8, title: 'Русский язык 8', author: 'Л. Никитина' },
  { subject: 'Russian Language', grade: 9, title: 'Русский язык 9', author: 'Л. Никитина' },
  { subject: 'Russian Literature', grade: 10, title: 'Русская литература 10', author: 'В. Скиргайло' },
  { subject: 'Russian Literature', grade: 11, title: 'Русская литература 11', author: 'В. Скиргайло' },
  { subject: 'English', grade: 7, title: 'English 7 (Kazakhstan)', author: 'H. Puchta' },
  { subject: 'English', grade: 8, title: 'English 8 (Kazakhstan)', author: 'H. Puchta' },
  { subject: 'English', grade: 9, title: 'English 9 (Kazakhstan)', author: 'H. Puchta' },
  { subject: 'English', grade: 10, title: 'English 10 (Kazakhstan)', author: 'H. Puchta' },
  { subject: 'English', grade: 11, title: 'English 11 (Kazakhstan)', author: 'H. Puchta' },
];

const FICTION_TITLES: { title: string; author: string }[] = [
  { title: 'Абай жолы', author: 'Мұхтар Әуезов' },
  { title: 'Көшпенділер', author: 'Ілияс Есенберлин' },
  { title: 'Қан мен тер', author: 'Әбдіжәміл Нұрпейісов' },
  { title: 'Менің атым Қожа', author: 'Бердібек Соқпақбаев' },
  { title: 'Евгений Онегин', author: 'Александр Пушкин' },
  { title: 'Герой нашего времени', author: 'Михаил Лермонтов' },
  { title: 'Война и мир', author: 'Лев Толстой' },
  { title: 'Преступление и наказание', author: 'Фёдор Достоевский' },
  { title: 'Мастер и Маргарита', author: 'Михаил Булгаков' },
  { title: 'Тихий Дон', author: 'Михаил Шолохов' },
  { title: 'Отцы и дети', author: 'Иван Тургенев' },
  { title: 'Ревизор', author: 'Николай Гоголь' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { title: 'Animal Farm', author: 'George Orwell' },
  { title: '1984', author: 'George Orwell' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { title: 'The Adventures of Tom Sawyer', author: 'Mark Twain' },
  { title: 'Little Women', author: 'Louisa May Alcott' },
  { title: 'The Old Man and the Sea', author: 'Ernest Hemingway' },
  { title: 'Bұлыт', author: 'Мұхтар Мағауин' },
  { title: 'Аққулар ұйықтағанда', author: 'Мұқағали Мақатаев' },
  { title: 'Балалық шаққа саяхат', author: 'Бердібек Соқпақбаев' },
];

const REFERENCE_TITLES: { title: string; author: string; subject: Subject }[] = [
  { title: 'Орыс-қазақ түсіндірме сөздігі', author: 'Ред. алқасы', subject: 'Russian Language' },
  { title: 'Периодтық жүйе анықтамалығы', author: 'Ред. алқасы', subject: 'Chemistry' },
  { title: 'Атлас Қазақстана', author: 'Ред. алқасы', subject: 'Geography' },
  { title: 'Математикалық формулалар жинағы', author: 'Ред. алқасы', subject: 'Mathematics' },
  { title: 'English-Kazakh-Russian Dictionary', author: 'Ред. алқасы', subject: 'English' },
  { title: 'Физикалық шамалар кестесі', author: 'Ред. алқасы', subject: 'Physics' },
];

function isbn13(rng: () => number): string {
  let digits = '978';
  for (let i = 0; i < 9; i++) digits += intBetween(rng, 0, 9);
  // compute ISBN-13 check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(digits[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return digits + String(check);
}

function shelfFor(subject: Subject, index: number): string {
  const zone = subject.slice(0, 1).toUpperCase();
  return `${zone}-${String((index % 30) + 1).padStart(2, '0')}`;
}

function generateBooks(): Book[] {
  const rng = createRng(20240702);
  const books: Book[] = [];
  let counter = 1;

  for (const seed of TEXTBOOK_SEEDS) {
    const totalCopies = intBetween(rng, 18, 40); // textbooks: high copy count
    const checkedOut = intBetween(rng, 0, Math.floor(totalCopies * 0.6));
    books.push({
      id: `bk-${counter}`,
      isbn: isbn13(rng),
      title: seed.title,
      author: seed.author,
      subject: seed.subject,
      type: 'textbook',
      gradeLevel: seed.grade,
      totalCopies,
      availableCopies: totalCopies - checkedOut,
      barcode: `BKB${String(counter).padStart(6, '0')}`,
      shelfLocation: shelfFor(seed.subject, counter),
    });
    counter++;
  }

  for (const seed of FICTION_TITLES) {
    const totalCopies = intBetween(rng, 1, 5); // fiction: low copy count
    const checkedOut = intBetween(rng, 0, totalCopies);
    const isKzLit = /[а-яәғқңөұүһі]/i.test(seed.title) && !/[a-z]/i.test(seed.title);
    books.push({
      id: `bk-${counter}`,
      isbn: isbn13(rng),
      title: seed.title,
      author: seed.author,
      subject: isKzLit ? 'Kazakh Literature' : 'Russian Literature',
      type: 'fiction',
      totalCopies,
      availableCopies: totalCopies - checkedOut,
      barcode: `BKB${String(counter).padStart(6, '0')}`,
      shelfLocation: shelfFor('Fiction' as Subject, counter),
    });
    counter++;
  }

  for (const seed of REFERENCE_TITLES) {
    const totalCopies = intBetween(rng, 2, 6);
    const checkedOut = intBetween(rng, 0, Math.floor(totalCopies * 0.3));
    books.push({
      id: `bk-${counter}`,
      isbn: isbn13(rng),
      title: seed.title,
      author: seed.author,
      subject: seed.subject,
      type: 'reference',
      totalCopies,
      availableCopies: totalCopies - checkedOut,
      barcode: `BKB${String(counter).padStart(6, '0')}`,
      shelfLocation: shelfFor(seed.subject, counter),
    });
    counter++;
  }

  return shuffle(rng, books);
}

export const books: Book[] = generateBooks();

export function getBooks(): Book[] {
  return books;
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function searchBooks(query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return books;
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.isbn.includes(q) ||
      b.barcode.toLowerCase().includes(q)
  );
}
