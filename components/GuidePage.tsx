// components/GuidePage.tsx

import Layout from 'components/BlogLayout'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import { urlForImage } from 'lib/sanity.image'
import { Guide, Settings } from 'lib/sanity.queries'
import Image from 'next/image'
import { useState } from 'react'

import BlogHeader from './BlogHeader'
import BreadcrumbStructuredData from './BreadcrumbStructuredData'

interface GuidePageProps {
  guide: Guide
  settings: Settings
  preview?: boolean
  loading?: boolean
}

export default function GuidePage({
  guide,
  settings,
  preview,
  loading,
}: GuidePageProps) {
  const { title = 'Travel Guide' } = settings || {}
  const [coverLoaded, setCoverLoaded] = useState(false)
  const coverLqip = guide.coverImage?.asset?.metadata?.lqip

  return (
    <div>
      <PostPageHead settings={settings} post={guide} contentType="guide" />

      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Travel Guides', url: '/guides' },
          {
            name: guide.title || 'Travel Guide',
            url: `/guide/${typeof guide.slug === 'string' ? guide.slug : (guide.slug as any)?.current || ''}`,
          },
        ]}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        <article className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">{guide.title}</h1>
            {guide.date && (
              <p className="text-lg text-muted-foreground">
                Published on {new Date(guide.date).toLocaleDateString()}
              </p>
            )}
          </header>

          {guide.coverImage && (
            <div className="mb-12 container mx-auto max-w-5xl overflow-hidden rounded-lg">
              <Image
                src={urlForImage(guide.coverImage)
                  .width(1200)
                  .height(630)
                  .fit('crop')
                  .url()}
                alt={`${guide.title} - NBA Arena Travel Guide Cover Image`}
                width={1200}
                height={630}
                priority
                placeholder={coverLqip ? 'blur' : 'empty'}
                blurDataURL={coverLqip}
                onLoad={() => setCoverLoaded(true)}
                className={`w-full h-auto transition-all duration-700 ease-in-out ${coverLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'}`}
              />
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <PostBody content={guide.content} />
          </div>
        </article>
      </Layout>
    </div>
  )
}
