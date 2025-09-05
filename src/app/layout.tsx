import { ClientProviders } from '@/components/ClientProviders';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import FooterConditional from '@/components/shared/footer/FooterConditional';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import ClientLayout from './ClientLayout';
import './globals.css';

// Importar CSS de Fontsource para Onest
import '@fontsource/onest/400.css'; // Regular
import '@fontsource/onest/700.css'; // Bold

// Configuración de viewport
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

// Configuración de metadata
export const metadata: Metadata = {
  // Título y descripción básicos
  title: {
    default: 'Delivery Express - Tu Tienda Online de Confianza',
    template: '%s | Delivery Express',
  },
  description:
    'Delivery Express - Compra rápida y segura online. Entrega express en 24h. Productos de calidad al mejor precio. Envíos gratuitos a partir de 30€.',

  // Metadatos básicos adicionales
  keywords: [
    'delivery express',
    'compras online',
    'supermercado online',
    'entrega a domicilio',
    'comida a domicilio',
    'compra rápida',
    'envío express',
    'tienda online',
    'supermercado digital',
  ],
  authors: [{ name: 'Delivery Express Team' }],
  creator: 'Delivery Express',
  publisher: 'Delivery Express',

  // Configuración de robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // OpenGraph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://delivery-express.com',
    siteName: 'Delivery Express',
    title: 'Delivery Express - Tu Tienda Online de Confianza',
    description:
      'Compra rápida y segura online con entrega express. Productos frescos y de calidad a precios increíbles.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Delivery Express - Tienda Online',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@deliveryexpress',
    creator: '@deliveryexpress',
    title: 'Delivery Express - Tu Tienda Online de Confianza',
    description:
      'Compra rápida y segura online con entrega express. Productos frescos y de calidad.',
    images: ['/twitter-image.jpg'],
  },

  // Iconos y manifest
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0066ff' },
    ],
  },
  manifest: '/manifest.json',

  // Metadatos adicionales para SEO y rendimiento
  metadataBase: new URL('https://delivery-express.com'),
  alternates: {
    canonical: 'https://delivery-express.com',
    languages: {
      'es-ES': 'https://delivery-express.com/es',
      'en-US': 'https://delivery-express.com/en',
    },
  },

  // Metadatos para verificación de sitios
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
    other: {
      'facebook-domain-verification': 'facebook-verification-code',
    },
  },

  // Metadatos para aplicaciones móviles
  appleWebApp: {
    capable: true,
    title: 'Delivery Express',
    statusBarStyle: 'black-translucent',
  },

  // Metadatos adicionales
  category: 'e-commerce',
  classification: 'shopping',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
      <html lang="es" suppressHydrationWarning>
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
        <body className="min-h-screen relative bg-transparent antialiased font-sans">
          <ClientProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AnimatedBackground />
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
              <ClientLayout>{children}</ClientLayout>
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                duration={4000}
              />
              <FooterConditional />
            </ThemeProvider>
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
