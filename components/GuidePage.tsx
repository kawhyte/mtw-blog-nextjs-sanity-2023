// components/GuidePage.tsx

import Layout from 'components/BlogLayout'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import { urlForImage } from 'lib/sanity.image'
import { Guide, Settings } from 'lib/sanity.queries'
import Image from 'next/image'

import BlogHeader from './BlogHeader'

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

  return (
    <div>
      <PostPageHead settings={settings} post={guide} />

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
            <div className="mb-12">
              <Image
                src={urlForImage(guide.coverImage)
                  .width(1200)
                  .height(630)
                  .fit('crop')
                  .url()}
                alt={guide.title || 'Guide Cover Image'}
                width={1200}
                height={630}
                className="w-full h-auto rounded-lg"
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
