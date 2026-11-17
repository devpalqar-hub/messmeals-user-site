/** @type {import('next').NextConfig} */
const nextConfig = {
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
