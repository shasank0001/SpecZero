export function generateNextConfig(): string {
  return `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images from external sources if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
  },
};

export default nextConfig;
`;
}
