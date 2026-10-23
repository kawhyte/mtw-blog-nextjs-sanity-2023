// pages/search.tsx
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import SearchField from 'components/search/SearchField'
import SearchResultItem from 'components/search/SearchResultItem'
import SearchSuggestions, {
  type SectionCounts,
} from 'components/search/SearchSuggestions'
import * as demo from 'lib/demo.data'
import { getSearchSectionCounts, getSettings } from 'lib/sanity.client'
import {
  type RawSearchResult,
  SEARCH_GROUPS,
  type SearchKind,
  toSearchItem,
} from 'lib/searchResults'
import { SearchX } from 'lucide-react'
import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { PaginationWrapper as Pagination } from '@/components/ui/pagination-wrapper'
import { Skeleton } from '@/components/ui/skeleton'

import { useDebounce } from '../hooks/useDebounce'
import {
  globalSearchQuery,
  Settings,
  toSearchTerms,
  toSearchWords,
} from '../lib/sanity.queries'
import { sanityClient } from '../lib/sanity.server'

const SITE_NAME = 'Meet the Whytes'
// 4 across on laptops, so a full page is 3 rows
const ITEMS_PER_PAGE = 12
// How many of each type the "All" tab shows before "See all"
const GROUP_PREVIEW = 4

type ResultType = 'all' | SearchKind

const isResultType = (value: unknown): value is ResultType =>
  value === 'all' || SEARCH_GROUPS.some((group) => group.kind === value)

// --- Pieces of the page ---

/** Linen band at the top: optional title, the search box, then whatever goes under it */
function SearchTop({
  query,
  title,
  autoFocus = false,
  children,
}: {
  query: string
  title?: React.ReactNode
  autoFocus?: boolean
  children?: React.ReactNode
}) {
  return (
    <section className="bg-primary-soft-background">
      <div className="container mx-auto flex max-w-7xl flex-col gap-3.5 px-4 pb-5 pt-5 md:gap-4 md:px-6 md:pb-6 md:pt-8">
        {title}
        <SearchField query={query} autoFocus={autoFocus} />
        {children}
      </div>
    </section>
  )
}

/** "15 results for “las vegas”", the page heading once results are in */
const CountLine = ({ count, noun, query }: { count: number; noun: string; query: string }) => (
  <h1 className="text-base font-semibold text-muted-foreground md:text-lg">
    <span className="font-bold text-foreground">
      {count} {noun}
    </span>{' '}
    for &ldquo;{query}&rdquo;
  </h1>
)

