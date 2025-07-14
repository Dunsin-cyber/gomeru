import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://yakihonne.com', // Whitelisted domain
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
