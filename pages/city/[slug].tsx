import CityPage from 'components/CityPage'
import { primaryCityLocation } from 'lib/cityMatch'
import {
  getAllArenaLocations,
  getCityPageData,
  getSettings,
} from 'lib/sanity.client'
import type { CityPageData, Settings } from 'lib/sanity.queries'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { locationToSlug } from 'utils/locationSlug'

interface PageProps {
  location: string
  data: CityPageData
  settings: Settings
}

export default function CitySlugPage({ location, data, settings }: PageProps) {
  return <CityPage location={location} data={data} settings={settings} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const locations = await getAllArenaLocations()
  // One page per city: alias locations (Paradise, Inglewood…) redirect
  const primaries = new Set(
    locations.map((loc) => primaryCityLocation(loc, locations)),
  )
  return {
    paths: [...primaries].map((loc) => ({
      params: { slug: locationToSlug(loc) },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string

  // Resolve slug → canonical location string
  const locations = await getAllArenaLocations()
  const location = locations.find((loc) => locationToSlug(loc) === slug)

  if (!location) {
    return { notFound: true }
  }

  // e.g. /city/paradise-nv → /city/las-vegas-nv (T-Mobile and Michelob Ultra
  // share the Las Vegas page)
  const primary = primaryCityLocation(location, locations)
  if (locationToSlug(primary) !== slug) {
    return {
      redirect: {
        destination: `/city/${locationToSlug(primary)}`,
        permanent: true,
      },
      revalidate: 60,
    }
  }

  const [data, settings] = await Promise.all([
    getCityPageData(primary, locations),
    getSettings(),
  ])

  return {
    props: { location: primary, data, settings },
    revalidate: 60,
  }
}
