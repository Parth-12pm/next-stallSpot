import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]; // required to make Konva & react-konva work
    config.cache = false;
    return config;
  },
}

export default nextConfig;
