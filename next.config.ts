import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The libSQL client ships a native binding; keep it out of the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
