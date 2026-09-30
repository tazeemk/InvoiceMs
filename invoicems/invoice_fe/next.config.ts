import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  async redirects() {
    return [
      { source: "/orders/pending", destination: "/orders/created", permanent: false },
      { source: "/orders/accepted", destination: "/orders/in-progress", permanent: false },
      { source: "/orders/shipped", destination: "/orders/completed", permanent: false },
      { source: "/orders/delivered", destination: "/orders/completed", permanent: false },
      { source: "/orders/failed", destination: "/orders/rejected", permanent: false },
      { source: "/orders/returned", destination: "/orders/all", permanent: false },
      { source: "/orders/on-hold", destination: "/orders/all", permanent: false },
    ];
  },
};

export default nextConfig;
