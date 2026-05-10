import React from 'react'

interface RatingBadgeProps {
  average: string
  textRating: string
  color?: string
  textColor?: string
}

const RatingBadge = ({
  average,
  textRating,
  color,
  textColor = '#111827',
}: RatingBadgeProps) => {
  const numericRating = (Math.round(Number(average) * 10) / 10).toFixed(1)

  return (
    <div
      className="text-xs flex sm:flex-col items-center justify-center rounded-2xl bg-black px-1 py-0.5 sm:px-2 sm:py-2 space-x-1.5 sm:space-x-0 sm:space-y-1 min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-[56px]"
      style={{ backgroundColor: color, opacity: 0.85 }}
      role="img"
      aria-label={`Rating: ${numericRating} out of 5, ${textRating}`}
    >
      {/* Average Number */}
      <span
        className="font-montserrat font-black leading-tight tracking-tighter text-sm sm:text-xl md:text-lg"
        style={{ color: textColor }}
        aria-hidden="true"
      >
        {numericRating}
      </span>

      {/* Vertical Separator (Mobile Only) */}
      <div
        className="h-4 w-px block sm:hidden"
        style={{ backgroundColor: textColor }}
        aria-hidden="true"
      />

      {/* Horizontal Separator (Desktop Only) */}
      <div
        className="h-px w-full hidden sm:block"
        style={{ backgroundColor: textColor }}
        aria-hidden="true"
      />

      {/* Text Rating */}
      <p
        className="font-montserrat font-bold text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none"
        style={{ color: textColor }}
        aria-hidden="true"
      >
        {textRating}
      </p>
    </div>
  )
}

export default RatingBadge
