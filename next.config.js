/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para imágenes
  images: {
    // 'remotePatterns' es el método moderno y seguro para permitir dominios externos.
    // 'domains' está obsoleto y se ha eliminado.
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
      // Añadido soporte para localhost en desarrollo
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Formatos de imagen modernos para mejor compresión y calidad
    formats: ['image/webp', 'image/avif'],
    // Tamaños de imagen para diferentes dispositivos (móvil, tablet, desktop, etc.)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Tamaños para srcset cuando se usan importaciones directas
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Tiempo de vida caché para imágenes optimizadas (30 días en este caso)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Permitir el renderizado de SVGs si es necesario (útil para iconos dinámicos)
    dangerouslyAllowSVG: true,
  },

  // Configuración para paquetes que solo deben ejecutarse en el servidor
  serverExternalPackages: ['@prisma/client'],

  // Configuración experimental para mejorar el rendimiento
  experimental: {
    // Optimiza la importación de paquetes como 'lucide-react' para reducir el tamaño del bundle
    // Solo incluirá los iconos que realmente usas.
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    runtime: 'edge',
  },
};

export default nextConfig;
