/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para imágenes
  images: {
    // Usamos 'remotePatterns' que es la forma moderna y más flexible
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        port: '',
        pathname: '/**',
      },
      // <-- ¡AQUÍ ESTÁ LA MAGIA! El patrón para Vercel Blob
      {
        protocol: 'https',
        hostname: '3urcrfdkc6hfnjsv.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: true,
  },

  // Configuración para paquetes que solo deben ejecutarse en el servidor
  serverExternalPackages: ['@prisma/client'],

  // Configuración experimental para mejorar el rendimiento
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // runtime: 'experimental-edge', // Desactivado para Vercel (Node.js)
  },

  // Optimizaciones adicionales
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Configuración de caché para imágenes estáticas
  async headers() {
    return [
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
