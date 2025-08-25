/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Your Express backend
      },
    ];
  },

  // Optional: Disable React strict mode if causing double renders in dev
  reactStrictMode: false,
};

export default nextConfig;