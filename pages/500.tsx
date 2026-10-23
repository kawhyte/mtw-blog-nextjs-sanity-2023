import ErrorPage from 'components/ErrorPage'
import type { SectionCounts } from 'components/search/SearchSuggestions'
import { getSearchSectionCounts } from 'lib/sanity.client'
import type { GetStaticProps } from 'next'
import Link from 'next/link'

const button =
  'inline-flex h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full border-[3px] border-border-bold px-[22px] text-base font-extrabold transition-colors sm:flex-none'

export default function Custom500({ counts }: { counts: SectionCounts }) {
  return (
    <ErrorPage
      label="500 · SOMETHING WENT WRONG"
      title="Something Went Wrong"
      headline="Well, that was an airball."
      text="Something went wrong on our end. Try again in a minute; the rest of the site should still work."
      counts={counts}
      // Search may be what broke, so only plain links here
      popular={false}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`${button} bg-primary text-white hover:bg-pink-700`}
        >
          Try again
        </button>
        <Link href="/" className={`${button} bg-card text-foreground hover:bg-muted`}>
          Homepage
        </Link>
      </div>
    </ErrorPage>
  )
}

// Counts come from build time, so this page never waits on Sanity
export const getStaticProps: GetStaticProps<{ counts: SectionCounts }> = async () => ({
  props: { counts: await getSearchSectionCounts() },
})
