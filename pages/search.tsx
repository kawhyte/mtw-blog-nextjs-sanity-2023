// pages/search.tsx
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import DynamicPostCard from 'components/DynamicPostCard'
import Footer from 'components/Footer'
import NBAArenaCard from 'components/NBAArenaCard'
import * as demo from 'lib/demo.data'
import { getSettings } from 'lib/sanity.client'
import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { getArenaDisplayRating } from 'utils/arena/arenaUtils'

import { CardSkeletonGrid } from '@/components/ui/card-skeleton'
import { PaginationWrapper as Pagination } from '@/components/ui/pagination-wrapper'

import { useDebounce } from '../hooks/useDebounce'
import type { CardContentType } from '../lib/cardContentType'
import {
  globalSearchQuery,
  toSearchTerms,
  toSearchWords,
} from '../lib/sanity.queries'
import {
  Arena,
  FoodReview,
  Guide,
  HotelReview,
  Settings,
} from '../lib/sanity.queries'
import { sanityClient } from '../lib/sanity.server'

// Dynamically import Lottie Player for the "not found" animation
const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
)

const SITE_NAME = 'Meet the Whytes'
const ITEMS_PER_PAGE = 9

// Filter tabs. `type` matches each result's `_contentType` and the ?type= URL param.
const RESULT_TYPES = [
  { type: 'all', label: 'All' },
  { type: 'hotel', label: 'Hotels' },
  { type: 'food', label: 'Food' },
  { type: 'guide', label: 'Guides' },
  { type: 'arena', label: 'Arenas' },
] as const

type ResultType = (typeof RESULT_TYPES)[number]['type']

const isResultType = (value: unknown): value is ResultType =>
  RESULT_TYPES.some((tab) => tab.type === value)

// Searches known to return results — shown when a search finds nothing.
const POPULAR_SEARCHES = ['Las Vegas', 'Hyatt', 'Marriott', 'Chase Center']

// --- Reusable UI Components for this page ---

// A styled loading state with card skeletons to prevent UI shifting
const LoadingState = ({ searchQuery }: { searchQuery?: string }) => (
  <>
    {searchQuery && (
      <div className="w-full text-center bg-primary-soft-background rounded-2xl p-8 my-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-primary border-t-transparent"></div>
          <div>
            <h1 className="text-section md:text-page font-bold text-foreground mb-2">
              Searching for{' '}
              <span className="text-primary">&quot;{searchQuery}&quot;</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Looking through the archives...
            </p>
          </div>
        </div>
      </div>
    )}
    <CardSkeletonGrid count={9} layout="search" />
  </>
)

// A styled header for displaying the search query and result count
const ResultsHeader = ({ query, count }: { query: string; count: number }) => (
  <div className="w-full text-center bg-primary-soft-background rounded-2xl p-8 my-8">
    <h1 className="text-section md:text-page font-bold text-foreground mb-2">
      Search results for{' '}
      <span className="text-primary">&quot;{query}&quot;</span>
    </h1>
    <p className="text-lg text-muted-foreground">
      {count} {count === 1 ? 'item' : 'items'} found 😉
    </p>
  </div>
)

