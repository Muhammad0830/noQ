import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.SUPABASE_HOSTNAME || "",
        pathname: process.env.SUPABASE_PATHNAME || "",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;