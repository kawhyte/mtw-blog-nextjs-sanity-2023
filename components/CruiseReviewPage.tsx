import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CruiseDining from 'components/cruise/CruiseDining'
import {
  ActivitiesSection,
  CabinSection,
  CostSection,
  FaqSection,
  PortsSection,
  ShipSection,
  VerdictSection,
} from 'components/cruise/CruiseSections'
import CruiseSummaryPanel from 'components/cruise/CruiseSummaryPanel'
import { Eyebrow } from 'components/cruise/parts'
import Footer from 'components/Footer'
import ImageGallery from 'components/ImageGallery'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { BEST_FOR, cruiseOverall, RATING_LABELS } from 'lib/cruiseFormat'
import * as demo from 'lib/demo.data'
import type { CruiseReview, Settings } from 'lib/sanity.queries'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import FAQStructuredData from './FAQStructuredData'
import HeroPhotoGallery from './HeroPhotoGallery'

export interface CruiseReviewPageProps {
  preview?: boolean
  loading?: boolean
  review: CruiseReview
  settings: Settings
}

const JUMP_LINKS: [string, string][] = [
  ['ship', 'Ship'],
  ['cabin', 'Cabin'],
  ['cost', 'Cost'],
  ['dining', 'Dining'],
  ['activities', 'Activities'],
  ['ports', 'Ports'],
  ['verdict', 'Verdict'],
  ['faq', 'FAQ'],
]

const barClass = (score: number) =>
  score >= 8 ? 'bg-success' : score >= 5.5 ? 'bg-warning' : 'bg-destructive'

/** "On this page" links; sticks under the navbar and marks the section in view */
function JumpNav() {
  const [links, setLinks] = useState(JUMP_LINKS)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    // Empty sections aren't rendered, so drop their links
    const present = JUMP_LINKS.filter(([id]) => document.getElementById(id))
    setLinks(present)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )
    present.forEach(([id]) => observer.observe(document.getElementById(id)!))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[69px] z-30 -mx-4 mt-8 border-y border-border bg-background/95 backdrop-blur md:-mx-6 md:mt-10"
    >
      <ul className="flex overflow-x-auto px-2 [scrollbar-width:none] md:justify-center md:px-6">
        {links.map(([id, label]) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              className={`flex min-h-11 items-center border-b-[3px] px-3 text-sm font-bold whitespace-nowrap transition-colors md:px-4 ${
                active === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground hover:text-primary'
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function CruiseReviewPageContent({
  preview,
  loading,
  review,
  settings,
}: CruiseReviewPageProps) {
  const { title = demo.title } = settings || {}
  const overall = cruiseOverall(review)
  const { heroImages, galleryImages, isOpen, openModal, closeModal } =
    usePhotoGallery(review.heroPhotos, [
      review.coverImage,
      ...(review.gallery || []),
    ])
  const verdictText = review.verdict
    ?.flatMap((block: any) => block.children?.map((c: any) => c.text) ?? [])
    .join(' ')
    .trim()
  const ratings = RATING_LABELS.filter(
    ([key]) => typeof review.cruiseRating?.[key] === 'number',
  )
  const path = `/cruise/${review.slug}`
  const shipName = review.shipName || review.title

  return (
    <div>
      <PostPageHead
        settings={settings}
        post={review as any}
        contentType="cruise"
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: shipName, url: path },
        ]}
      />
      {!!review.faqs?.length && <FAQStructuredData faqs={review.faqs} />}

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        <article className="container mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 md:pt-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span>Cruises</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1 text-foreground">{shipName}</span>
          </nav>

          {/* Photos and verdict on the right, the summary panel on the left
              on large screens. On phones: photos, panel, then the verdict. */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:gap-8">
            {galleryImages.length > 0 && (
              <div className="-mx-4 min-w-0 md:mx-0 xl:col-start-2 xl:row-start-1">
                <HeroPhotoGallery
                  images={heroImages}
                  onShowAllPhotos={openModal}
                  bare
                />
              </div>
            )}

            <aside className="self-start xl:col-start-1 xl:row-span-2 xl:row-start-1">
              <CruiseSummaryPanel review={review} overall={overall} />
            </aside>

            <div className="flex min-w-0 flex-col gap-6 xl:col-start-2 xl:row-start-2">
              {(review.verdictHeadline || verdictText) && (
                <section className="flex flex-col gap-3">
                  <Eyebrow className="text-primary">The verdict</Eyebrow>
                  {review.verdictHeadline && (
                    <p className="font-heading-family text-section font-extrabold leading-tight md:text-page">
                      {review.verdictHeadline}
                    </p>
                  )}
                  {verdictText && (
                    <p className="text-base leading-relaxed text-stone-700 md:text-lg">
                      {verdictText}
                    </p>
                  )}
                  {!!review.bestFor?.length && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold">Best for:</span>
                      {review.bestFor.map((b) => (
                        <span
                          key={b}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold"
                        >
                          {BEST_FOR[b] ?? b}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {ratings.length > 0 && (
                <div className="rounded-2xl border-[3px] border-border-bold bg-card p-5 md:p-6">
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-extrabold md:text-title">
                      Ratings at a glance
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      Wi-Fi and sports are badges, not in the score
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
                    {ratings.map(([key, label]) => {
                      const score = review.cruiseRating![key]!
                      return (
                        <div key={key}>
                          <div className="flex justify-between gap-2 text-sm font-bold">
                            <span>{label}</span>
                            <span>{(score / 2).toFixed(1)}</span>
                          </div>
                          <div className="mt-1.5 h-2 rounded-full bg-border">
                            <div
                              className={`h-full rounded-full ${barClass(score)}`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <JumpNav />

          <ShipSection review={review} />
          <CabinSection review={review} />
          <CostSection review={review} />
          <CruiseDining review={review} />
          <ActivitiesSection review={review} />
          <PortsSection review={review} />
          <VerdictSection review={review} overall={overall?.numericalRating} />
          <FaqSection review={review} />

          {galleryImages.length > 0 && (
            <ImageGallery
              images={galleryImages}
              isOpen={isOpen}
              openModal={openModal}
              closeModal={closeModal}
              showInlineGrid={false}
            />
          )}
        </article>
        <Footer />
      </Layout>
    </div>
  )
}

export default function CruiseReviewPage(props: CruiseReviewPageProps) {
  if (!props.review) {
    return props.preview ? (
      <Layout preview loading={props.loading}>
        <PostTitle>Loading…</PostTitle>
      </Layout>
    ) : null
  }
  return <CruiseReviewPageContent {...props} />
}
