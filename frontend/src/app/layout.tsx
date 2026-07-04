import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'Classroom Cloud 360', template: '%s | Classroom Cloud 360' },
  description: 'La plataforma de aprendizaje del futuro. Aprende, enseña y crece con Classroom Cloud 360.',
  keywords: ['LMS', 'aprendizaje', 'cursos', 'e-learning', 'educación'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
