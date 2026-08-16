import type { NextConfig } from 'next';

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const PRIVATE_ROBOTS_HEADER = {
  key: 'X-Robots-Tag',
  value: 'noindex, nofollow, noarchive',
};

function imageKitHostname(): string {
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
  if (!endpoint) return 'ik.imagekit.io';

  try {
    return new URL(endpoint).hostname;
  } catch {
    return 'ik.imagekit.io';
  }
}

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: imageKitHostname(),
        pathname: '/**',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.majidsavarivakil.ir' }],
        destination: 'https://majidsavarivakil.ir/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    const privateRoutes = [
      '/admin/:path*',
      '/portal/:path*',
      '/account/:path*',
      '/login',
      '/signup',
      '/forgot-password',
      '/reset-password',
      '/client-login',
    ];

    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
      ...privateRoutes.map((source) => ({
        source,
        headers: [PRIVATE_ROBOTS_HEADER],
      })),
    ];
  },
};

export default nextConfig;
