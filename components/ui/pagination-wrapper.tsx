"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationWrapperProps {
  total: number
  value: number
  onChange: (page: number) => void
  position?: "left" | "center" | "right"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PaginationWrapper({
  total,
  value,
  onChange,
  position = "center",
  size = "md",
  className,
}: PaginationWrapperProps) {
  const currentPage = value
  const totalPages = total

  // Calculate which pages to show
  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "ellipsis-start")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("ellipsis-end", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  const positionClass = {
    left: "justify-start",
    center: "justify-center", 
    right: "justify-end"
  }[position]

  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }[size]

  return (
    <Pagination className={`${positionClass} ${sizeClass} ${className || ""}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onChange(page as number)}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
