import React from 'react';

interface SquareRatingProps {
  rating: number;
  maxRating?: number;
  size?: string;
  gap?: string;
  className?: string;
}

const SquareRating: React.FC<SquareRatingProps> = ({
  rating,
  maxRating = 5,
  size = '6',
  gap = '1',
  className,
}) => {
  const squares = Array.from({ length: maxRating }, (_, index) => index + 1);

  return (
    <div className={`flex items-center ${className}`}>
      {squares.map((value) => (
        <div
          key={value}
          className={`w-${size} h-${size} rounded-sm mr-${gap}`}
          style={{
            backgroundColor:
              value <= rating
                ? `hsl(${((value - 1) / (maxRating - 1)) * 120}, 100%, 50%)` // Red (0) to Green (120) hue
                : 'hsl(0, 0%, 80%)', // Light gray for unfilled
          }}
        />
      ))}
    </div>
  );
};

export default SquareRating;
