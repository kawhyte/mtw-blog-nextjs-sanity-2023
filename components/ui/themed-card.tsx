import * as React from "react"
import { cn } from "@/lib/utils"

interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "ghost"
  padding?: "none" | "sm" | "md" | "lg"
}

const ThemedCard = React.forwardRef<HTMLDivElement, ThemedCardProps>(
  ({ className, variant = "default", padding = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-lg border bg-card text-card-foreground transition-colors",
          
          // Variants
          {
            "shadow-sm": variant === "default",
            "shadow-md hover:shadow-lg transition-shadow": variant === "elevated",
            "border-2": variant === "outlined",
            "border-transparent bg-transparent shadow-none": variant === "ghost",
          },
          
          // Padding
          {
            "p-0": padding === "none",
            "p-3": padding === "sm",
            "p-6": padding === "md",
            "p-8": padding === "lg",
          },
          
          className
        )}
        {...props}
      />
    )
  }
)
ThemedCard.displayName = "ThemedCard"

const ThemedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
ThemedCardHeader.displayName = "ThemedCardHeader"

const ThemedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    style={{ color: "hsl(var(--blog-heading))" }}
    {...props}
  />
))
ThemedCardTitle.displayName = "ThemedCardTitle"

const ThemedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm", className)}
    style={{ color: "hsl(var(--blog-text-light))" }}
    {...props}
  />
))
ThemedCardDescription.displayName = "ThemedCardDescription"

const ThemedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ThemedCardContent.displayName = "ThemedCardContent"

const ThemedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
ThemedCardFooter.displayName = "ThemedCardFooter"

export {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardFooter,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
}
