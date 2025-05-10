/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@vercel/postgres']
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression
  compress: true
}

module.exports = nextConfig 