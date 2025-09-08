// import { ClientProviders } from '@/components/ClientProviders';
// import AnimatedBackground from '@/components/shared/AnimatedBackground';
// import FooterConditional from '@/components/shared/footer/FooterConditional';
// import { ClerkProvider } from '@clerk/nextjs';
// import type { Metadata, Viewport } from 'next';
// import { ThemeProvider } from 'next-themes';
// import NextTopLoader from 'nextjs-toploader';
// import { Toaster } from 'sonner';
// import ClientLayout from './ClientLayout';
// import './globals.css';

// // Importar CSS de Fontsource para Onest
// import '@fontsource/onest/400.css'; // Regular
// import '@fontsource/onest/700.css'; // Bold

// // Configuración de viewport
// export const viewport: Viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: '#ffffff' },
//     { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
//   ],
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
// };

// // Configuración de metadata
// export const metadata: Metadata = {
//   // Título y descripción básicos
//   title: {
//     default: 'Delivery Express - Tu Tienda Online de Confianza',
//     template: '%s | Delivery Express',
//   },
//   description:
//     'Delivery Express - Compra rápida y segura online. Entrega express en 24h. Productos de calidad al mejor precio. Envíos gratuitos a partir de 30€.',

//   // Metadatos básicos adicionales
//   keywords: [
//     'delivery express',
//     'compras online',
//     'supermercado online',
//     'entrega a domicilio',
//     'comida a domicilio',
//     'compra rápida',
//     'envío express',
//     'tienda online',
//     'supermercado digital',
//   ],
//   authors: [{ name: 'Delivery Express Team' }],
//   creator: 'Delivery Express',
//   publisher: 'Delivery Express',

//   // Configuración de robots
//   robots: {
//     index: true,
//     follow: true,
//     nocache: false,
//     googleBot: {
//       index: true,
//       follow: true,
//       noimageindex: false,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },

//   // OpenGraph (Facebook, LinkedIn, etc.)
//   openGraph: {
//     type: 'website',
//     locale: 'es_ES',
//     url: 'https://delivery-express.com',
//     siteName: 'Delivery Express',
//     title: 'Delivery Express - Tu Tienda Online de Confianza',
//     description:
//       'Compra rápida y segura online con entrega express. Productos frescos y de calidad a precios increíbles.',
//     images: [
//       {
//         url: '/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Delivery Express - Tienda Online',
//       },
//     ],
//   },

//   // Twitter Card
//   twitter: {
//     card: 'summary_large_image',
//     site: '@deliveryexpress',
//     creator: '@deliveryexpress',
//     title: 'Delivery Express - Tu Tienda Online de Confianza',
//     description:
//       'Compra rápida y segura online con entrega express. Productos frescos y de calidad.',
//     images: ['/twitter-image.jpg'],
//   },

//   // Iconos y manifest
//   icons: {
//     icon: '/favicon.ico',
//     apple: '/apple-touch-icon.png',
//     other: [
//       { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0066ff' },
//     ],
//   },
//   manifest: '/manifest.json',

//   // Metadatos adicionales para SEO y rendimiento
//   metadataBase: new URL('https://delivery-express.com'),
//   alternates: {
//     canonical: 'https://delivery-express.com',
//     languages: {
//       'es-ES': 'https://delivery-express.com/es',
//       'en-US': 'https://delivery-express.com/en',
//     },
//   },

//   // Metadatos para verificación de sitios
//   verification: {
//     google: 'google-site-verification-code',
//     yandex: 'yandex-verification-code',
//     yahoo: 'yahoo-site-verification-code',
//     other: {
//       'facebook-domain-verification': 'facebook-verification-code',
//     },
//   },

//   // Metadatos para aplicaciones móviles
//   appleWebApp: {
//     capable: true,
//     title: 'Delivery Express',
//     statusBarStyle: 'black-translucent',
//   },

//   // Metadatos adicionales
//   category: 'e-commerce',
//   classification: 'shopping',
//   referrer: 'origin-when-cross-origin',
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ClerkProvider
//       publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
//     >
//       <html lang="es" suppressHydrationWarning>
//         <head>
//           {/* DNS Prefetch para recursos externos */}
//           <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />

