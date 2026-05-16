/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  env: {
    ML_API_URL: process.env.ML_API_URL || "http://127.0.0.1:8000",
  },
};

export default nextConfig;
