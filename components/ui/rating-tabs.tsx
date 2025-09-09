'use client'

import { Bed, Car, MapPin, Star, Utensils, Wifi } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface RatingCategory {
  name: string
  value: number
  maxValue?: number
  description?: string
}

interface RatingTabsProps {
  hotelRating?: {
    [key: string]: number
  }
  foodRating?: {
    [key: string]: number
  }
  overallRating?: number
  className?: string
}

export function RatingTabs({
  hotelRating,
  foodRating,
  overallRating,
  className,
}: RatingTabsProps) {
  const getRatingColor = (rating: number, maxRating: number = 10) => {
    const percentage = (rating / maxRating) * 100
    if (percentage >= 80) return 'rating-excellent'
    if (percentage >= 60) return 'rating-good'
    if (percentage >= 40) return 'rating-average'
    return 'rating-poor'
  }

  const getRatingText = (rating: number, maxRating: number = 10) => {
    const percentage = (rating / maxRating) * 100
    if (percentage >= 80) return 'Excellent'
    if (percentage >= 60) return 'Good'
    if (percentage >= 40) return 'Average'
    return 'Poor'
  }

  const getIconForCategory = (category: string) => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes('location'))
      return <MapPin className="w-4 h-4" />
    if (lowerCategory.includes('food') || lowerCategory.includes('dining'))
      return <Utensils className="w-4 h-4" />
    if (lowerCategory.includes('room') || lowerCategory.includes('bed'))
      return <Bed className="w-4 h-4" />
    if (lowerCategory.includes('wifi') || lowerCategory.includes('internet'))
      return <Wifi className="w-4 h-4" />
    if (lowerCategory.includes('parking')) return <Car className="w-4 h-4" />
    return <Star className="w-4 h-4" />
  }

  const renderRatingCategory = (
    category: string,
    rating: number,
    maxRating: number = 10,
  ) => {
    const percentage = (rating / maxRating) * 100
    const colorClass = getRatingColor(rating, maxRating)
    const ratingText = getRatingText(rating, maxRating)

    return (
      <div key={category} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIconForCategory(category)}
            <span className="text-sm font-medium capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs px-2 py-1 bg-${colorClass}/10 text-${colorClass} border-${colorClass}/20`}
            >
              {ratingText}
            </Badge>
            <span className="text-sm font-semibold">
              {(Math.floor(rating * 100) / 100).toFixed(2)}/{maxRating}
            </span>
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    )
  }

  if (!hotelRating && !foodRating) {
    return null
  }

  return (
    <div className={className}>
      <Tabs defaultValue={hotelRating ? 'hotel' : 'food'} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {hotelRating && (
            <TabsTrigger value="hotel" className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Hotel Rating
            </TabsTrigger>
          )}
          {foodRating && (
            <TabsTrigger value="food" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Food Rating
            </TabsTrigger>
          )}
        </TabsList>

        {hotelRating && (
          <TabsContent value="hotel" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Hotel Experience</h3>
              {overallRating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Overall:
                  </span>
                  <Badge variant="default" className="bg-brand-primary">
                    {(Math.floor(overallRating * 100) / 100).toFixed(2)}/10
                  </Badge>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {Object.entries(hotelRating).map(([category, rating]) =>
                renderRatingCategory(category, rating),
              )}
            </div>
          </TabsContent>
        )}

        {foodRating && (
          <TabsContent value="food" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dining Experience</h3>
              {overallRating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Overall:
                  </span>
                  <Badge variant="default" className="bg-brand-primary">
                    {(Math.floor(overallRating * 100) / 100).toFixed(2)}/10
                  </Badge>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {Object.entries(foodRating).map(([category, rating]) =>
                renderRatingCategory(category, rating),
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
