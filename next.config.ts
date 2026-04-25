import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents Turbopack from bundling @prisma/client — loads it natively via Node.js.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
