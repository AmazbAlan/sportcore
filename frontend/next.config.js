const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    STRAPI_URL: process.env.STRAPI_URL,
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ разрешает билд при типовой ошибке
  },
}

export default nextConfig
