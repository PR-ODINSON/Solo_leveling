/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure static optimization
  output: 'standalone',
  
  // Optimize images for static deployment
  images: {
    unoptimized: true,
  },
  
  // Ensure proper trailing slash handling
  trailingSlash: false,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 