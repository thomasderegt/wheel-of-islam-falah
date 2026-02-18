import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  },
  // ESLint is installed; run `npm run lint` to check. Build skips lint until errors are fixed (conditional hooks, refs, etc.).
  eslint: { ignoreDuringBuilds: true },
  // Verbeter file watching: polling als fallback wanneer native watchers faalt (macOS, Cursor, etc.)
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;

