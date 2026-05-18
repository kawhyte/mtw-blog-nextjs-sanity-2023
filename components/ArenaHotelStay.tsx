import { calculateRating } from 'lib/calculateRating'
import { HOTEL_WEIGHTS } from 'lib/ratingWeights'
import { urlForImage } from 'lib/sanity.image'
import { BedDouble, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import SectionTitle from './SectionTitle'

interface HotelStayData {
  hotel?: {
    title?: string
    slug?: string
    location?: string
    category?: string
    coverImage?: any
    hotelRating?: Record<string, number>
  }
  hotelName?: string
  nightsStayed?: number
}

interface ArenaHotelStayProps {
  hotelStay: HotelStayData
}

export default function ArenaHotelStay({ hotelStay }: ArenaHotelStayProps) {
  if (!hotelStay) return null

  const { hotel, hotelName, nightsStayed } = hotelStay
  const hasReview = !!hotel?.slug
  const displayName = hotel?.title ?? hotelName
  if (!displayName) return null

  const ratingResult = hotel?.hotelRating
    ? calculateRating(
        hotel.hotelRating as Record<string, number>,
        HOTEL_WEIGHTS,
      )
    : null

  const nightsLabel = nightsStayed
    ? `${nightsStayed} night${nightsStayed !== 1 ? 's' : ''}`
    : null

  return (
    <section className="py-8 md:py-12">
      <SectionTitle header="Where We Stayed" />
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-2xl border-2 border-border shadow-brutalist-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              {/* Hotel cover image (only when linked review exists) */}
              {hasReview && hotel?.coverImage && (
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={urlForImage(hotel.coverImage)
                      .width(224)
                      .height(160)
                      .fit('crop')
                      .url()}
                    alt={`${displayName} hotel`}
                    fill
                    className="object-cover"
                    sizes="112px"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Hotel Stay
                </p>
                <h3 className="text-lg font-bold text-foreground leading-tight mb-2">
                  {displayName}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {hotel?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {hotel.location}
                    </span>
                  )}
                  {nightsLabel && (
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 shrink-0" />
                      {nightsLabel}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {ratingResult && (
                    <Badge
                      className="font-bold text-sm"
                      style={{ backgroundColor: ratingResult.color, color: ratingResult.textColor }}
                    >
                      {ratingResult.displayRating} / 5 &bull;{' '}
                      {ratingResult.textRating}
                    </Badge>
                  )}
                  {hasReview && hotel?.slug && (
                    <Link
                      href={`/hotel/${hotel.slug}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Read our review &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
