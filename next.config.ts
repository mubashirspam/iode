import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // University logos/banners are uploaded via the admin panel to ImageKit.
    remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
  },
};

export default nextConfig;
