import { urlForImage } from 'lib/sanity.image'
import { Medal } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Badge } from '@/components/ui/badge'

import SectionTitle from './SectionTitle'

// --- Reusable Sub-Components ---

// NEW: A realistic, multi-tone cookie icon component that replaces the old system.
const FoodieCookie = ({ type = 'full' }) => {
  const cookieBaseColor = '#B5651D' // A warm, golden-brown for the cookie
  const chipColor = '#4F2A0D' // A dark, rich chocolate chip color

  const FullCookieContent = () => (
    <>
      <path
        d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"
        fill={cookieBaseColor}
      />
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-muted-foreground/40"
      >
        <EmptyCookieOutline />
      </svg>
    )
  }

  if (type === 'full') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <FullCookieContent />
      </svg>
    )
  }

  if (type === 'half') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <defs>
          <clipPath id="clip-left-half-cookie">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip-left-half-cookie)">
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

// Themed Cookie Rating Component
const ThemedCookieRating = ({ rating }) => {
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

// --- Main Exported Component ---

const IndividualFoodRating = ({ food }) => {
  if (!food || food.length === 0) {
    return null
  }

  // Helper to get themed styles for the rating badge
  const getRatingTheme = (rating) => {
    if (rating >= 4.5)
      return {
        text: 'Excellent!',
        badgeClass: 'bg-success text-success-foreground border-success',
      }
    if (rating >= 3.5)
      return {
        text: 'Good',
        badgeClass: 'bg-accent text-accent-foreground border-accent-foreground',
      }
    if (rating >= 2.5)
      return {
        text: 'Average',
        badgeClass: 'bg-muted text-muted-foreground border-border',
      }
    return {
      text: 'Could Be Better',
      badgeClass:
        'bg-destructive text-destructive-foreground border-destructive',
    }
  }

  return (
    <section className="my-12">
      <SectionTitle header={'Food & Drink We Tried'} />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {food.map((item, i) => {
            const dishRating = item.rating?.Dish || 0
            const ratingTheme = getRatingTheme(dishRating)
            const isChefsKiss = dishRating >= 4.5

            return (
              <div
                key={i}
                className="flex h-full flex-col overflow-hidden rounded-2xl border-4 border-border-bold bg-card shadow-lg"
              >
                {/* --- IMAGE CONTAINER --- */}
                <div className="relative h-64 w-full">
                  <Image
                    src={urlForImage(item.asset._ref)
                      .width(400)
                      .height(300)
                      .fit('crop')
                      .url()}
                    alt={item?.name || 'Food item'}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* --- CHEF'S KISS AWARD --- */}
                  {isChefsKiss && (
                    <div className="absolute top-0 right-0 flex items-center gap-x-2 rounded-bl-xl bg-primary p-2 shadow-md">
                      <Medal className="h-5 w-5 text-primary-foreground" />
                      <span className="font-semibold text-primary-foreground">
                        Chef's Kiss!
                      </span>
                    </div>
                  )}
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="flex flex-grow flex-col p-4">
                  <h3 className="text-xl font-bold text-foreground line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Rating Section */}
                  <div className="my-3 flex flex-wrap items-center justify-between gap-2 border-y border-border py-2">
                    <div className="flex items-center gap-x-2">
                      <span className="text-lg font-bold text-foreground">
                        {dishRating.toFixed(1)}
                      </span>
                      <ThemedCookieRating rating={dishRating} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-semibold ${ratingTheme.badgeClass}`}
                    >
                      {ratingTheme.text}
                    </Badge>
                  </div>

                  <p className="flex-grow text-sm text-muted-foreground line-clamp-3">
                    {item?.review}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default IndividualFoodRating