/** All / Arenas / Hotels / Food / Guides, with counts; types with no results are left out */
function TypeChips({
  activeType,
  counts,
  onChange,
}: {
  activeType: ResultType
  counts: Record<ResultType, number>
  onChange: (type: ResultType) => void
}) {
  const chips = [
    { type: 'all' as ResultType, label: 'All' },
    ...SEARCH_GROUPS.filter((group) => counts[group.kind] > 0).map(
      (group) => ({ type: group.kind as ResultType, label: group.label }),
    ),
  ]
  return (
    <div
      role="tablist"
      aria-label="Filter results by type"
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
    >
      {chips.map(({ type, label }) => {
        const active = type === activeType
        return (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(type)}
            className={`min-h-10 shrink-0 whitespace-nowrap rounded-full border-2 px-4 text-sm font-bold transition-colors ${
              active
                ? 'border-border-bold bg-foreground text-background'
                : 'border-border bg-card text-foreground hover:border-stone-300'
            }`}
          >
            {label}{' '}
            <span className="font-semibold opacity-60">{counts[type]}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Phones: one column of rows. Tablets and up: a 4-across grid of cards */
const resultGrid = 'flex flex-col md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-8'

const LoadingResults = () => (
  <div className={`${resultGrid} container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8`}>
    {Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="flex items-center gap-3.5 py-2.5 md:flex-col md:items-stretch md:py-0"
      >
        <Skeleton className="h-[76px] w-[76px] shrink-0 rounded-[14px] md:aspect-square md:h-auto md:w-full md:rounded-2xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

// Shown instead of the raw error; details go to the console
const SearchError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="container mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-10 md:px-6">
    <h1 className="text-title font-bold text-foreground">
      Search is having a moment
    </h1>
    <p className="max-w-md text-base text-muted-foreground">
      We couldn&apos;t load results just now. Check your connection and try
      again.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="min-h-11 rounded-full border-[3px] border-border-bold bg-primary px-5 font-extrabold text-white transition-colors hover:bg-pink-700"
    >
      Try again
    </button>
  </div>
)

// --- The page ---

interface SearchPageProps {
  settings: Settings
  counts: SectionCounts
}

const SearchResults = ({ settings, counts }: SearchPageProps) => {
  const router = useRouter()
  // /search is statically prerendered without a query, so read the URL only
  // after mount, otherwise the first client render disagrees with the server.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // The URL is the source of truth: ?q= search text, ?type= tab, ?page= page
  // Also wait for the router to have read ?q= (not ready on the first client
  // render), or the empty page would flash and grab focus
  const ready = mounted && router.isReady
  const urlQuery = ready ? router.query : {}
  const searchQuery =
    typeof urlQuery.q === 'string' ? urlQuery.q : undefined
  const activeType: ResultType = isResultType(urlQuery.type)
    ? urlQuery.type
    : 'all'
  const requestedPage = Math.max(1, Number(urlQuery.page) || 1)

  const [results, setResults] = useState<RawSearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const { title = demo.title, description = demo.description } = settings || {}

  // Words to highlight in card titles
  const highlightWords = useMemo(
    () => (searchQuery ? toSearchWords(searchQuery) : []),
    [searchQuery],
  )

  // Debounce the query so rapid URL changes (browser back/forward) don't fire
  // duplicate fetches. Loading state shows immediately via the effect below.
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Show loading state immediately on URL change, don't wait for debounce
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
          const flattenedResults: RawSearchResult[] = [
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

  const items = useMemo(() => results.map(toSearchItem), [results])

  const countsByType = useMemo(() => {
    const byType: Record<ResultType, number> = {
      all: items.length,
      arena: 0,
      hotel: 0,
      food: 0,
      guide: 0,
    }
    items.forEach((item) => {
      byType[item.kind] += 1
    })
    return byType
  }, [items])

  const filtered =
    activeType === 'all' ? items : items.filter((i) => i.kind === activeType)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const activePage = Math.min(requestedPage, Math.max(totalPages, 1))
  const pageItems = filtered.slice(
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

  const query = searchQuery ?? ''
  const group = SEARCH_GROUPS.find((g) => g.kind === activeType)

  const renderContent = () => {
    // Until the URL has been read, just the box (no flash of the empty page)
    if (!ready) return <SearchTop query="" />

    // Nothing typed yet: a title, the search box (ready to type) and ways in
    if (!searchQuery) {
      return (
        <>
          <SearchTop
            query=""
            autoFocus
            title={
              <div className="flex flex-col gap-1.5">
                <h1 className="font-heading-family text-section font-extrabold tracking-tight text-foreground md:text-page">
                  Search the site
                </h1>
                <p className="hidden text-base text-muted-foreground md:block">
                  Every arena, hotel, restaurant and guide we&apos;ve written
                  about.
                </p>
              </div>
            }
          />
          <div className="container mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-9">
            <SearchSuggestions counts={counts} />
          </div>
        </>
      )
    }

    if (loading) {
      return (
        <>
          <SearchTop query={query}>
            <p className="text-base font-semibold text-muted-foreground md:text-lg">
              Searching&hellip;
            </p>
          </SearchTop>
          <LoadingResults />
        </>
      )
    }

    if (error) {
      return (
        <>
          <SearchTop query={query} />
          <SearchError onRetry={() => setRetryCount((n) => n + 1)} />
        </>
      )
    }

    // Searched but nothing matched: say so plainly, then ways in
    if (items.length === 0) {
      return (
        <>
          <SearchTop query={query} />
          <div className="container mx-auto flex max-w-7xl flex-col gap-7 px-4 py-7 md:gap-8 md:px-6 md:py-10">
            <div className="flex flex-col items-start gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-primary-soft-background md:h-16 md:w-16">
                <SearchX className="h-6 w-6 text-foreground" aria-hidden="true" />
              </span>
              <h1 className="font-heading-family text-title font-extrabold text-foreground md:text-section">
                No results for &ldquo;{query}&rdquo;
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                We haven&apos;t been there yet, or it might be spelled
                differently. Try a city, a hotel, a restaurant or an arena.
              </p>
            </div>
            <SearchSuggestions counts={counts} />
          </div>
        </>
      )
    }

    return (
      <>
        <SearchTop query={query}>
          <CountLine
            count={group ? countsByType[group.kind] : items.length}
            noun={
              group
                ? group.noun
                : items.length === 1
                  ? 'result'
                  : 'results'
            }
            query={query}
          />
          <TypeChips
            activeType={activeType}
            counts={countsByType}
            onChange={(type) => updateUrl(type, 1)}
          />
        </SearchTop>

        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {activeType === 'all' ? (
            // Grouped by type: the top few of each, with "See all"
            SEARCH_GROUPS.filter((g) => countsByType[g.kind] > 0).map((g) => {
              const groupItems = items.filter((i) => i.kind === g.kind)
              return (
                <section
                  key={g.kind}
                  aria-labelledby={`results-${g.kind}`}
                  className="border-t border-border py-4 first:border-t-0 md:py-7"
                >
                  <div className="mb-1 flex items-baseline justify-between gap-3 md:mb-4">
                    <h2
                      id={`results-${g.kind}`}
                      className="font-heading-family text-lg font-extrabold text-foreground md:text-title"
                    >
                      {g.label}{' '}
                      <span className="text-muted-foreground">
                        {groupItems.length}
                      </span>
                    </h2>
                    {groupItems.length > GROUP_PREVIEW - 1 && (
                      <button
                        type="button"
                        onClick={() => updateUrl(g.kind, 1)}
                        className={`-my-2 min-h-11 whitespace-nowrap text-sm font-extrabold text-pink-700 hover:underline ${
                          groupItems.length <= GROUP_PREVIEW ? 'md:hidden' : ''
                        }`}
                      >
                        See all {groupItems.length} {g.noun} &rarr;
                      </button>
                    )}
                  </div>
                  <div className={resultGrid}>
                    {groupItems.slice(0, GROUP_PREVIEW).map((item, index) => (
                      <SearchResultItem
                        key={item.id}
                        item={item}
                        words={highlightWords}
                        // Phones show 3 per type
                        className={index === GROUP_PREVIEW - 1 ? 'max-md:hidden' : ''}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            <div className="py-4 md:py-8">
              <div className={resultGrid}>
                {pageItems.map((item) => (
                  <SearchResultItem
                    key={item.id}
                    item={item}
                    words={highlightWords}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="pb-4 pt-10">
                  <Pagination
                    total={totalPages}
                    value={activePage}
                    onChange={(page) => updateUrl(activeType, page)}
                    position="center"
                    size="lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <Layout preview={false} loading={false}>
      <Head>
        <title>
          {searchQuery
            ? `Search: "${searchQuery.slice(0, 60)}" | ${SITE_NAME}`
            : `Search | ${SITE_NAME}`}
        </title>
        {/* Result pages are thin, endless variants, keep them out of Google */}
        <meta name="robots" content="noindex, follow" />
      </Head>
      <BlogHeader title={title} description={description} level={1} />
      <main className="min-h-[70vh] pb-10">{renderContent()}</main>
      <Footer />
    </Layout>
  )
}

export default SearchResults

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
  const [settings, counts] = await Promise.all([
    getSettings(),
    getSearchSectionCounts(),
  ])
  return { props: { settings, counts }, revalidate: 60 }
}
