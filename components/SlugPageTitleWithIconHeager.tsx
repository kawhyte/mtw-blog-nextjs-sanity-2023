// components/PageHeader.tsx
import React from 'react'

// Define the structure for each info item
interface HeaderItem {
  icon: React.ReactNode // Allows passing JSX elements like <MapPin />
  text: string | number // Can be text or a number (like capacity)
  label?: string // Optional label like "Built", "Capacity"
  // Optional: Add a unique key if needed, though index might suffice for static lists
}

// Define the props for the PageHeader component
interface PageHeaderProps {
  title: string
  items: HeaderItem[] // An array of info items
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, items }) => {
  const hasItems = items && items.length > 0

  return (
    // Use the exact same wrapper and classes as the original header
    <header className="mb-12 lg:mb-16">
      {/* Title - passed via props */}
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl line-clamp-2">
        {title}
      </h1>

      {/* Info List - Render only if items are provided */}
      {hasItems && (
        // Use the exact same ul and classes as the original
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 md:text-base">
          {/* Map over the items array passed via props */}
          {items.map((item, index) => (
            // Use index as key for simplicity, ensure list order is stable per render
            <li key={index} className="flex items-center">
              {/* Render the icon passed in the item object */}
              {/* Ensure the icon passed includes necessary styling (like mr-2, h-4, w-4, text-color) */}
              {item.icon}
              {/* Render the optional label */}
              {item.label && (
                <span className="mr-1  hidden font-medium md:inline">
                  {item.label}:
                </span>
              )}
              {/* Render the text */}
              <span className="capitalize"> {item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default PageHeader
