// components/GuidePage.tsx

import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import GuideCard from 'components/guides/GuideCard'
import ImageGallery from 'components/ImageGallery'
import SwipeRow from 'components/listing/SwipeRow'
import PostBody from 'components/PostBody'
import { formatDate } from 'components/PostDate'
import PostPageHead from 'components/PostPageHead'
import SanityImage from 'components/SanityImage'
import SectionTitle from 'components/SectionTitle'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { GUIDE_CATEGORY_LABELS, type GuideListingItem } from 'lib/guideListing'
import { sectionHeadings } from 'lib/headings'
import { calculateReadingTime } from 'lib/readingTime'
import { Guide, Settings } from 'lib/sanity.queries'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Images,
  Share2,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import BlogHeader from './BlogHeader'
import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import { useShare } from './review/ReviewActions'

interface GuidePageProps {
  guide: Guide
  settings: Settings
  /** "More guides" row: same category first, then the newest */
  relatedGuides?: GuideListingItem[]
  preview?: boolean
  loading?: boolean
}

/**
 * Highlights the section being read in "On this page": the last heading that
 * has scrolled up past the sticky navbar (first section until then).
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (ids.length === 0) return
    let frame = 0
    const update = () => {
      frame = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])
  return active
}

function SectionLinks({
  sections,
  active,
}: {
  sections: { id: string; text: string }[]
  active?: string
}) {
  return (
    <nav aria-label="On this page" className="flex flex-col">
      {sections.map(({ id, text }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={id === active ? 'location' : undefined}
          className={`border-l-[3px] py-2 pl-3.5 text-sm leading-snug transition-colors ${
            id === active
              ? 'border-primary font-bold text-primary'
              : 'border-border font-medium text-foreground/80 hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {text}
        </a>
      ))}
    </nav>
  )
}

export default function GuidePage({
  guide,
  settings,
  relatedGuides = [],
  preview,
  loading,
}: GuidePageProps) {
  const { title = 'Travel Guide' } = settings || {}
  const readingTime = calculateReadingTime(guide.content)
  const categoryLabel = guide.category
    ? (GUIDE_CATEGORY_LABELS[guide.category] ?? guide.category)
    : null
  // "On this page" only helps when there's more than one section
  const sections = sectionHeadings(guide.content)
  const showSections = sections.length > 1
  const active = useActiveSection(showSections ? sections.map((s) => s.id) : [])
  const { share, copied } = useShare(guide.title || 'Travel Guide')

  const { isOpen, openModal, closeModal } = usePhotoGallery(
    undefined,
    guide.gallery,
  )
  const hasGallery = guide.gallery && guide.gallery.length > 0

  const slugString =
    typeof guide.slug === 'string'
      ? guide.slug
      : (guide.slug as any)?.current || ''
  const meta = [
    guide.date && formatDate(guide.date),
    `${readingTime} min read`,
    guide.location?.trim(),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div>
      <PostPageHead settings={settings} post={guide} contentType="guide" />

      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Stories & Guides', url: '/guides' },
          {
            name: guide.title || 'Travel Guide',
            url: `/guide/${slugString}`,
          },
        ]}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        <article className="container mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-6 md:pt-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link
              href="/guides"
              className="transition-colors hover:text-foreground"
            >
              Stories &amp; Guides
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1 text-foreground">{guide.title}</span>
          </nav>

          {/* Same layout as the review pages: photo and article on the
              right, a sticky panel on the left on large screens. On phones
              the order is photo → panel → article. */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-12">
            {guide.coverImage?.asset && (
              <div className="relative aspect-[16/10] min-w-0 overflow-hidden rounded-3xl bg-muted sm:aspect-[16/9] xl:col-start-2 xl:row-start-1">
                <SanityImage
                  image={guide.coverImage}
                  width={1400}
                  height={788}
                  alt={guide.coverImage.alt || guide.title || 'Travel guide'}
                  sizes="(min-width: 1280px) 860px, (min-width: 768px) 90vw, 100vw"
                  priority
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            <aside className="self-start xl:sticky xl:top-24 xl:col-start-1 xl:row-span-2 xl:row-start-1">
              <div className="xl:flex xl:max-h-[calc(100vh-7rem)] xl:flex-col xl:overflow-hidden xl:rounded-3xl xl:border-[3px] xl:border-border-bold xl:bg-card">
                <div className="scrollbar-hide flex flex-col gap-5 xl:overflow-y-auto xl:overscroll-contain xl:p-6">
                  {categoryLabel && (
                    <Link
                      href={`/guides?type=${guide.category}`}
                      className="self-start rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-gray-900"
                    >
                      {categoryLabel}
                    </Link>
                  )}
                  <h1 className="font-heading-family text-3xl font-extrabold leading-tight xl:text-[28px]">
                    {guide.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">{meta}</p>

                  {/* Phones/tablets: collapsible "On this page" + share icon */}
                  <div className="flex items-start gap-2.5 xl:hidden">
                    {showSections && (
                      <details className="group min-w-0 flex-1 rounded-2xl border-2 border-border-bold bg-card">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
                          On this page
                          <ChevronDown
                            className="h-4 w-4 transition-transform group-open:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>
                        <div className="px-4 pb-3">
                          <SectionLinks sections={sections} active={active} />
                        </div>
                      </details>
                    )}
                    <button
                      type="button"
                      onClick={share}
                      aria-label={copied ? 'Link copied' : 'Share this guide'}
                      className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-border-bold bg-card text-sm font-bold transition-colors hover:bg-muted ${
                        showSections ? 'w-11 shrink-0' : 'px-4'
                      }`}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Share2 className="h-4 w-4" aria-hidden="true" />
                      )}
                      {!showSections && (copied ? 'Link copied' : 'Share')}
                    </button>
                  </div>

                  {/* Large screens: share button + always-open section list */}
                  <button
                    type="button"
                    onClick={share}
                    className="hidden min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-border-bold bg-card text-sm font-bold transition-colors hover:bg-muted xl:flex"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                    )}
                    {copied ? 'Link copied' : 'Share this guide'}
                  </button>
                  {showSections && (
                    <div className="hidden flex-col gap-2.5 border-t-2 border-muted pt-5 xl:flex">
                      <span className="text-xs font-bold tracking-[0.14em] text-muted-foreground">
                        ON THIS PAGE
                      </span>
                      <SectionLinks sections={sections} active={active} />
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <div className="min-w-0 xl:col-start-2 xl:row-start-2">
              <div className="max-w-[760px]">
                {guide.summary && (
                  <section className="mb-8 flex flex-col gap-3 border-b-[3px] border-border-bold pb-8">
                    <span className="text-xs font-bold tracking-[0.14em] text-primary">
                      IN SHORT
                    </span>
                    <p className="font-heading-family text-xl font-extrabold leading-snug text-foreground md:text-[26px]">
                      {guide.summary}
                    </p>
                  </section>
                )}

                <PostBody content={guide.content} flush />

                {guide.tags && guide.tags.length > 0 && (
                  <div className="mt-10 flex flex-wrap items-center gap-2 border-t-2 border-border pt-5">
                    <span className="mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      <Tag
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      Tagged
                    </span>
                    {/* Each tag opens search results for it (search matches tags) */}
                    {guide.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="inline-flex min-h-9 items-center rounded-full border-2 border-border bg-card px-3 text-sm font-medium capitalize text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {hasGallery && (
                <section className="my-12" aria-label="Photos">
                  <SectionTitle header="Photos" flush />
                  <div className="-mt-2 mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={openModal}
                      className="flex min-h-11 items-center gap-1.5 text-sm font-bold text-primary hover:opacity-75"
                    >
                      <Images className="h-4 w-4" aria-hidden="true" />
                      View all {guide.gallery!.length} photos
                    </button>
                  </div>
                  <ImageGallery
                    images={guide.gallery}
                    isOpen={isOpen}
                    openModal={openModal}
                    closeModal={closeModal}
                    showInlineGrid={true}
                  />
                </section>
              )}

              {relatedGuides.length > 0 && (
                <section className="mt-12">
                  <SwipeRow
                    title="More guides"
                    seeAllHref="/guides"
                    seeAllLabel="See all guides"
                  >
                    {relatedGuides.map((related) => (
                      <GuideCard key={related._id} guide={related} inRow />
                    ))}
                  </SwipeRow>
                </section>
              )}
            </div>
          </div>
        </article>
        <Footer />
      </Layout>
    </div>
  )
}
