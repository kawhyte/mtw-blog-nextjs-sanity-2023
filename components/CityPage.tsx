import Layout from 'components/BlogLayout'
import BlogHeader from 'components/BlogHeader'
import BreadcrumbStructuredData from 'components/BreadcrumbStructuredData'
import SanityImage from 'components/SanityImage'
import SectionTitle from 'components/SectionTitle'
import BlogMeta from 'components/BlogMeta'
import type { CityPageData, Settings } from 'lib/sanity.queries'
import { MapPin, Utensils, Bed, BookOpen, Trophy } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

interface CityPageProps {
  location: string
  data: CityPageData
  settings: Settings
}

function ContentCard({
  title,
  slug,
  href,
  coverImage,
  subtitle,
  badge,
}: {
  title: string
  slug: string
  href: string
  coverImage?: any
  subtitle?: string
  badge?: string
}) {
  const hasImage = coverImage?.asset?._ref || coverImage?.asset?._id
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-2xl border-2 border-border bg-card p-3 shadow-brutalist-sm transition-all hover:scale-[1.01]"
    >
      {hasImage && (
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
          <SanityImage
            image={coverImage}
            width={160}
            height={128}
            alt={title}
            className="h-full w-full object-cover"
            sizes="80px"
            loading="lazy"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {badge && (
          <span className="mb-1 inline-flex rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
            {badge}
          </span>
        )}
        <p className="line-clamp-2 text-sm font-bold text-foreground group-hover:underline decoration-primary decoration-dashed">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function CityPage({ location, data, settings }: CityPageProps) {
  const { title: siteTitle = 'Meet the Whytes' } = settings || {}
  const cityName = location.split(',')[0].trim()
  const pageTitle = `${location} NBA Game Day Guide — Arena, Hotels & Food | Meet the Whytes`
  const pageDescription = `Your complete guide to visiting ${location} for an NBA or WNBA game. Arena tips, where we stayed, where we ate, and travel guides — all from real basketball fans.`
  const pageUrl = `${SITE_URL}/city/${encodeURIComponent(location.toLowerCase().replace(/,\s*/g, '-').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`

  const hasArena = data.arenas.length > 0
  const hasHotels = data.hotels.length > 0
  const hasFood = data.food.length > 0
  const hasGuides = data.guides.length > 0
  const visitedArena = data.arenas.find((a) => a.visited)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    about: {
      '@type': 'City',
      name: cityName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Meet the Whytes',
      url: SITE_URL,
    },
  }

  return (
    <>
      <Head>
        <BlogMeta />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@meetthewhytes" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Cities', url: '/arenas' },
          { name: location, url: pageUrl },
        ]}
      />

      <Layout preview={false}>
        <BlogHeader title={siteTitle} level={2} />

        <article className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
          {/* Breadcrumb nav */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/arenas" className="hover:text-foreground transition-colors">Arenas</Link>
            <span>/</span>
            <span className="text-foreground">{location}</span>
          </nav>

          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="text-sm">{location}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {cityName} NBA Game Day Guide
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Everything you need for your {cityName} basketball trip — arena tips, hotels we&apos;ve stayed in, food we&apos;ve tried, and travel guides from real NBA fans.
            </p>
          </div>

          {/* ARENA SECTION */}
          {hasArena && (
            <section className="mb-12">
              <SectionTitle
                header={visitedArena ? 'The Arena' : 'The Arena (On Our List)'}
              />
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.arenas.map((arena) => (
                  <Link
                    key={arena._id}
                    href={`/arena/${arena.slug}`}
                    className="group relative block overflow-hidden rounded-3xl border-4 border-black bg-card shadow-offsetIndigo transition-all hover:scale-105 hover:-translate-y-1"
                  >
                    {arena.arenaImage?.asset?._ref && (
                      <SanityImage
                        image={arena.arenaImage}
                        width={600}
                        height={280}
                        alt={arena.name || 'Arena'}
                        className="h-48 w-full object-cover brightness-[0.85]"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        loading="eager"
                      />
                    )}
                    <div className="p-4">
                      {!arena.visited && (
                        <span className="mb-2 inline-flex rounded-full border border-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          On Our Bucket List
                        </span>
                      )}
                      {arena.visited && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                          <Trophy className="h-3 w-3" /> Visited
                        </span>
                      )}
                      <h2 className="text-lg font-bold group-hover:underline decoration-primary decoration-dashed">
                        {arena.name}
                      </h2>
                      {arena.excerpt && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {arena.excerpt}
                        </p>
                      )}
                      <span className="mt-3 block text-sm font-semibold text-primary">
                        {arena.visited ? 'Read our review →' : 'See what we know →'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* HOTELS SECTION */}
          {hasHotels && (
            <section className="mb-12">
              <SectionTitle header="Where We Stayed" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.hotels.map((hotel) => (
                  <ContentCard
                    key={hotel._id}
                    title={hotel.title || ''}
                    slug={hotel.slug || ''}
                    href={`/hotel/${hotel.slug}`}
                    coverImage={hotel.coverImage}
                    subtitle={hotel.seoExcerpt}
                    badge={hotel.category || 'Hotel'}
                  />
                ))}
              </div>
              <Link
                href="/hotels"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                See all hotel reviews →
              </Link>
            </section>
          )}

          {/* FOOD SECTION */}
          {hasFood && (
            <section className="mb-12">
              <SectionTitle header="Where We Ate" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.food.map((review) => (
                  <ContentCard
                    key={review._id}
                    title={review.title || ''}
                    slug={review.slug || ''}
                    href={`/food/${review.slug}`}
                    coverImage={review.coverImage}
                    subtitle={review.seoExcerpt}
                    badge={review.diningType === 'takeout' ? 'Takeout' : 'Dine-in'}
                  />
                ))}
              </div>
              <Link
                href="/food"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                See all food reviews →
              </Link>
            </section>
          )}

          {/* GUIDES SECTION */}
          {hasGuides && (
            <section className="mb-12">
              <SectionTitle header="Travel Guides" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.guides.map((guide) => (
                  <ContentCard
                    key={guide._id}
                    title={guide.title || ''}
                    slug={guide.slug || ''}
                    href={`/guide/${guide.slug}`}
                    coverImage={guide.coverImage}
                    subtitle={guide.summary}
                    badge="Guide"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!hasHotels && !hasFood && !hasGuides && (
            <p className="text-muted-foreground">
              More {cityName} content coming soon — follow along as we add hotel reviews, food guides, and more.
            </p>
          )}
        </article>
      </Layout>
    </>
  )
}
