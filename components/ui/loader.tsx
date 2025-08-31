import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "dots"
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8", 
      lg: "w-12 h-12"
    }

    if (variant === "dots") {
      return (
        <div
          ref={ref}
          className={cn("flex space-x-1 justify-center items-center", className)}
          {...props}
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-primary/30 border-t-primary",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Loader.displayName = "Loader"

export { Loader }
