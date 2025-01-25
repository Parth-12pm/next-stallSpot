import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  webpack: (config: Configuration) => {
    // Add memory limit
    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000,
      maxEntrypointSize: 1000000,
    };
    config.externals = [...(Array.isArray(config.externals) ? config.externals : []), { canvas: 'canvas' }]; // required to make Konva & react-konva work
    config.cache = false;
    return config;
  },
  
};

export default nextConfig;