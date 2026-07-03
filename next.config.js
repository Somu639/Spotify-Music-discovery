/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos"],
  },
  async redirects() {
    return [
      { source: "/index", destination: "/", permanent: false },
      { source: "/spotify-ai-discovery", destination: "/", permanent: false },
      { source: "/spotify-ai-discovery/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

module.exports = nextConfig;
