import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'Class Cloud 360', template: '%s | Class Cloud 360' },
  description: 'La plataforma de aprendizaje del futuro. Aprende, enseña y crece con Class Cloud 360.',
  keywords: ['LMS', 'aprendizaje', 'cursos', 'e-learning', 'educación'],
  icons: {
    icon: '/logo-cc360.jpg',
    shortcut: '/logo-cc360.jpg',
    apple: '/logo-cc360.jpg',
  },
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
