// next.config.cjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para imágenes
  images: {
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
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
  },

  // Configuración para paquetes que solo deben ejecutarse en el servidor
  serverExternalPackages: ['@prisma/client'],

  // Configuración experimental para mejorar el rendimiento
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

// --- INICIO DE LA CONFIGURACIÓN PARA CLOUDFLARE ---
// Aplicamos el Edge Runtime a todas las rutas de forma global
const { setupPlatform } = require('@opennext/next/config');

module.exports = setupPlatform({
  ...nextConfig,
  // Esta es la clave: fuerza el runtime 'edge' para todas las rutas
  output: 'standalone',
  // Forzamos el runtime para que se aplique a todas las páginas y APIs
  experimental: {
    ...nextConfig.experimental,
    runtime: 'edge',
  },
});
