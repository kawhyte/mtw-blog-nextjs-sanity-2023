import * as React from 'react'

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
}

/**
 * Lightweight progress bar component optimized for performance
 * Replaces Radix UI Progress to save ~12KB from bundle
 * @param value - Progress value (0-100)
 * @param className - Additional Tailwind classes
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className }, ref) => {
    // Clamp value between 0 and 100 for safety
    const clampedValue = Math.min(100, Math.max(0, value || 0))

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-gray-200',
          className,
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gray-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    )
  },
)

Progress.displayName = 'Progress'

export { Progress }
