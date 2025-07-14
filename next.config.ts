import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {
        source: '/.well-known/widget.json',
        destination: '/api/widget',
      },
    ]
  },
};

export default nextConfig;
