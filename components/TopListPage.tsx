import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import * as demo from 'lib/demo.data'
import type { Settings } from 'lib/sanity.queries'
import { ArrowRight } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

import Footer from './Footer'
import ReviewHeader from './ReviewHeader'
import TopListItems from './TopListItems'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: any[]
  settings: Settings
  postHeader: string
  img: string
  summary: string
  contentType?: 'post' | 'hotel' | 'food'
  pageTitle?: string
  siblingLink?: string
  siblingLabel?: string
}

export default function IndexPage(props: IndexPageProps) {
  const {
    preview,
    loading,
    posts,
    settings,
    postHeader,
    img,
    summary,
    contentType = 'post',
    pageTitle,
    siblingLink,
    siblingLabel,
  } = props
  const { title = demo.title, description = demo.description } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{pageTitle || postHeader || title}</title>
        </Head>

        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={postHeader}
          summary={summary || 'Our top picks'}
          img={img}
          contentType={contentType}
        />

        {posts.length > 0 && (
          <TopListItems posts={posts} contentType={contentType} />
        )}

        {/* Cross-link to sibling page */}
        {siblingLink && siblingLabel && (
          <div className="container mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Link
              href={siblingLink}
              className="flex items-center justify-between rounded-2xl border-4 border-border-bold bg-card p-6 shadow-brutalist transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutalist-pressed"
            >
              <p className="font-plus-jakarta-sans text-base font-semibold text-foreground">
                {siblingLabel}
              </p>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </Layout>
      <Footer />
    </>
  )
}
