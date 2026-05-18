// components/ArenaViewFromSeat.tsx

import { GalleryImageItem } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import { Camera, MapPin, Ticket } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import SectionTitle from './SectionTitle'
import VideoPlayer from './Youtube'

const ImageGallery = dynamic(() => import('./ImageGallery'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
  ),
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
  seatVideoUrl?: string
  photos?: GalleryImageItem[]
}

interface ArenaViewFromSeatProps {
  viewFromSeat: SeatViewEntry[]
  viewScore?: number
}

const MAX_PREVIEW = 6

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
  const displayScore =
    viewScore != null ? (viewScore / 2).toFixed(1) : null

  const previewPhotos = photos.slice(0, MAX_PREVIEW)
  const remainingCount = photos.length - MAX_PREVIEW

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <section className="py-8 md:py-12">
      <SectionTitle header="View From My Seat" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Tab switcher — only shown when there are multiple entries */}
        {viewFromSeat.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {viewFromSeat.map((entry, i) => (
              <button
                key={entry._key || i}
                onClick={() => {
                  setActiveTab(i)
                  setIsModalOpen(false)
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === i
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {entry.seatInfo || `Seat View ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Seat info row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
          {activeEntry.seatInfo && (
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-foreground">
                {activeEntry.seatInfo}
              </span>
            </div>
          )}
          {activeEntry.seatType && (
            <Badge variant="outline" className="text-xs">
              {SEAT_TYPE_LABELS[activeEntry.seatType] || activeEntry.seatType}
            </Badge>
          )}
          {displayScore && (
            <div className="flex items-center gap-1 sm:ml-auto">
              <Ticket className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span className="text-sm font-semibold text-secondary">
                Sightlines &amp; View: {displayScore} / 5
              </span>
            </div>
          )}
        </div>

        {/* Photo grid */}
        {photos.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {previewPhotos.map((photo, index) => {
                const isOverflowSlot =
                  index === MAX_PREVIEW - 1 && remainingCount > 0
                return (
                  <button
                    key={photo._key || index}
                    onClick={openModal}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label={
                      isOverflowSlot
                        ? `View all ${photos.length} photos`
                        : photo.caption || `Seat view photo ${index + 1}`
                    }
                  >
                    <FadeImage
                      image={photo}
                      src={
                        urlForImage(photo)
                          ?.width(600)
                          .height(450)
                          .fit('crop')
                          .url() || ''
                      }
                      alt={photo.alt || `Seat view ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* "+X more" overlay on last visible slot */}
                    {isOverflowSlot && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center rounded-lg">
                        <span className="text-white font-bold text-2xl">
                          +{remainingCount + 1}
                        </span>
                      </div>
                    )}
                    {/* Caption on hover (only when not the overflow slot) */}
                    {photo.caption && !isOverflowSlot && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-lg">
                        <p className="text-white text-xs leading-snug">
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Show all photos button */}
            {photos.length > 1 && (
              <button
                onClick={openModal}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Camera className="h-4 w-4" />
                Show all {photos.length} photos
              </button>
            )}
          </>
        )}

        {/* Seat-specific video */}
        {activeEntry.seatVideoUrl && (
          <div className="mt-8">
            <VideoPlayer
              url={activeEntry.seatVideoUrl}
              title="View From Our Seat"
            />
          </div>
        )}
      </div>

      {/* Gallery modal — seat photos only, separate from main hero gallery */}
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
