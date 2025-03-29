// pages/search.js
import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import MoreStoriesIndex from 'components/MoreStories'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BlogHeader from 'components/BlogHeader'
import * as demo from 'lib/demo.data'

import { CMS_NAME } from '../lib/constants'
import { globalSearchQuery, Post } from '../lib/sanity.queries' // Adjust path as needed
import { sanityClient, urlFor } from '../lib/sanity.server' // Adjust path as needed

import { Settings } from '../lib/sanity.queries' // Adjust path as needed
import Footer from 'components/Footer'
interface PageProps {
 preview?: boolean
   loading?: boolean
   posts: Post[]
   
   
   settings: Settings
}



const SearchResults = (props:PageProps )=> {
  const router = useRouter()
  const { q: searchQuery } = router.query
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

const{ settings } = props
    const { title = demo.title, description = demo.description } = settings || {}

    useEffect(() => {
        const { q: searchQuery } = router.query;
        console.log('SearchQuery from Router:', searchQuery);
        if (searchQuery) {
          setLoading(true);
          const searchTermWithWildcards = `*${searchQuery}*`;
          console.log('searchTerm passed to Sanity:', searchTermWithWildcards); // Add this
          sanityClient
            .fetch(globalSearchQuery, { searchTerm: searchTermWithWildcards })
            .then((data) => {
              setResults(data);
              setLoading(false);
            })
            .catch((err) => {
              setError(err);
              setLoading(false);
              console.error('Error fetching search results:', err);
            });
        } else {
          setResults([]);
        }
      }, [router.query.q]);

  if (loading) {
    return <div>Searching...</div>
  }

  if (error) {
    return <div>Error loading search results: {error.message}</div>
  }
//   console.log('Search results:', results)

  return (
    <div>

{results.length > 0 ? (
<> 
      <Layout preview={false} loading={loading}>
    <> 
        <Head>
          <title>{CMS_NAME}</title>
        </Head>
        <BlogHeader title={title} description={description} level={1} />
        <Container>
          <h1 className='font-oswald text-4xl mt-6'> Search Results for &quot;{searchQuery}&quot;</h1>
          <MoreStoriesIndex
            posts={results}
            showPagination={false}
            showRating={true}
          />
        </Container>
    </>
      </Layout>
      <Footer />
      </>
):  <p>
{searchQuery
  ? 'No results found.'+ {searchQuery}
  : 'Enter a search term to see results.'}
</p>
    }

      {/* {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result._id}>
              <Link href={`/hotel/${result.slug}`}>
                {result.coverImage && (
                  <img
                    src={urlFor(result.coverImage)
                      .width(200)
                      .height(150)
                      .fit('crop')
                      .url()}
                    alt={result.title}
                  />
                )}
                <h3>{result.title}</h3>
                
                {result.location && <p>Location: {result.location}</p>}
                {result.category && <p>Category: {result.category}</p>}
                {result.date && (
                  <p>Date: {new Date(result.date).toLocaleDateString()}</p>
                )}
                {result.slug && <p>Slug: {result.slug}</p>}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          {searchQuery
            ? 'No results found.'
            : 'Enter a search term to see results.'}
        </p>
      )} */}
    </div>
  )
}

export default SearchResults
