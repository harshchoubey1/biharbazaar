import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native modules out of the webpack bundle.
  // On Vercel, libsql is used instead; on local dev, Node.js loads them directly.
  serverExternalPackages: [
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
  ],
};

export default nextConfig;
