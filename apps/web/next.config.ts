import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);