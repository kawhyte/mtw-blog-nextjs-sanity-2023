'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  animated?: boolean
  animationDuration?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      animated = true,
      animationDuration = 2000,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = React.useState(0)
    const animationRef = React.useRef<number>()
    const startTimeRef = React.useRef<number>()

    React.useEffect(() => {
      if (!animated) {
        setDisplayValue(value)
        return
      }

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Reset to 0 and animate to target value
      setDisplayValue(0)
      startTimeRef.current = performance.now()

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return

        const elapsed = currentTime - startTimeRef.current
        const progress = Math.min(elapsed / animationDuration, 1)

        // Ease-out cubic function for smooth deceleration
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)

        const newValue = easeOutCubic * value
        setDisplayValue(newValue)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [value, animated, animationDuration])

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all duration-100 ease-out"
          style={{ transform: `translateX(-${100 - (displayValue || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  },
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
