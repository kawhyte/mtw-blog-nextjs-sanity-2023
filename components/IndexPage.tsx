import Layout from 'components/BlogLayout'
import HomeAboutGear from 'components/home/HomeAboutGear'
import HomeFavourites from 'components/home/HomeFavourites'
import HomeHero from 'components/home/HomeHero'
import HomeQuickLinks, { type HomeCounts } from 'components/home/HomeQuickLinks'
import HomeVideos from 'components/home/HomeVideos'
import IndexPageHead from 'components/IndexPageHead'
import ListingCard, { monthFormatter } from 'components/listing/ListingCard'
import SwipeRow from 'components/listing/SwipeRow'
import type { FreshItem, HomeArena, HomeGear } from 'lib/homeData'
import type { ListingItem } from 'lib/reviewListing'
import type { Settings } from 'lib/sanity.queries'
import type { YoutubeVideo } from 'lib/youtube'
import Head from 'next/head'

import { CMS_NAME } from '../lib/constants'
import BlogHeader from './BlogHeader'
import Footer from './Footer'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  settings: Settings
  heroArenas?: HomeArena[]
  latestArenas?: HomeArena[]
  counts?: HomeCounts
  fresh?: FreshItem[]
  favouriteHotels?: ListingItem[]
  favouriteFood?: ListingItem[]
  gear?: HomeGear[]
  youtubeVideos?: YoutubeVideo[]
}

const NO_COUNTS: HomeCounts = {
  arenas: 0,
  hotels: 0,
  food: 0,
  guides: 0,
  gear: 0,
}

const FRESH: Record<FreshItem['kind'], { label: string; path: string }> = {
  hotel: { label: 'Hotel', path: '/hotel' },
  food: { label: 'Food', path: '/food' },
  guide: { label: 'Guide', path: '/guide' },
}

const month = (date: string | null) =>
  date ? monthFormatter.format(new Date(date)) : null

export default function IndexPage({
  preview,
  loading,
  settings,
  heroArenas = [],
  latestArenas = [],
  counts = NO_COUNTS,
  fresh = [],
  favouriteHotels = [],
  favouriteFood = [],
  gear = [],
  youtubeVideos = [],
}: IndexPageProps) {
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME}</title>
        </Head>

        <BlogHeader level={1} />
        <HomeHero arenas={heroArenas} />

        <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-4 py-7 md:gap-12 md:px-6 md:py-10">
          <HomeQuickLinks counts={counts} />

          {latestArenas.length > 0 && (
            <SwipeRow
              title="Latest arena visits"
              subtitle="Our newest reviews from the quest."
              linkLabel={`All ${counts.arenas} arenas`}
              shortLinkLabel={`All ${counts.arenas}`}
              linkHref="/arenas"
            >
              {latestArenas.map((arena) => (
                <ListingCard
                  key={arena._id}
                  item={arena}
                  href={`/arena/${arena.slug}`}
                  meta={[arena.location, month(arena.date)]
                    .filter(Boolean)
                    .join(' · ')}
                  showMonth={false}
                  inRow
                />
              ))}
            </SwipeRow>
          )}

          {fresh.length > 0 && (
            <SwipeRow
              id="fresh"
              title="Fresh from the road"
              subtitle="New hotel, food and guide posts."
            >
              {fresh.map(({ kind, item, readMinutes }) => (
                <ListingCard
                  key={item._id}
                  item={item}
                  href={`${FRESH[kind].path}/${item.slug}`}
                  meta={[FRESH[kind].label, item.location]
                    .filter(Boolean)
                    .join(' · ')}
                  detail={
                    kind === 'guide'
                      ? [`${readMinutes} min read`, month(item.date)]
                          .filter(Boolean)
                          .join(' · ')
                      : undefined
                  }
                  inRow
                />
              ))}
            </SwipeRow>
          )}

          <HomeFavourites hotels={favouriteHotels} food={favouriteFood} />

          <HomeAboutGear gear={gear} gearCount={counts.gear} />

          <HomeVideos
            videos={youtubeVideos}
            featuredVideo={settings?.featuredVideo}
          />
        </div>
      </Layout>
      <Footer />
    </>
  )
}
