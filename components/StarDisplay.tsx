// components/StarDisplay.tsx
import React from 'react';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

interface StarDisplayProps {
  /** The numerical rating value (e.g., 0 to 5). */
  ratingValue: number;
  /** Tailwind CSS class for star size (default: 'h-5 w-5'). */
  starSize?: string;
  /** Tailwind CSS class for active star color (default: 'text-yellow-400'). */
  activeColor?: string;
  /** Tailwind CSS class for inactive star color (default: 'text-gray-300'). */
  inactiveColor?: string;
}

/**
 * A component that renders a visual star rating (out of 5)
 * based on a numerical value.
 */
const StarDisplay: React.FC<StarDisplayProps> = ({
  ratingValue,
  starSize = 'h-5 w-5', // Default size
  activeColor = 'text-yellow-400', // Default active color
  inactiveColor = 'text-gray-300', // Default inactive color
}) => {
  const stars = [];
  // Ensure ratingValue is within a reasonable range (e.g., 0-5)
  const clampedRating = Math.max(0, Math.min(5, ratingValue));
  const fullStars = Math.floor(clampedRating);
  // Check if decimal part is >= 0.5 for half star
  const hasHalfStar = clampedRating - fullStars >= 0.5;
  // Calculate total filled stars (full + half) to determine empty ones
  const filledStarsCount = fullStars + (hasHalfStar ? 1 : 0);
  // Calculate remaining empty stars
  const emptyStars = Math.max(0, 5 - filledStarsCount);

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <IoStar key={`full-${i}`} className={`${starSize} ${activeColor}`} />
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<IoStarHalf key="half" className={`${starSize} ${activeColor}`} />);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <IoStarOutline key={`empty-${i}`} className={`${starSize} ${inactiveColor}`} />
    );
  }

  // Render the stars within a flex container
  // The slice ensures exactly 5 elements are attempted to be rendered,
  // though the logic above should already guarantee this.
  return <div className="flex items-center">{stars.slice(0, 5)}</div>;
};

export default StarDisplay;
