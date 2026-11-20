/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Mess logos, covers and gallery photos are served from S3.
    remotePatterns: [{ protocol: "https", hostname: "**.amazonaws.com" }],
  },
  async redirects() {
    return [
      // Listing page moved: /messes -> /mess (query string is preserved)
      { source: "/messes", destination: "/mess", permanent: true },
      // City pages moved: /messes/<city> -> /kerala/<city>
      {
        source: "/messes/:city(ernakulam|kasaragod|kozhikode|thiruvananthapuram|thrissur)",
        destination: "/kerala/:city",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
