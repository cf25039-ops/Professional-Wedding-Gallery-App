/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["", ""].filter(Boolean)
  }
};

module.exports = nextConfig;
