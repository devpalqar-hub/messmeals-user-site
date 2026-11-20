/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Mess logos, covers and gallery photos are served from S3.
    remotePatterns: [{ protocol: "https", hostname: "**.amazonaws.com" }],
  }
};

export default nextConfig;
