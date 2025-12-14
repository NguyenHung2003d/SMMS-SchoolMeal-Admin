import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://outragedly-guidebookish-mitzie.ngrok-free.dev/api/:path*",
      },
    ];
  },
};

export default nextConfig;
