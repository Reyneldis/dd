// src/app/layout.tsx

import { ClientProviders } from '@/components/ClientProviders';
import FooterConditional from '@/components/shared/footer/FooterConditional';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import React, { Suspense } from 'react'; // <-- CAMBIO 1: Importa Suspense
import { Toaster } from 'sonner';
import ClientLayout from './ClientLayout';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: 'Delivery Express',
    template: '%s | Delivery Express',
  },
  description: 'Delivery Express - Compra rápida y segura online.',
  metadataBase: new URL('https://delivery-express.com'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://delivery-express.com',
    siteName: 'Delivery Express',
    title: 'Delivery Express',
    description: 'Compra rápida y segura en Delivery Express',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Delivery Express',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delivery Express',
    description: 'Compra rápida y segura en Delivery Express',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
        <head>
          {/* DNS Prefetch para recursos externos */}
          <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />

          {/* Structured Data para SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Delivery Express',
                url: 'https://delivery-express.com',
                logo: 'https://delivery-express.com/logo.png',
                description:
                  'Tienda online premium con productos exclusivos y de alta calidad',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'ES',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  availableLanguage: 'Spanish',
                },
                sameAs: [
                  'https://facebook.com/deliveryexpress',
                  'https://twitter.com/deliveryexpress',
                  'https://instagram.com/deliveryexpress',
                ],
              }),
            }}
          />
        </head>
        <body
          className="min-h-screen relative bg-transparent antialiased font-sans"
          suppressHydrationWarning
        >
          <ClientProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="#2563eb"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2563eb,0 0 5px #2563eb"
              />

              {/* CAMBIO 2: Envuelve ClientLayout en Suspense */}
              <Suspense fallback={<div>Cargando interfaz...</div>}>
                <ClientLayout>{children}</ClientLayout>
              </Suspense>

              <Toaster
                position="bottom-right"
                richColors
                closeButton
                duration={4000}
              />
              <FooterConditional />
              <ScrollToTopButton />
            </ThemeProvider>
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
