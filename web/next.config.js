/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables for the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
    NEXT_PUBLIC_APP_NAME: 'Brush&Coin',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // API routes for server-side operations
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to backend API
      },
    ]
  },

  // Image optimization
  images: {
    domains: ['localhost', 'api.brushandcoin.com'],
    unoptimized: true, // For static exports if needed
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Output configuration for deployment
  output: 'standalone', // For Docker deployment
  // output: 'export', // For static export (uncomment if needed)
  // trailingSlash: true, // For static export (uncomment if needed)
}

module.exports = nextConfig