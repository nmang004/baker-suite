import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Baker's Suite - Your Intelligent Baking Companion",
  description:
    'Achieve professional consistency with ratio-perfect recipes, weather-smart timelines, and flavor discovery.',
  keywords: [
    'baking',
    'sourdough',
    'bread',
    'recipes',
    'baking calculator',
    'weather',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
