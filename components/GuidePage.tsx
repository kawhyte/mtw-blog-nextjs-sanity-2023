// components/GuidePage.tsx

import Layout from 'components/BlogLayout'
import ImageGallery from 'components/ImageGallery'
import PostBody from 'components/PostBody'
import { formatDate } from 'components/PostDate'
import PostPageHead from 'components/PostPageHead'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { urlForImage } from 'lib/sanity.image'
import { Guide, Settings } from 'lib/sanity.queries'
import { Calendar, ChevronRight, Clock, Images, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'

import BlogHeader from './BlogHeader'
import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import DynamicPostCard from './DynamicPostCard'

const CATEGORY_LABELS: Record<string, string> = {
  city: 'City Guide',
  tips: 'Travel Tips',
  transport: 'Transportation',
  culture: 'Culture & History',
  adventure: 'Adventure',
  family: 'Family Travel',
  budget: 'Budget Travel',
  luxury: 'Luxury Travel',
}

function calculateReadingTime(content?: any[]): number {
  if (!content) return 1
  let wordCount = 0
  const countInBlocks = (blocks: any[]) => {
    for (const block of blocks) {
      if (block._type === 'block' && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (child.text) wordCount += child.text.trim().split(/\s+/).length
        }
      } else if (block._type === 'mediaWithText' && Array.isArray(block.text)) {
        countInBlocks(block.text)
      } else if (block._type === 'callout' && Array.isArray(block.text)) {
        countInBlocks(block.text)
      }
    }
  }
  countInBlocks(content)
  return Math.max(1, Math.ceil(wordCount / 200))
}

interface GuidePageProps {
  guide: Guide
  settings: Settings
  relatedGuides?: Guide[]
  preview?: boolean
  loading?: boolean
}

export default function GuidePage({
  guide,
  settings,
  relatedGuides = [],
  preview,
  loading,
}: GuidePageProps) {
  const { title = 'Travel Guide' } = settings || {}
  const [coverLoaded, setCoverLoaded] = useState(false)
  const coverLqip = guide.coverImage?.asset?.metadata?.lqip
  const readingTime = calculateReadingTime(guide.content)
  const categoryLabel = guide.category
    ? (CATEGORY_LABELS[guide.category] ?? guide.category)
    : null

  const { isOpen, openModal, closeModal } = usePhotoGallery(
    undefined,
    guide.gallery,
  )
  const hasGallery = guide.gallery && guide.gallery.length > 0
  const hasRelated = relatedGuides && relatedGuides.length > 0

  const coverImageUrl = guide.coverImage
    ? urlForImage(guide.coverImage).width(1200).height(630).quality(85).fit('crop').url()
    : null

  const slugString =
    typeof guide.slug === 'string'
      ? guide.slug
      : (guide.slug as any)?.current || ''

  return (
    <div>
      <PostPageHead settings={settings} post={guide} contentType="guide" />

      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Travel Guides', url: '/guides' },
          {
            name: guide.title || 'Travel Guide',
            url: `/guide/${slugString}`,
          },
        ]}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        <article className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-5xl">
          {/* ── Visible Breadcrumb ── */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link
              href="/guides"
              className="hover:text-foreground transition-colors"
            >
              Travel Guides
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground line-clamp-1">{guide.title}</span>
          </nav>

          {/* ── Article Header ── */}
          <header className="mb-8">
            {categoryLabel && (
              <Badge
                variant="secondary"
                className="mb-3 uppercase tracking-widest text-xs font-semibold"
              >
                {categoryLabel}
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {guide.title}
            </h1>

            {/* Meta row: date + reading time */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {guide.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {formatDate(guide.date)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" />
                {readingTime} min read
              </span>
              {hasGallery && (
                <button
                  onClick={openModal}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  aria-label="View photo gallery"
                >
                  <Images className="h-4 w-4 shrink-0" />
                  {guide.gallery!.length} photos
                </button>
              )}
            </div>

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {guide.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs gap-1 cursor-default"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Summary / lead paragraph */}
            {guide.summary && (
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/40 pl-4 italic">
                {guide.summary}
              </p>
            )}
          </header>

          {/* ── Cover Image ── */}
          {coverImageUrl && (
            <div className="mb-12 overflow-hidden rounded-2xl shadow-brutalist-sm">
              <Image
                src={coverImageUrl}
                alt={`${guide.title} - Travel Guide cover image`}
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

          {/* ── Article Body ── */}
          <div className="max-w-3xl mx-auto">
            <PostBody content={guide.content} />
          </div>

          {/* ── Photo Gallery ── */}
          {hasGallery && (
            <section className="mt-16" aria-label="Photo Gallery">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Photo Gallery</h2>
                <button
                  onClick={openModal}
                  className="text-sm text-primary underline underline-offset-2 hover:opacity-75 transition-opacity flex items-center gap-1.5"
                >
                  <Images className="h-4 w-4" />
                  View all {guide.gallery!.length} photos
                </button>
              </div>
              <ImageGallery
                images={guide.gallery}
                title="Photo Gallery"
                isOpen={isOpen}
                openModal={openModal}
                closeModal={closeModal}
                showInlineGrid={true}
              />
            </section>
          )}

          {/* ── Related Guides ── */}
          {hasRelated && (
            <section
              className="mt-16 pt-12 border-t border-border"
              aria-label="Related Guides"
            >
              <h2 className="text-2xl font-bold mb-6">
                More {categoryLabel || 'Travel'} Guides
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedGuides.map((related) => (
                  <DynamicPostCard
                    key={related._id}
                    title={related.title}
                    coverImage={related.coverImage}
                    linkType="story"
                    date={related.date}
                    showRating={false}
                    slug={related.slug as string}
                    category={related.category}
                  />
                ))}
              </div>
            </section>
          )}
        </article>
      </Layout>
    </div>
  )
}