//           {/* Structured Data para SEO */}
//           <script
//             type="application/ld+json"
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify({
//                 '@context': 'https://schema.org',
//                 '@type': 'Organization',
//                 name: 'Delivery Express',
//                 url: 'https://delivery-express.com',
//                 logo: 'https://delivery-express.com/logo.png',
//                 description:
//                   'Tienda online premium con productos exclusivos y de alta calidad',
//                 address: {
//                   '@type': 'PostalAddress',
//                   addressCountry: 'ES',
//                 },
//                 contactPoint: {
//                   '@type': 'ContactPoint',
//                   contactType: 'customer service',
//                   availableLanguage: 'Spanish',
//                 },
//                 sameAs: [
//                   'https://facebook.com/deliveryexpress',
//                   'https://twitter.com/deliveryexpress',
//                   'https://instagram.com/deliveryexpress',
//                 ],
//               }),
//             }}
//           />
//         </head>
//         <body className="min-h-screen relative bg-transparent antialiased font-sans">
//           <ClientProviders>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               <AnimatedBackground />
//               <NextTopLoader
//                 color="#2563eb"
//                 initialPosition={0.08}
//                 crawlSpeed={200}
//                 height={3}
//                 crawl={true}
//                 showSpinner={false}
//                 easing="ease"
//                 speed={200}
//                 shadow="0 0 10px #2563eb,0 0 5px #2563eb"
//               />
//               <ClientLayout>{children}</ClientLayout>
//               <Toaster
//                 position="bottom-right"
//                 richColors
//                 closeButton
//                 duration={4000}
//               />
//               <FooterConditional />
//             </ThemeProvider>
//           </ClientProviders>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }
// app/layout.tsx
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

// Configuración de viewport optimizada
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark light',
};

// Configuración de metadata mejorada
export const metadata: Metadata = {
  // Título y descripción basados en tu proyecto "mi-tienda"
  title: {
    default: 'Mi Tienda - Tu E-commerce de Confianza',
    template: '%s | Mi Tienda',
  },
  description:
    'Descubre los mejores productos en Mi Tienda. Calidad garantizada, envíos rápidos y atención personalizada. Tu experiencia de compra online comienza aquí.',

  // Metadatos básicos
  keywords: [
    'mi tienda',
    'ecommerce',
    'compras online',
    'productos de calidad',
    'envíos rápidos',
    'tienda online',
    'ofertas',
    'promociones',
  ],
  authors: [{ name: 'Mi Tienda Team' }],
  creator: 'Mi Tienda',
  publisher: 'Mi Tienda',

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

  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'Mi Tienda',
    title: 'Mi Tienda - Tu E-commerce de Confianza',
    description:
      'Descubre los mejores productos en Mi Tienda. Calidad garantizada y envíos rápidos.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mi Tienda - Tienda Online',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@mitienda',
    creator: '@mitienda',
    title: 'Mi Tienda - Tu E-commerce de Confianza',
    description:
      'Descubre los mejores productos en Mi Tienda. Calidad garantizada y envíos rápidos.',
    images: ['/twitter-image.jpg'],
  },

  // Iconos y manifest
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#2563eb' },
    ],
  },
  manifest: '/manifest.json',

  // Metadatos adicionales para SEO
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    languages: {
      'es-ES': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },

  // Metadatos para verificación de sitios
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
  },

  // Metadatos para aplicaciones móviles
  appleWebApp: {
    capable: true,
    title: 'Mi Tienda',
    statusBarStyle: 'black-translucent',
  },

  // Metadatos adicionales
  category: 'shopping',
  classification: 'ecommerce',
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
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90',
          card: 'shadow-lg',
        },
      }}
    >
      <html lang="es" suppressHydrationWarning className="scroll-smooth">
        <head>
          {/* DNS Prefetch para recursos externos */}
          <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
          <link rel="dns-prefetch" href="//images.unsplash.com" />

          {/* Preconnect para recursos críticos */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Structured Data para SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'OnlineStore',
                name: 'Mi Tienda',
                url:
                  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
                logo: `${
                  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
                }/logo.png`,
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
                  'https://facebook.com/mitienda',
                  'https://twitter.com/mitienda',
                  'https://instagram.com/mitienda',
                ],
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${
                    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
                  }/search?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
        </head>
        <body className="min-h-screen relative bg-background antialiased font-sans">
          <ClientProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="mitienda-theme"
            >
              <div className="relative min-h-screen">
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
                  zIndex={1600}
                />
                <div className="relative z-10">
                  <ClientLayout>{children}</ClientLayout>
                  <FooterConditional />
                </div>
                <Toaster
                  position="bottom-right"
                  richColors
                  closeButton
                  duration={4000}
                  visibleToasts={5}
                  expand
                  gap={12}
                />
              </div>
            </ThemeProvider>
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
