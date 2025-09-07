import { CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface CardSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={`group relative w-full overflow-hidden rounded-4xl border-4 border-border-bold bg-card text-foreground shadow-offsetIndigo ${className}`}
    >
      {/* Cover Image Skeleton */}
      <div className="relative">
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
        {/* Rating Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>

      <CardContent className="flex grow flex-col justify-between p-4">
        <div className="flex flex-col sm:mb-2 sm:ml-2 sm:gap-y-2">
          {/* Title Skeleton */}
          <div className="pt-1">
            <Skeleton className="h-5 w-4/5 sm:h-6" />
            <Skeleton className="mt-2 h-5 w-3/5 sm:h-6" />
          </div>

          {/* Meta Info Skeleton */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center md:flex-col md:items-start">
            {/* Location Skeleton */}
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Date Skeleton */}
            <div className="sm:ml-auto md:-ml-5">
              <div className="flex items-center">
                <Skeleton className="mr-2 h-5 w-5 rounded-full sm:ml-5" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="container mx-auto mt-auto flex items-center pt-1">
        <div className="w-full flex">
          <Skeleton className="mx-auto mb-2 h-9 w-32 rounded-md" />
        </div>
      </CardFooter>
    </div>
  )
}

interface CardSkeletonGridProps {
  count?: number
  className?: string
  layout?: 'search' | 'page' // Different layouts for different pages
}

export function CardSkeletonGrid({
  count = 9,
  className,
  layout = 'search',
}: CardSkeletonGridProps) {
  const gridClass =
    layout === 'search'
      ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto max-w-8xl'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'

  return (
    <div className={`grid ${gridClass} ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  )
}
