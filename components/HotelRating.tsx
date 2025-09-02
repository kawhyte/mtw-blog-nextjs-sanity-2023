import {
  Bath,
  Bed,
  Dumbbell,
  Handshake,
  MapPin,
  Sparkles,
  Star,
  WavesLadder,
  Wifi,
} from 'lucide-react'

import ProgressRating from './ProgressRating' // Assuming this component exists

// Helper function to format snake_case to Title Case
const formatRatingName = (name: string): string => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getTextScore = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4) return 'Great'
  if (rating >= 3.75) return 'Good'
  if (rating >= 3) return 'Fair'
  if (rating >= 2) return 'Poor'
  return 'Horrible'
}

interface HotelRatingProps {
  hotelRating: {
    Value?: number
    Gym?: number
    Internet_Speed?: number
    Service?: number
    Room_Cleanliness?: number
    Bed_Comfort?: number
    Room_Amenities?: number
    Pool?: number
    Location?: number
  }
}

const getRatingIcon = (ratingName: string) => {
  switch (ratingName) {
    case 'Value':
      return <Star className="h-5 w-5 mr-2 " />
    case 'Gym':
      return <Dumbbell className="h-5 w-5 mr-2 " />
    case 'Internet_Speed':
      return <Wifi className="h-5 w-5 mr-2 " />
    case 'Service':
      return <Handshake className="h-5 w-5 mr-2 " />
    case 'Room_Cleanliness':
      return <Sparkles className="h-5 w-5 mr-2 " />
    case 'Bed_Comfort':
      return <Bed className="h-5 w-5 mr-2 " />
    case 'Room_Amenities':
      return <Bath className="h-5 w-5 mr-2 " />
    case 'Pool':
      return <WavesLadder className="h-5 w-5 mr-2 " />
    case 'Location':
      return <MapPin className="h-5 w-5 mr-2 " />
    default:
      return null // No icon for unknown categories
  }
}

export default function HotelRating({ hotelRating }: HotelRatingProps) {
  // Guard clauses for when there is no rating data
  if (!hotelRating) {
    return null
  }
  const ratings = Object.entries(hotelRating).filter(
    ([key, value]) => key !== '_type' && value !== null && value !== undefined,
  )
  if (ratings.length === 0) {
    return null
  }

  // Simplified and more accurate overall rating calculation
  const totalScore = ratings.reduce((acc, [_, value]) => acc + (value || 0), 0)
  const overallRating = totalScore / ratings.length
  const textScore = getTextScore(overallRating)

  return (
    // Main container with themed background, padding, and rounded corners
    <section className="bg-secondary-soft-background rounded-2xl p-6 sm:p-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-12">
        {/* --- Left Column: Overall Score --- */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b-2 md:border-b-0 md:border-r-2 border-border pb-6 md:pb-0 md:pr-8 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Overall Rating
          </h2>
          {/* Use the secondary color for the score to match the background tint */}
          <p className="text-7xl font-bold text-secondary mb-2">
            {overallRating.toFixed(1)}
          </p>
          <p className="text-2xl font-semibold text-foreground mb-2">
            {textScore}
          </p>
          {/* <p className="text-muted-foreground">
            Based on {ratings.length} categories
          </p> */}
          <div className="mt-4 text-sm text-muted-foreground italic">
            A comprehensive look at what makes this stay special.
          </div>
        </div>

        {/* --- Right Column: Ratings Breakdown --- */}
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {ratings.map(([name, value]) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-foreground flex items-center">
                    {getRatingIcon(name)}
                    {formatRatingName(name)}
                  </span>
                </div>
                <div className="flex items-center">
                  {/* Pass the "secondary" color to match the component's theme */}
                  <ProgressRating progress={value} color="secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
