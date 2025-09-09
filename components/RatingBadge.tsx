import React from 'react'

interface RatingBadgeProps {
  average: string
  textRating: string
  color?: string
}

const RatingBadge = ({ average, textRating, color }: RatingBadgeProps) => {
  return (
    <div
      className="absolute left-3 sm:left-auto  sm:right-3 top-3 z-30 text-xs flex sm:flex-col items-center justify-center rounded-2xl bg-black px-1.5 py-0.5 sm:p-2 space-x-1.5 sm:space-x-0 sm:space-y-1" // Added space utilities for spacing between items
      style={{ backgroundColor: color, opacity: 0.7 }}
    >
      {/* Average Number */}
      <div className="text-white">
        <span className="font-montserrat  font-black leading-tight tracking-tighter text-gray-900 sm:text-xl md:text-left md:text-2xl md:leading-none lg:text-xl">
          {(Math.floor(Number(average) * 100) / 100).toFixed(2)}
        </span>
      </div>

      {/* Vertical Separator (Mobile Only) */}
      {/* Visible by default (block), hidden on sm screens and up */}
      <div className="h-4 w-px bg-gray-900 block sm:hidden"></div>

      {/* Horizontal Separator (Desktop Only) */}
      {/* Hidden by default, visible (block) on sm screens and up */}
      <div className="h-px w-full bg-gray-900 hidden sm:block"></div>

      {/* Text Rating */}
      <p className="font-montserrat  font-bold text-gray-900">{textRating}</p>
    </div>
  )
}

export default RatingBadge