// Hotels / Food / Guides / Arenas tabs; types with no results are hidden
const ResultTypeTabs = ({
  activeType,
  counts,
  onChange,
}: {
  activeType: ResultType
  counts: Record<ResultType, number>
  onChange: (type: ResultType) => void
}) => (
  <div
    role="tablist"
    aria-label="Filter results by type"
    className="mb-6 flex flex-wrap justify-center gap-2"
  >
    {RESULT_TYPES.filter(
      ({ type }) => type === 'all' || counts[type] > 0,
    ).map(({ type, label }) => {
      const isActive = type === activeType
      return (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(type)}
          className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            isActive
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border-bold bg-card text-foreground hover:bg-accent'
          }`}
        >
          {label} <span className="opacity-70">({counts[type]})</span>
        </button>
      )
    })}
  </div>
)

// Shown instead of the raw error; details go to the console
const SearchError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
    <h1 className="text-title sm:text-section font-bold text-foreground mb-3">
      Search is having a moment
    </h1>
    <p className="text-lg text-muted-foreground max-w-md mb-6">
      We couldn&apos;t load results just now. Check your connection and try
      again.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="min-h-11 rounded-lg border-2 border-border-bold bg-primary px-5 py-2 font-semibold text-primary-foreground transition-colors duration-200 hover:opacity-90"
    >
      Try again
    </button>
  </div>
)

// An improved "No Results" component with helpful suggestions
const NoResultsFound = ({ query }: { query: string }) => {
  const router = useRouter()

  const handleSuggestionClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-10">
      <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] mx-auto mb-8">
        <PlayerWithNoSSR
          autoplay
          keepLastFrame
          loop
          src={'/confused-search.json'}
        />
      </div>
      <h1 className="text-section sm:text-page md:text-page font-bold text-foreground mb-4">
        No results for <span className="text-primary">&quot;{query}&quot;</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mx-auto">
        It seems your search is playing hide-and-seek. Try checking the spelling
        or using a different term.
      </p>
      <div className="mt-8">
        <p className="text-md font-semibold text-foreground mb-3">
          Popular searches:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => handleSuggestionClick(term)}
              className="px-4 py-2 rounded-lg bg-card border-2 border-border-bold hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main Search Results Page Component ---

// Union type for all content types that can appear in search results
type SearchResult = (HotelReview | FoodReview | Guide | Arena) & {
  _contentType: Exclude<ResultType, 'all'>
  _score?: number
}

const SearchResults = ({ settings }: { settings: Settings }) => {
  const router = useRouter()
  // /search is statically prerendered without a query, so read the URL only
  // after mount — otherwise the first client render disagrees with the server.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // The URL is the source of truth: ?q= search text, ?type= tab, ?page= page
  const urlQuery = mounted ? router.query : {}
  const searchQuery =
    typeof urlQuery.q === 'string' ? urlQuery.q : undefined
  const activeType: ResultType = isResultType(urlQuery.type)
    ? urlQuery.type
    : 'all'
  const requestedPage = Math.max(1, Number(urlQuery.page) || 1)

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const { title = demo.title, description = demo.description } = settings || {}

  // Words to highlight in card titles; memoised so memo'd cards don't re-render
  const highlightWords = useMemo(
    () => (searchQuery ? toSearchWords(searchQuery) : []),
    [searchQuery],
  )

  // Debounce the query so rapid URL changes (browser back/forward) don't fire
  // duplicate fetches. Loading spinner shows immediately via the effect below.
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Show loading state immediately on URL change — don't wait for debounce
  useEffect(() => {
    if (searchQuery) setLoading(true)
  }, [searchQuery])

  useEffect(() => {
    const currentSearchQuery = debouncedSearchQuery
    if (typeof currentSearchQuery === 'string' && currentSearchQuery.trim()) {
      let isCurrent = true
      setLoading(true)
      setError(null)
      const terms = toSearchTerms(currentSearchQuery)
      // Only punctuation typed: an empty $terms would match everything
      if (terms.length === 0) {
        setResults([])
        setLoading(false)
        return
      }
      sanityClient
        .fetch(globalSearchQuery, { terms })
        .then((data) => {
          // Flatten the results from all content types into a single array
          const flattenedResults: SearchResult[] = [
            ...(data?.hotels || []),
            ...(data?.food || []),
            ...(data?.guides || []),
            ...(data?.arenas || []),
          ]

          // Most relevant first; newest first among equally relevant results
          flattenedResults.sort((a, b) => {
            const byScore = (b._score ?? 0) - (a._score ?? 0)
            if (byScore !== 0) return byScore
            const dateA = new Date(a.date || (a as any)._updatedAt || 0)
            const dateB = new Date(b.date || (b as any)._updatedAt || 0)
            return dateB.getTime() - dateA.getTime()
          })

          if (isCurrent) setResults(flattenedResults)
        })
        .catch((err) => {
          if (isCurrent) {
            setError(err)
            setResults([])
          }
          console.error('Error fetching search results:', err)
        })
        .finally(() => {
          if (isCurrent) setLoading(false)
        })

      return () => {
        isCurrent = false
      }
    } else {
      setResults([])
      setLoading(false)
      setError(null)
    }
  }, [debouncedSearchQuery, retryCount])

  const countsByType = useMemo(() => {
    const counts: Record<ResultType, number> = {
      all: results.length,
      hotel: 0,
      food: 0,
      guide: 0,
      arena: 0,
    }
    results.forEach((result) => {
      counts[result._contentType] += 1
    })
    return counts
  }, [results])

  const filteredResults =
    activeType === 'all'
      ? results
      : results.filter((result) => result._contentType === activeType)
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
  const activePage = Math.min(requestedPage, Math.max(totalPages, 1))
  const displayedResults = filteredResults.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  )

  // Writes tab/page changes to the URL (shareable, back/forward-friendly)
  const updateUrl = (type: ResultType, page: number) => {
    router.push(
      {
        pathname: '/search',
        query: {
          q: searchQuery,
          ...(type !== 'all' && { type }),
          ...(page > 1 && { page }),
        },
      },
      undefined,
      { shallow: true, scroll: false },
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderContent = () => {
    if (loading) return <LoadingState searchQuery={searchQuery} />
    if (error) {
      return <SearchError onRetry={() => setRetryCount((n) => n + 1)} />
    }
    if (searchQuery && results.length > 0) {
      return (
        <>
          <ResultsHeader query={searchQuery} count={results.length} />
          <ResultTypeTabs
            activeType={activeType}
            counts={countsByType}
            onChange={(type) => updateUrl(type, 1)}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto max-w-8xl">
            {displayedResults.map((result) => {
              if (result._contentType === 'arena') {
                const arenaResult = result as Arena
                const { average, textRating, color } =
                  getArenaDisplayRating(arenaResult)
                return (
                  // NBAArenaCard has its own link — don't wrap it in another
                  <div
                    key={arenaResult._id}
                    className="w-full flex justify-center"
                  >
                    <NBAArenaCard
                      arenaImageSrc={arenaResult.arenaImage}
                      arenaName={arenaResult.name ?? ''}
                      alt={`${arenaResult.name ?? 'Arena'} exterior`}
                      constructionDate={arenaResult.buildDate ?? ''}
                      capacity={arenaResult.capacity ?? 0}
                      location={arenaResult.location ?? ''}
                      dateVisited={arenaResult.date ?? ''}
                      visited={arenaResult.visited ?? false}
                      slug={arenaResult.slug ?? ''}
                      id={arenaResult._id}
                      averageRating={average}
                      textRating={textRating}
                      ratingColor={color}
                      priority={false}
                      highlightWords={highlightWords}
                    />
                  </div>
                )
              }

              const reviewResult = result as HotelReview | FoodReview | Guide
              const isGuide = result._contentType === 'guide'
              return (
                <DynamicPostCard
                  key={result._id}
                  title={reviewResult.title}
                  coverImage={reviewResult.coverImage}
                  date={reviewResult.date}
                  author={
                    'author' in reviewResult ? reviewResult.author : undefined
                  }
                  slug={reviewResult.slug}
                  location={
                    'location' in reviewResult
                      ? reviewResult.location
                      : undefined
                  }
                  category={
                    'category' in reviewResult
                      ? reviewResult.category
                      : undefined
                  }
                  summary={
                    isGuide ? (reviewResult as Guide).summary : undefined
                  }
                  contentType={result._contentType as CardContentType}
                  showRating={!isGuide}
                  highlightWords={highlightWords}
                  hotelRating={
                    result._contentType === 'hotel'
                      ? (reviewResult as HotelReview).hotelRating
                      : undefined
                  }
                  foodRating={
                    result._contentType === 'food'
                      ? (reviewResult as FoodReview).foodRating
                      : undefined
                  }
                  takeoutRating={
                    result._contentType === 'food'
                      ? (reviewResult as FoodReview).takeoutRating
                      : undefined
                  }
                  diningType={
                    result._contentType === 'food'
                      ? (reviewResult as FoodReview).diningType
                      : undefined
                  }
                />
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="pb-6 pt-14">
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={(page) => updateUrl(activeType, page)}
                position="center"
                size="lg"
              />
            </div>
          )}
        </>
      )
    }
    if (searchQuery) {
      return <NoResultsFound query={searchQuery} />
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h2 className="text-title text-foreground mb-4">Ready when you are!</h2>
        <p className="text-lg text-muted-foreground">
          Pop a search term into the bar above to begin your adventure.
        </p>
      </div>
    )
  }

  return (
    <Layout preview={false} loading={loading}>
      <Head>
        <title>
          {searchQuery
            ? `Search: "${searchQuery.slice(0, 60)}" | ${SITE_NAME}`
            : `Search | ${SITE_NAME}`}
        </title>
        {/* Result pages are thin, endless variants — keep them out of Google */}
        <meta name="robots" content="noindex, follow" />
      </Head>
      <BlogHeader title={title} description={description} level={1} />
      <Container>{renderContent()}</Container>
      <Footer />
    </Layout>
  )
}

export default SearchResults

export const getStaticProps: GetStaticProps<{ settings: Settings }> = async () => ({
  props: { settings: await getSettings() },
  revalidate: 60,
})
