import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${fraunces.variable} ${jetBrainsMono.variable} font-sans`}
        >
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster />
              <SonnerToaster position="top-right" />
            </QueryProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
