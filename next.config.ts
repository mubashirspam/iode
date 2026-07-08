import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
<<<<<<< HEAD
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
=======
    // University logos/banners are uploaded via the admin panel to ImageKit.
    remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
>>>>>>> feat/university-course-experience
  },
};

export default nextConfig;
