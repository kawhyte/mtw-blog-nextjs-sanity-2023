/** @type {import('next').NextConfig} */
const config = {
  //  staticPageGenerationTimeout: 140000,

  // Transpile ESM-only packages so webpack can handle their CJS/ESM interop correctly.
  // sanity-plugin-media: its ESM build does a named import from CJS react-dropzone,
  // which Node rejects when the package is externalized — bundling it through
  // webpack resolves the interop.
  transpilePackages: [
    '@heroicons/react',
    '@vercel/speed-insights',
    'sanity-plugin-media',
  ],

  // Enable the SWC compiler for styled-components (Fixes the Sanity Media Plugin error)
  compiler: {
    styledComponents: true,
  },

  images: {
    // Bypass Vercel's image optimization pipeline (Hobby plan: 1,000/month limit).
    // The custom loader builds each srcset width as a Sanity CDN URL, so resizing,
    // format negotiation (WebP/AVIF) and quality are all handled by Sanity — and
    // every `sizes` prop now actually picks the right width per device.
    // Non-Sanity images (local icons, YouTube thumbnails) use `unoptimized` per image.
    loader: 'custom',
    loaderFile: './lib/sanityImageLoader.ts',
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
      { hostname: 'fakeimg.pl' },
      { hostname: 'i.ytimg.com' },
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
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
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
