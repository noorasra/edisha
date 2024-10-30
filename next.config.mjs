/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Keep this setting if you want strict mode
  images: {
    domains: ['firebasestorage.googleapis.com'], // Add the Firebase storage domain
  },
};

export default nextConfig;
