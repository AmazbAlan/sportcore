// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'sportcore-production.up.railway.app', pathname: '/uploads/**' },
      { protocol: 'http',  hostname: 'localhost', port: '1337', pathname: '/uploads/**' }, // для локалки
    ],
    // временный обход, если нужно проверить без оптимизатора:
    // unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
