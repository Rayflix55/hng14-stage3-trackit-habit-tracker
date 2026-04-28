/** @type {import('next').NextConfig} */
const withPWAInit = require("@ducanh2912/next-pwa").default;

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true, // Better handling for Next.js navigation
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  // This helps resolve the "no-response" issue for dynamic routes
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  // Ensure your metadata/icons are handled
  images: {
    unoptimized: true, 
  }
};

module.exports = withPWA(nextConfig);