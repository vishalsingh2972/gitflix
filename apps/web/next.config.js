/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // proxy API
      },
      {
        source: '/videos/:path*',
        destination: 'http://localhost:3001/videos/:path*', // proxy videos
      },
    ];
  },

  reactStrictMode: false,
};

export default nextConfig;