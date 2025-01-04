// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config: { externals: unknown[]; }) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
  // Add this to handle Konva's SSR issues
  experimental: {
    esmExternals: 'loose', // required to make Konva & react-konva work
  },
};

export default nextConfig;