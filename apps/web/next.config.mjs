/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@braves-journal/ui', '@braves-journal/shared'],
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
