import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tudominio.com',
      },
      {
        protocol: 'https',
        hostname: 'otro.com',
      },
    ],
  },
  /* config options here */

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
