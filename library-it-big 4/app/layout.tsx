import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';

const lora = Lora({ subsets: ['latin', 'cyrillic'], variable: '--font-lora', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Library — School Library System',
  description: 'Library management system for grades 7–11',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${lora.variable} ${inter.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
