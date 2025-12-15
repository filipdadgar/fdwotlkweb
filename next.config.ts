import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.BACKEND_URL || 'http://localhost:5277') + '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
