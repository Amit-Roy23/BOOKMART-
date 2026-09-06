import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    ...(process.env.HOST_IP ? [process.env.HOST_IP] : []),
    'bookmart-web.gourabacharjee.website',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
