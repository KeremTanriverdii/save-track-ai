import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '**'
      }
    ]
  },
  serverExternalPackages: ['firebase-admin', '@google-cloud/storage'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
        dns: false,
        perf_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
