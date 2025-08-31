"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpoilerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number
  showLabel?: string
  hideLabel?: string
  children: React.ReactNode
}

const Spoiler = React.forwardRef<HTMLDivElement, SpoilerProps>(
  ({ 
    className, 
    maxHeight = 100, 
    showLabel = "Show more", 
    hideLabel = "Show less",
    children,
    ...props 
  }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [shouldShowButton, setShouldShowButton] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight
        setShouldShowButton(contentHeight > maxHeight)
      }
    }, [maxHeight, children])

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <div
          ref={contentRef}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            !isExpanded && shouldShowButton && `max-h-[${maxHeight}px]`
          )}
          style={{
            maxHeight: !isExpanded && shouldShowButton ? `${maxHeight}px` : 'none'
          }}
        >
          {children}
        </div>
        
        {shouldShowButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? hideLabel : showLabel}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    )
  }
)
Spoiler.displayName = "Spoiler"

export { Spoiler }
