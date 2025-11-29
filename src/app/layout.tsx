import { ThemeProvider } from '@/components/shared/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Delivery Express',
  description:
    'Tu tienda online de confianza, productos de calidad con entrega express, diseñados para simplificar tu vida.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${inter.className} ${poppins.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
