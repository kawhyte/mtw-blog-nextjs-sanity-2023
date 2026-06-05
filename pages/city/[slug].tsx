import CityPage from 'components/CityPage'
import { getAllArenaLocations, getCityPageData, getSettings } from 'lib/sanity.client'
import type { CityPageData, Settings } from 'lib/sanity.queries'
import { locationToSlug } from 'utils/locationSlug'
import type { GetStaticPaths, GetStaticProps } from 'next'

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
  return {
    paths: locations.map((loc) => ({ params: { slug: locationToSlug(loc) } })),
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

  const [data, settings] = await Promise.all([
    getCityPageData(location),
    getSettings(),
  ])

  return {
    props: { location, data, settings },
    revalidate: 60,
  }
}
