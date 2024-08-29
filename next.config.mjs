/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
