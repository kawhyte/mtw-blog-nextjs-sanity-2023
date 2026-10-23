import ErrorPage from 'components/ErrorPage'
import SearchField from 'components/search/SearchField'
import type { SectionCounts } from 'components/search/SearchSuggestions'
import { getSearchSectionCounts } from 'lib/sanity.client'
import type { GetStaticProps } from 'next'
import Link from 'next/link'

export default function Custom404({ counts }: { counts: SectionCounts }) {
  return (
    <ErrorPage
      label="404 · PAGE NOT FOUND"
      title="Page Not Found"
      headline="This page took a wrong turn at the arena."
      text="The page you're looking for doesn't exist or may have moved. Search for it, or pick a section below."
      counts={counts}
      after={
        <Link
          href="/"
          className="w-fit text-[15px] font-extrabold text-pink-700 hover:underline"
        >
          Back to the homepage &rarr;
        </Link>
      }
    >
      <SearchField query="" />
    </ErrorPage>
  )
}

export const getStaticProps: GetStaticProps<{ counts: SectionCounts }> = async () => ({
  props: { counts: await getSearchSectionCounts() },
  revalidate: 3600,
})
