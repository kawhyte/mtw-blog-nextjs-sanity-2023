/** @type {import('next').NextConfig} */
const config = {
  //  staticPageGenerationTimeout: 140000,

  // 1. ADDED: Tell Next.js we are using the experimental App Router
  experimental: {
    appDir: true,
  },

  // 2. ADDED: Enable the SWC compiler for styled-components (Fixes the Sanity Media Plugin error)
  compiler: {
    styledComponents: true,
  },

  images: {
    // Bypass Vercel's image optimization pipeline (Hobby plan: 1,000/month limit).
    // All resizing, format negotiation (WebP/AVIF), and quality is handled by Sanity CDN
    // via urlForImage() transformation params in lib/sanity.image.ts.
    unoptimized: true,
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
      { hostname: 'fakeimg.pl' },
    ],
  },

  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
  },
  eslint: {
    // Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === 'production',
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default config
