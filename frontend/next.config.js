// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Cloudinary (твои картинки товаров/цветов)
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },

      // Strapi uploads (если вдруг отдаёшь не через Cloudinary)
      { protocol: 'https', hostname: 'sportcore-production.up.railway.app', pathname: '/uploads/**' },

      // Local Strapi uploads
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
    ],
  },

  // Лучше временно не игнорировать ошибки на проде, но оставляю как у тебя
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig