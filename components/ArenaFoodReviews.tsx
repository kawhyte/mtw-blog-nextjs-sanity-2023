import { urlForImage } from 'lib/sanity.image'
import type { ArenaFoodReviewCard } from 'lib/sanity.queries'
import { MapPin, Utensils, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'

import SectionTitle from './SectionTitle'

interface ArenaFoodReviewsProps {
  foodReviews: ArenaFoodReviewCard[]
}

export default function ArenaFoodReviews({ foodReviews }: ArenaFoodReviewsProps) {
  if (!foodReviews || foodReviews.length === 0) return null

  return (
    <section className="py-8 md:py-12">
      <SectionTitle header="Where We Ate Nearby" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {foodReviews.map((review) => {
            const hasImage = review.coverImage?.asset?._ref || review.coverImage?.asset?._id
            const istakeout = review.diningType === 'takeout'

            return (
              <Card
                key={review._id}
                className="border-2 border-border shadow-brutalist-sm"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    {hasImage && (
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={urlForImage(review.coverImage)
                            .width(160)
                            .height(128)
                            .fit('crop')
                            .url()}
                          alt={review.title || 'Food review'}
                          fill
                          className="object-cover"
                          sizes="80px"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {istakeout ? (
                          <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        ) : (
                          <Utensils className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {istakeout ? 'Takeout' : 'Dine-in'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-foreground leading-tight mb-1 line-clamp-2">
                        {review.title}
                      </h3>

                      {review.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {review.location}
                        </span>
                      )}

                      <Link
                        href={`/food/${review.slug}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Read our review &rarr;
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
