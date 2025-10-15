import React from 'react'

interface RatingBadgeProps {
  average: string
  textRating: string
  color?: string
}

const RatingBadge = ({ average, textRating, color }: RatingBadgeProps) => {
  // Pre-calculate numeric rating for accessibility
  const numericRating = (Math.floor(Number(average) * 100) / 100).toFixed(2)

  return (
    <div
      className="text-xs flex sm:flex-col items-center justify-center rounded-2xl bg-black px-1 py-0.5 sm:px-2 sm:py-2 space-x-1.5 sm:space-x-0 sm:space-y-1 min-h-[44px] sm:min-h-0"
      style={{ backgroundColor: color, opacity: 0.85 }}
      role="img"
      aria-label={`Rating: ${numericRating} out of 5, ${textRating}`}
    >
      {/* Average Number */}
      <div className="text-white">
        <span
          className="font-montserrat font-black leading-tight tracking-tighter text-gray-900 text-sm sm:text-xl md:text-2xl"
          aria-hidden="true"
        >
          {numericRating}
        </span>
      </div>

      {/* Vertical Separator (Mobile Only) */}
      <div className="h-4 w-px bg-gray-900 block sm:hidden" aria-hidden="true"></div>

      {/* Horizontal Separator (Desktop Only) */}
      <div className="h-px w-full bg-gray-900 hidden sm:block" aria-hidden="true"></div>

      {/* Text Rating */}
      <p
        className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none"
        aria-hidden="true"
      >
        {textRating}
      </p>
    </div>
  )
}

export default RatingBadge
