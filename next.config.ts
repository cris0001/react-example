import type { NextConfig } from "next"


const nextConfig: NextConfig = {
  reactStrictMode: false,

  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${process.env.API_URL}:path*`,

      },
    ]
  },
}

export default nextConfig
