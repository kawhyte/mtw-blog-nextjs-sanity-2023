// components/ArenaViewFromSeat.tsx

import { urlForImage } from 'lib/sanity.image'
import { GalleryImageItem } from 'lib/sanity.queries'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'

import VideoPlayer from './Youtube'

const ImageGallery = dynamic(() => import('./ImageGallery'), {
  loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg" />,
})

const SEAT_TYPE_LABELS: Record<string, string> = {
  lower_bowl: 'Lower Bowl',
  upper_bowl: 'Upper Bowl',
  club: 'Club Level',
  courtside: 'Courtside / Floor',
  suite: 'Suite / Box',
  standing_room: 'Standing Room',
}

interface SeatViewEntry {
  _key?: string
  seatInfo?: string
  seatType?: string
  ticketPrice?: number
  seatVideoUrl?: string
  photos?: GalleryImageItem[]
}

interface ArenaViewFromSeatProps {
  viewFromSeat: SeatViewEntry[]
  viewScore?: number
}

// Small photos under the big one (the last shows "+N" when there are more)
const MAX_THUMBS = 4

const FadeImage = ({
  image,
  className,
  src,
  alt,
  ...props
}: {
  image: any
  className?: string
  src: string
  alt: string
  [key: string]: any
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const lqip = image?.asset?.metadata?.lqip

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      onLoad={() => setIsLoaded(true)}
      className={`transition-all duration-700 ease-in-out ${isLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'} ${className ?? ''}`}
      {...props}
    />
  )
}

export default function ArenaViewFromSeat({
  viewFromSeat,
  viewScore,
}: ArenaViewFromSeatProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!viewFromSeat || viewFromSeat.length === 0) return null

  const activeEntry = viewFromSeat[activeTab] ?? viewFromSeat[0]
  const photos = activeEntry?.photos ?? []
  const displayScore = viewScore != null ? (viewScore / 2).toFixed(1) : null

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const [lead, ...rest] = photos
  const thumbs = rest.slice(0, MAX_THUMBS)
  const hiddenCount = rest.length - thumbs.length
  const facts = [
    activeEntry.seatType &&
      (SEAT_TYPE_LABELS[activeEntry.seatType] || activeEntry.seatType),
    activeEntry.seatInfo,
    activeEntry.ticketPrice != null &&
      `$${activeEntry.ticketPrice.toFixed(2)} a ticket`,
    displayScore && `Sightlines ${displayScore}`,
  ].filter(Boolean) as string[]

  const factChips = (onPhoto: boolean) =>
    facts.map((fact) => (
      <span
        key={fact}
        className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${
          onPhoto ? 'bg-white text-foreground shadow' : 'bg-muted text-foreground'
        }`}
      >
        {fact}
      </span>
    ))

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-title font-extrabold tracking-tight sm:text-title">
          View from our seats
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          What the court looked like from where we sat.
        </p>
      </div>

      {/* Tab switcher, only when there are several seats */}
      {viewFromSeat.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {viewFromSeat.map((entry, i) => (
            <button
              key={entry._key || i}
              type="button"
              aria-pressed={activeTab === i}
              onClick={() => {
                setActiveTab(i)
                setIsModalOpen(false)
              }}
              className={`min-h-10 rounded-full px-4 text-sm font-bold transition-colors ${
                activeTab === i
                  ? 'bg-foreground text-background'
                  : 'border-2 border-border bg-card text-foreground hover:border-foreground/40'
              }`}
            >
              {entry.seatInfo ||
                (entry.seatType && SEAT_TYPE_LABELS[entry.seatType]) ||
                `Seat ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {lead ? (
        <button
          type="button"
          onClick={openModal}
          aria-label={lead.caption || lead.alt || 'View from our seat'}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border-[3px] border-border-bold bg-border-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary sm:aspect-[16/10]"
        >
          <FadeImage
            image={lead}
            src={
              urlForImage(lead)
                ?.width(1600)
                .height(1000)
                .quality(75)
                .fit('crop')
                .url() || ''
            }
            alt={lead.alt || 'View from our seat'}
            fill
            sizes="(min-width: 1280px) 860px, 100vw"
            className="object-cover"
          />
          {facts.length > 0 && (
            <span className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {factChips(true)}
            </span>
          )}
        </button>
      ) : (
        facts.length > 0 && (
          <div className="flex flex-wrap gap-2">{factChips(false)}</div>
        )
      )}

      {thumbs.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbs.map((photo, index) => {
            const isOverflowSlot =
              index === thumbs.length - 1 && hiddenCount > 0
            return (
              <button
                key={photo._key || index}
                type="button"
                onClick={openModal}
                aria-label={
                  isOverflowSlot
                    ? `View all ${photos.length} photos`
                    : photo.caption || `Seat view photo ${index + 2}`
                }
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <FadeImage
                  image={photo}
                  src={
                    urlForImage(photo)
                      ?.width(500)
                      .height(375)
                      .quality(70)
                      .fit('crop')
                      .url() || ''
                  }
                  alt={photo.alt || `Seat view ${index + 2}`}
                  fill
                  sizes="(min-width: 1280px) 210px, 25vw"
                  className="object-cover"
                />
                {isOverflowSlot && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-title font-bold text-white">
                    +{hiddenCount + 1}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Seat-specific video */}
      {activeEntry.seatVideoUrl && (
        <VideoPlayer url={activeEntry.seatVideoUrl} />
      )}

      {/* Gallery modal: seat photos only, separate from the main gallery */}
      {photos.length > 0 && (
        <ImageGallery
          images={photos}
          isOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          showInlineGrid={false}
        />
      )}
    </section>
  )
}
