// pages/sitemap.xml.tsx
import { GetServerSideProps } from 'next'

import {
  getAllFoodReviews,
  getAllGuides,
  getAllHotelReviews,
  getArenaPosts,
} from '../lib/sanity.client'

// Generate sitemap XML
function generateSiteMap(
  hotels: any[],
  foods: any[],
  guides: any[],
  arenas: any[],
): string {
  const baseUrl = 'https://www.meetthewhytes.com'

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages - High Priority -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- NBA/WNBA Arena Pages - High Priority for your niche -->
  <url>
    <loc>${baseUrl}/arenas</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Category Pages -->
  <url>
    <loc>${baseUrl}/hotels</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/food</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Search Page -->
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Individual Arena Reviews - High Priority -->
  ${arenas
    .map(
      (arena) => `
  <url>
    <loc>${baseUrl}/arena/${arena.slug}</loc>
    <lastmod>${arena.date || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`,
    )
    .join('')}

  <!-- Individual Hotel Reviews -->
  ${hotels
    .map(
      (hotel) => `
  <url>
    <loc>${baseUrl}/hotel/${hotel.slug}</loc>
    <lastmod>${hotel.date || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join('')}

  <!-- Individual Food Reviews -->
  ${foods
    .map(
      (food) => `
  <url>
    <loc>${baseUrl}/food/${food.slug}</loc>
    <lastmod>${food.date || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join('')}

  <!-- Individual Guides -->
  ${guides
    .map(
      (guide) => `
  <url>
    <loc>${baseUrl}/guide/${guide.slug}</loc>
    <lastmod>${guide.date || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join('')}
</urlset>`
}

// This function runs on every request
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Fetch all content from Sanity
    const [hotels, foods, guides, arenas] = await Promise.all([
      getAllHotelReviews() || [],
      getAllFoodReviews() || [],
      getAllGuides() || [],
      getArenaPosts() || [],
    ])

    // Generate the XML sitemap
    const sitemap = generateSiteMap(
      hotels.map((h) => ({
        slug: h.slug?.current || h.slug,
        date: h.date || h._createdAt,
      })),
      foods.map((f) => ({
        slug: f.slug?.current || f.slug,
        date: f.date || f._createdAt,
      })),
      guides.map((g) => ({
        slug: g.slug?.current || g.slug,
        date: g.date || g._createdAt,
      })),
      arenas.map((a) => ({
        slug: a.slug?.current || a.slug,
        date: a.date || a._createdAt,
      })),
    )

    res.setHeader('Content-Type', 'text/xml')
    // Cache for 1 hour
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    )
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.statusCode = 500
    res.end()
    return {
      props: {},
    }
  }
}

// Default export to prevent Next.js errors
export default function SitemapXml() {
  // This component will never be rendered as we handle everything in getServerSideProps
  return null
}
