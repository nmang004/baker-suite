/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@baker-suite/ui', '@baker-suite/types', '@baker-suite/utils'],
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/flavor-pairing',
        destination: '/discover/pairings',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
