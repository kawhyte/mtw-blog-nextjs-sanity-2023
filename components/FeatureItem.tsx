// components/FeatureItem.tsx
import { CircleCheckBig, CircleX } from 'lucide-react' // Using Lucide icons
import React from 'react'

interface FeatureItemProps {
  /** The label to display for the feature. */
  label: string
  /** Whether the feature is available/positive (true) or not/negative (false). */
  isAvailable: boolean
  /** Optional details to display in parentheses after the label (e.g., coffee type). */
  details?: string | null
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  label,
  isAvailable,
  details,
}) => {
  const IconComponent = isAvailable ? CircleCheckBig : CircleX
  const iconColor = isAvailable ? 'text-green-500' : 'text-red-500'

  return (
    <div className="flex items-baseline">
      {' '}
      {/* Use items-baseline for better alignment */}
      {/* Icon Wrapper */}
      <div
        className={`mr-2 inline-flex shrink-0 items-center justify-center pt-0.5 ${iconColor}`}
      >
        <IconComponent className="h-5 w-5" />
      </div>
      {/* Label and Details */}
      <p className="text-sm leading-relaxed text-gray-600">
        {' '}
        {/* Adjusted text color */}
        {label}
        {isAvailable && details && ` (${details})`}{' '}
        {/* Show details only if available */}
      </p>
    </div>
  )
}

export default FeatureItem
