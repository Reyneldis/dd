/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
    formats: ['image/webp', 'image/avif'],
    // Aumentar el tamaño máximo de imagen permitido
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Habilitar la optimización de imágenes para dispositivos con poca memoria
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Deshabilitar la optimización para imágenes de Clerk temporalmente (para pruebas)
    unoptimized: false,
  },
  // Configuración para paquetes externos
  serverExternalPackages: ['@prisma/client'],
  // Configuración experimental para mejorar el rendimiento
  experimental: {
    // Habilitar la compilación optimizada
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
