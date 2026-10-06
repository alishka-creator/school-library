// Realistic Kazakh and Russian names, mixed — reflecting a typical
// Kazakhstan secondary school class roster.

export const KAZAKH_MALE_FIRST = [
  'Ерасыл', 'Алдияр', 'Бекзат', 'Дархан', 'Ерлан', 'Нурсултан', 'Санжар',
  'Тимур', 'Ислам', 'Мирас', 'Азамат', 'Данияр', 'Ерасыл', 'Куаныш',
  'Абылай', 'Ануар', 'Асхат', 'Бауыржан', 'Жандос', 'Мухтар',
];

export const KAZAKH_FEMALE_FIRST = [
  'Айгерим', 'Аружан', 'Дана', 'Диана', 'Инкар',
  'Камила', 'Мадина', 'Назерке', 'Сезим', 'Томирис',
  'Айым', 'Алина', 'Гульнур', 'Жания', 'Зере', 'Нурай', 'Сара', 'Шугыла',
  'Әсел', 'Ләззат',
];

export const RUSSIAN_MALE_FIRST = [
  'Александр', 'Дмитрий', 'Максим', 'Артём', 'Иван', 'Кирилл', 'Никита',
  'Егор', 'Роман', 'Владислав', 'Данил', 'Глеб', 'Матвей', 'Тимофей',
];

export const RUSSIAN_FEMALE_FIRST = [
  'Анастасия', 'Виктория', 'Дарья', 'Екатерина', 'Мария', 'Полина',
  'София', 'Елизавета', 'Ксения', 'Алиса', 'Валерия', 'Юлия',
];

export const KAZAKH_LAST = [
  'Абенов', 'Байжанов', 'Ерланов', 'Жумабеков', 'Кенжебаев', 'Мукатов',
  'Нурланов', 'Оразбаев', 'Сатыбалдин', 'Тулегенов', 'Хасенов', 'Шаяхметов',
  'Абдразаков', 'Дюсенов', 'Ибрагимов', 'Касымов',
];

export const RUSSIAN_LAST = [
  'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Волков', 'Соколов',
  'Морозов', 'Новиков', 'Фёдоров', 'Егоров', 'Павлов', 'Гаврилов',
];

// Simple last-name feminization for Slavic surnames ending in -ов/-ев/-ин.
export function feminize(lastName: string): string {
  if (lastName.endsWith('ов')) return lastName + 'а';
  if (lastName.endsWith('ев')) return lastName + 'а';
  if (lastName.endsWith('ин')) return lastName + 'а';
  return lastName;
}

export const STAFF_NAMES = [
  { name: 'Гульмира Ахметова', email: 'akhmetova.g@school-lib.kz' },
  { name: 'Марат Сериков', email: 'serikov.m@school-lib.kz' },
];
