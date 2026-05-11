import { urlForImage } from 'lib/sanity.image'
import { Medal, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Badge } from '@/components/ui/badge'

import SectionTitle from './SectionTitle'

const FoodieCookie = ({ type = 'full' }) => {
  const cookieBaseColor = '#B5651D'
  const chipColor = '#4F2A0D'

  const FullCookieContent = () => (
    <>
      <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z" fill={cookieBaseColor} />
      <circle cx="8" cy="9" r="1.5" fill={chipColor} />
      <circle cx="15" cy="15" r="1.5" fill={chipColor} />
      <circle cx="16" cy="8" r="1" fill={chipColor} />
      <circle cx="10" cy="15" r="1" fill={chipColor} />
    </>
  )

  const EmptyCookieOutline = () => (
    <path
      d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  )

  if (type === 'empty') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground/40">
        <EmptyCookieOutline />
      </svg>
    )
  }

  if (type === 'full') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
        <FullCookieContent />
      </svg>
    )
  }

  if (type === 'half') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
        <defs>
          <clipPath id="clip-left-half-arena-cookie">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip-left-half-arena-cookie)">
          <FullCookieContent />
        </g>
        <g className="text-muted-foreground/40">
          <EmptyCookieOutline />
        </g>
      </svg>
    )
  }

  return null
}

const ThemedCookieRating = ({ rating }: { rating: number }) => {
  const fullCookies = Math.floor(rating)
  const halfCookie = rating - fullCookies >= 0.5
  const emptyCookies = 5 - fullCookies - (halfCookie ? 1 : 0)

  return (
    <div className="flex items-center">
      {[...Array(fullCookies)].map((_, i) => (
        <FoodieCookie key={`full-${i}`} type="full" />
      ))}
      {halfCookie && <FoodieCookie key="half" type="half" />}
      {[...Array(emptyCookies)].map((_, i) => (
        <FoodieCookie key={`empty-${i}`} type="empty" />
      ))}
    </div>
  )
}

const getRatingTheme = (rating: number) => {
  if (rating >= 4.5) return { text: 'Excellent!', badgeClass: 'bg-success text-success-foreground border-success' }
  if (rating >= 3.5) return { text: 'Good', badgeClass: 'bg-accent text-accent-foreground border-accent-foreground' }
  if (rating >= 2.5) return { text: 'Average', badgeClass: 'bg-muted text-muted-foreground border-border' }
  return { text: 'Could Be Better', badgeClass: 'bg-destructive text-destructive-foreground border-destructive' }
}

interface ArenaFoodItemsProps {
  food: any[]
}

const ArenaFoodItems = ({ food }: ArenaFoodItemsProps) => {
  if (!food || food.length === 0) return null

  const maxScore = Math.max(...food.map((item) => (item.rating?.Dish ?? 0) / 2))

  return (
    <section className="my-12">
      <SectionTitle header="Food & Drinks We Tried" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {food.map((item, i) => {
            const dishRating = (item.rating?.Dish ?? 0) / 2
            const ratingTheme = getRatingTheme(dishRating)
            const isChefsKiss = dishRating >= 4.5
            const isTopPick = dishRating === maxScore && maxScore > 0

            return (
              <div
                key={i}
                className="flex h-full flex-col overflow-hidden rounded-2xl border-4 border-border-bold bg-card shadow-lg"
              >
                <div className="relative h-64 w-full">
                  {item.asset?._ref && (
                    <Image
                      src={urlForImage(item.asset._ref)
                        .width(400)
                        .height(300)
                        .fit('crop')
                        .url()}
                      alt={item?.name || 'Arena food item'}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  {isChefsKiss && (
                    <div className="absolute top-0 right-0 flex items-center gap-x-2 rounded-bl-xl bg-primary p-2 shadow-md">
                      <Medal className="h-5 w-5 text-primary-foreground" />
                      <span className="font-semibold text-primary-foreground">Chef&apos;s Kiss!</span>
                    </div>
                  )}
                  {isTopPick && !isChefsKiss && (
                    <div className="absolute top-0 right-0 flex items-center gap-x-2 rounded-bl-xl bg-accent p-2 shadow-md">
                      <Star className="h-4 w-4 text-accent-foreground" />
                      <span className="text-xs font-semibold text-accent-foreground md:text-sm">Top Pick</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-grow flex-col p-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2">{item.name}</h3>
                    {item.price != null && item.price > 0 && (
                      <span className="shrink-0 text-sm font-normal text-muted-foreground">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="my-3 flex flex-wrap items-center justify-between gap-2 border-y border-border py-2">
                    <div className="flex items-center gap-x-2">
                      <span className="text-lg font-bold text-foreground">
                        {(Math.floor(dishRating * 100) / 100).toFixed(2)}
                      </span>
                      <ThemedCookieRating rating={dishRating} />
                    </div>
                    <Badge variant="outline" className={`font-semibold ${ratingTheme.badgeClass}`}>
                      {ratingTheme.text}
                    </Badge>
                  </div>

                  <p className="flex-grow text-sm text-muted-foreground line-clamp-3">{item?.review}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ArenaFoodItems
