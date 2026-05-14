import { urlForImage } from 'lib/sanity.image'
import { Essential } from 'lib/sanity.queries'
import { CircleDollarSign } from 'lucide-react'
import Image from 'next/image'
import Button from 'ui/Button'

import PostBody from './PostBody'

const TRIP_TYPE_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  nba: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    label: 'NBA Game',
  },
  cruise: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-300',
    label: 'Cruise',
  },
  daytrip: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    label: 'Day Trip',
  },
  international: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-300',
    label: 'International',
  },
  all: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    label: 'All Trips',
  },
}

function TripBadge({ tripType }: { tripType?: string[] }) {
  if (!tripType?.length) return null

  const primary = tripType.find((t) => t !== 'all') ?? tripType[0]
  const style = TRIP_TYPE_STYLES[primary] ?? TRIP_TYPE_STYLES['all']
  const extras = tripType.filter((t) => t !== 'all' && t !== primary).length

  return (
    <div className="flex flex-wrap items-center gap-1">
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
      >
        {style.label}
      </span>
      {extras > 0 && (
        <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
          +{extras}
        </span>
      )}
    </div>
  )
}

const TravelEssentialLayout = ({ posts }: { posts: Essential[] }) => {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
        {posts?.map((item) => {
          const imgSrc = item?.productImage?.asset?._ref
            ? urlForImage(item.productImage.asset._ref)
                .width(400)
                .height(400)
                .fit('max')
                .auto('format')
                .url()
            : '/placeholder-image.png'

          const lqip = item?.productImage?.asset?.metadata?.lqip

          return (
            <div
              key={item._id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border-4 border-foreground bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-brutalist"
            >
              {/* Image */}
              <div className="relative h-44 w-full bg-muted md:h-48">
                <Image
                  alt={item.name ?? 'Travel gear item'}
                  src={imgSrc}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  style={{ objectFit: 'contain' }}
                  placeholder={lqip ? 'blur' : 'empty'}
                  blurDataURL={lqip}
                  className="p-3 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col grow p-4 gap-2">
                {/* Trip type badge */}
                <TripBadge tripType={item.tripType} />

                {/* Name */}
                <h2 className="font-epilogue line-clamp-2 text-base font-bold leading-tight text-foreground md:text-lg">
                  {item.name}
                </h2>

                {/* Why we pack this */}
                <div className="grow text-xs text-muted-foreground md:text-sm">
                  {item.whyWePack ? (
                    <p className="line-clamp-2 italic">{item.whyWePack}</p>
                  ) : item.description ? (
                    <div className="line-clamp-2 italic">
                      <PostBody content={item.description} />
                    </div>
                  ) : null}
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                  <CircleDollarSign className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {item.price && item.price > 0
                      ? `$${item.price.toFixed(2)}`
                      : 'Free'}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-auto border-t border-border pt-3 text-center">
                  <Button size="xs" link={item.link}>
                    Get It
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TravelEssentialLayout
