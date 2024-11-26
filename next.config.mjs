/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.boffinbutler.com',
        port: '', 
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'beta.boffinbutler.com',
        port: '', 
        pathname: '/**', 
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
 
};

export default nextConfig;
