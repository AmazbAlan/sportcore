/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'sportcore-production.up.railway.app',
        pathname: '/uploads/**',
      },
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
    ],
  },

  typescript: { ignoreBuildErrors: true },
}

export default nextConfig