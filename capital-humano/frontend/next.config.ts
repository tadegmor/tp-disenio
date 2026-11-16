import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy hacia el backend Spring Boot: evita CORS y deja el front con rutas relativas (/api/...)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
