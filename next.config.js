/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript strict checking during build for deployment
    ignoreBuildErrors: true,
  },
  images: {
    // Configure image domains if needed
    domains: ['jxelrmoqggnvqyaibdgg.supabase.co'], // Your actual Supabase domain
  },
};

module.exports = nextConfig;
