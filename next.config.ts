import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['lib-qqwry', 'public-ip'],
};

export default nextConfig;
