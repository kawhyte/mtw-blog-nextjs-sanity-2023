// pages/search.js
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import MoreStoriesIndex from 'components/MoreStories' // Keep if you want related posts below
import * as demo from 'lib/demo.data'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { CMS_NAME } from '../lib/constants'
import { globalSearchQuery, Post } from '../lib/sanity.queries'
import { Settings } from '../lib/sanity.queries'
import { sanityClient } from '../lib/sanity.server'

interface PageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  settings: Settings
}

// Dynamically import Lottie Player component with SSR disabled
const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false }
)

const SearchResults = (props: PageProps) => {
  const router = useRouter()
  const { q: searchQuery } = router.query
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { settings } = props
  const { title = demo.title, description = demo.description } = settings || {}

  useEffect(() => {
    const currentSearchQuery = router.query.q
    if (typeof currentSearchQuery === 'string' && currentSearchQuery.trim()) {
      setLoading(true)
      setError(null)
      const searchTermWithWildcards = `*${currentSearchQuery.trim()}*`
      sanityClient
        .fetch(globalSearchQuery, { searchTerm: searchTermWithWildcards })
        .then((data) => {


          setResults(data || [])
          setLoading(false)
        })
        .catch((err) => {
          setError(err)
          setLoading(false)
          setResults([])
          console.error('Error fetching search results:', err)
        })
    } else {
      setResults([])
      setLoading(false)
      setError(null)
    }
  }, [router.query.q])

  // --- Loading State ---
  if (loading) {
    return (
      <Layout preview={false} loading={true}>
        <Container>
           <div className='flex justify-center items-center min-h-[50vh]'>Searching the archives...</div>
        </Container>
         <Footer />
      </Layout>
    )
  }

  // --- Error State ---
  if (error) {
     return (
      <Layout preview={false} loading={false}>
         <Container>
            <div className='flex justify-center items-center min-h-[50vh] text-red-600'>
                Blast! Something went wrong: {error.message}
             </div>
         </Container>
          <Footer />
       </Layout>
     )
  }
console.log('Search Results:', results)
  // --- Results Display ---
  return (
    <Layout preview={false} loading={loading}>
      <Head>
        <title>{searchQuery ? `Search: ${searchQuery}` : CMS_NAME}</title>
      </Head>
      <BlogHeader title={title} description={description} level={1} />

      <Container>
        {results.length > 0 ? (
          // --- RESULTS FOUND ---
          <>
            <h1 className='font-oswald text-3xl md:text-4xl mt-6 mb-6'>
              Search results for <span className="text-pink-500">&quot;{searchQuery}&quot;  </span>
            </h1>

            <p className="text-md md:text-lg text-gray-500 max-w-lg mx-auto">
            {results.length} items found. 😉
                </p>
            <MoreStoriesIndex
              posts={results}
              showPagination={true}
              showRating={false}
            />
          </>
        ) : (
          // --- NO RESULTS FOUND (or no search term entered yet) ---
          <>
            {searchQuery ? (
              // --- <<< FUNNY "NO RESULTS" BLOCK START >>> ---
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-10">

                {/* Lottie Animation */}
                <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] mx-auto mb-8">
                  <PlayerWithNoSSR
                    autoplay
                    keepLastFrame // Keep last frame can be good for static-like end poses
                    loop // Or set to false if the animation has a definitive end
                    // *** UPDATE THIS SRC ***
                    src={'/confused-search.json'} // <--- Point to your funny Lottie JSON in /public
                  />
                </div>

                {/* Funny Headline */}
                <h1 className='font-oswald text-3xl sm:text-4xl md:text-5xl mb-4 text-gray-800'>
                  Whoopsie! <span className='text-pink-500'> &quot;{searchQuery}&quot;</span> was not found.
                </h1>

                {/* Humorous Explanation */}
                {/* <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-2">
                  We sent our best search hamsters out looking for{' '}
                  <strong className="text-purple-600">&quot;{searchQuery}&quot;</strong>,
                  but they came back empty-pawed (and slightly dizzy).
                </p> */}
                <p className="text-md md:text-lg text-gray-500 max-w-lg mx-auto">
                  Maybe check the spelling? Or perhaps it&#39;s playing hide-and-seek in another dimension?
                </p>

                {/* Suggestion / Call to action */}
                <p className="mt-8 text-md text-gray-500">
                  Try searching for something else? <br/>
                  (We hear &#39;Day trip&#39; yields great results 😉)
                </p>

              </div>
              // --- <<< FUNNY "NO RESULTS" BLOCK END >>> ---
            ) : (
              // --- NO SEARCH TERM ENTERED YET ---
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                 {/* Optional: Add a "ready to search" Lottie here too? */}
                  <h2 className="text-2xl text-gray-700 mb-4">Ready when you are!</h2>
                  <p className="text-lg text-gray-500">Pop a search term into the bar above to begin your adventure.</p>
              </div>
            )}
             
          </>
        )}
      </Container>
      <Footer />
    </Layout>
  )
}

export default SearchResults