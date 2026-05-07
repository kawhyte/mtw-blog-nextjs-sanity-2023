// pages/search.tsx
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import DynamicPostCard from 'components/DynamicPostCard'
import Footer from 'components/Footer'
import NBAArenaCard from 'components/NBAArenaCard'
import calculateAverageRating from 'lib/calculateArenaRating'
import * as demo from 'lib/demo.data'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { CardSkeletonGrid } from '@/components/ui/card-skeleton'
import { PaginationWrapper as Pagination } from '@/components/ui/pagination-wrapper'

import { CMS_NAME } from '../lib/constants'
import { globalSearchQuery } from '../lib/sanity.queries'
import {
  Arena,
  FoodReview,
  Guide,
  HotelReview,
  Settings,
} from '../lib/sanity.queries'
import { sanityClient } from '../lib/sanity.server'
import { useDebounce } from '../hooks/useDebounce'

// Dynamically import Lottie Player for the "not found" animation
const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
)

// --- Reusable UI Components for this page ---

// NEW: A styled loading state with card skeletons to prevent UI shifting
const LoadingState = ({ searchQuery }: { searchQuery?: string | string[] }) => (
  <>
    {searchQuery && (
      <div className="w-full text-center bg-primary-soft-background rounded-2xl p-8 my-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-primary border-t-transparent"></div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
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

// NEW: A styled header for displaying the search query and result count
const ResultsHeader = ({ query, count }) => (
  <div className="w-full text-center bg-primary-soft-background rounded-2xl p-8 my-8">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
      Search results for{' '}
      <span className="text-primary">&quot;{query}&quot;</span>
    </h1>
    <p className="text-lg text-muted-foreground">
      {count} {count === 1 ? 'item' : 'items'} found 😉
    </p>
  </div>
)

// NEW: An improved "No Results" component with helpful suggestions
const NoResultsFound = ({ query }) => {
  const router = useRouter()
  const popularSearches = ['Hyatt', 'Review', 'Travel', 'Marriott']

  const handleSuggestionClick = (term) => {
    router.push(`/search?q=${term}`)
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
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
          {popularSearches.map((term) => (
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
  _contentType: string
}

const SearchResults = ({ settings }: { settings: Settings }) => {
  const router = useRouter()
  const { q: searchQuery } = router.query
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [activePage, setPage] = useState(1)
  const itemsPerPage = 9

  const { title = demo.title, description = demo.description } = settings || {}

  // Debounce the query so rapid URL changes (browser back/forward) don't fire
  // duplicate fetches. Loading spinner shows immediately via the effect below.
  const debouncedSearchQuery = useDebounce(router.query.q, 300)

  // Show loading state immediately on URL change — don't wait for debounce
  useEffect(() => {
    if (router.query.q) setLoading(true)
  }, [router.query.q])

  useEffect(() => {
    const currentSearchQuery = debouncedSearchQuery
    if (typeof currentSearchQuery === 'string' && currentSearchQuery.trim()) {
      let isCurrent = true
      setLoading(true)
      setError(null)
      setPage(1)
      sanityClient
        .fetch(globalSearchQuery, {
          searchTerm: `*${currentSearchQuery.trim()}*`,
        })
        .then((data) => {
          // Flatten the results from all content types into a single array
          const flattenedResults = [
            ...(data?.hotels || []),
            ...(data?.food || []),
            ...(data?.guides || []),
            ...(data?.arenas || []),
          ]

          // Sort by date (most recent first) to provide consistent ordering
          flattenedResults.sort((a, b) => {
            const dateA = new Date(a.date || a._updatedAt || 0)
            const dateB = new Date(b.date || b._updatedAt || 0)
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
        .finally(() => setLoading(false))

      return () => {
        isCurrent = false
      }
    } else {
      setResults([])
      setLoading(false)
      setError(null)
    }
  }, [debouncedSearchQuery])

  const totalPages = Math.ceil(results.length / itemsPerPage)
  const displayedResults = results.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage,
  )

  const renderContent = () => {
    if (loading) return <LoadingState searchQuery={searchQuery} />
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[50vh] text-destructive">
          Blast! Something went wrong: {error.message}
        </div>
      )
    }
    if (searchQuery && results.length > 0) {
      return (
        <>
          <ResultsHeader query={searchQuery} count={results.length} />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto max-w-8xl">
            {displayedResults.map((result) => {
              if (result._contentType === 'arena') {
                const arenaResult = result as Arena
                const { average, textRating, color } = calculateAverageRating(
                  arenaResult.arenaReview || {},
                )
                return (
                  <Link
                    key={arenaResult._id}
                    href={`/arena/${arenaResult.slug}`}
                    className="w-full flex justify-center"
                  >
                    <NBAArenaCard
                      arenaImageSrc={arenaResult.arenaImage}
                      arenaName={arenaResult.name ?? ''}
                      alt={`${arenaResult.name ?? 'Arena'} exterior`}
                      constructionDate={arenaResult.buildDate}
                      capacity={arenaResult.capacity}
                      location={arenaResult.location}
                      dateVisited={arenaResult.date}
                      visited={arenaResult.visited}
                      gallery={
                        arenaResult.firstGalleryImage
                          ? [arenaResult.firstGalleryImage]
                          : []
                      }
                      id={arenaResult._id}
                      averageRating={average}
                      textRating={textRating}
                      ratingColor={color}
                      priority={false}
                    />
                  </Link>
                )
              }

              const reviewResult = result as HotelReview | FoodReview | Guide
              return (
                <DynamicPostCard
                  key={result._id}
                  title={reviewResult.title}
                  coverImage={reviewResult.coverImage}
                  date={reviewResult.date}
                  author={'author' in reviewResult ? reviewResult.author : undefined}
                  slug={reviewResult.slug}
                  excerpt2={reviewResult.excerpt2}
                  location={'location' in reviewResult ? reviewResult.location : undefined}
                  category={'category' in reviewResult ? reviewResult.category : undefined}
                  linkType={result._contentType as any}
                  showRating={true}
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
                onChange={setPage}
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
        <h2 className="text-2xl text-foreground mb-4">Ready when you are!</h2>
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
            ? `Search Results for "${searchQuery}"`
            : `Search - ${CMS_NAME}`}
        </title>
      </Head>
      <BlogHeader title={title} description={description} level={1} />
      <Container>{renderContent()}</Container>
      <Footer />
    </Layout>
  )
}

export default SearchResults
