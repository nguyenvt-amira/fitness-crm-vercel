import type { NextConfig } from 'next';

const IMAGE_DOMAINS = process.env.NEXT_PUBLIC_IMAGE_DOMAINS;

const nextConfig: NextConfig = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns:
      IMAGE_DOMAINS?.split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((domain) => ({
          protocol: 'https' as const,
          hostname: domain,
        })) ?? [],
  },
};

export default nextConfig;
