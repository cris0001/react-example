import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.output.globalObject = 'self';
    return config;
  },
}

export default nextConfig