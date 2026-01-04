import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
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

  turbopack: {

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
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;