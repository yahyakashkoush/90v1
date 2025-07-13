/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost', 'via.placeholder.com'],
    unoptimized: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
  // Remove server rewrites for Vercel deployment
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/server/:path*',
  //       destination: 'http://localhost:5000/api/:path*',
  //     },
  //   ];
  // },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig;