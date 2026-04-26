import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't walk up to a stray
  // package-lock.json in the user's home directory.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
