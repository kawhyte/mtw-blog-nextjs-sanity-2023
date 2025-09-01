// src/components/PostPreview.tsx

// Import shadcn/ui components
// Your existing imports
import { inter } from 'app/fonts';
import Date from 'components/PostDate';
import type { FoodReview,Guide, HotelReview, Post } from 'lib/sanity.queries';
// Import Lucide icons
import { Calendar, Hotel, MapPin, Utensils } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import CoverImage from './CoverImage'; // Assuming CoverImage component exists

// Define props for PostPreview - no change here
interface PostPreviewProps {
  title?: string;
  coverImage?: any;
  hotelRating?: HotelReview['hotelRating'];
  foodRating?: FoodReview['foodRating'];
  takeoutRating?: FoodReview['takeoutRating'];
  linkType?: 'hotel' | 'food' | 'story' | 'favorite';
  diningType?: FoodReview['diningType'];
  date?: string;
  showRating?: boolean;
  slug?: string;
  location?: string;
  author?: any;
  excerpt2?: any;
  category?: string;
}

// Your existing helper functions - no change here
const getLinkPrefix = (
  linkType?: 'hotel' | 'food' | 'story' | 'favorite',
): string => {
  switch (linkType) {
    case 'hotel':
      return '/hotel';
    case 'story':
      return '/guide';
    case 'food':
      return '/food';
    case 'favorite':
    default:
      return '/posts';
  }
};

const getRating = (
  linkType?: 'hotel' | 'food' | 'story' | 'favorite',
  diningType?: FoodReview['diningType'],
  hotelRating?: HotelReview['hotelRating'],
  foodRating?: FoodReview['foodRating'],
  takeoutRating?: FoodReview['takeoutRating'],
):
  | HotelReview['hotelRating']
  | FoodReview['foodRating']
  | FoodReview['takeoutRating']
  | undefined => {
  if (linkType === 'hotel' && hotelRating) {
    return hotelRating;
  }
  if (linkType === 'food') {
    if (diningType === 'takeout' && takeoutRating) {
      return takeoutRating;
    }
    if (foodRating) {
      return foodRating;
    }
  }
  return undefined;
};

// The PostPreview Component with Shadcn/ui
const PostPreview = ({
  title,
  coverImage,
  hotelRating,
  foodRating,
  takeoutRating,
  linkType,
  diningType,
  date,
  showRating,
  slug,
  location,
  category,
}: PostPreviewProps) => {
  const safeSlug = slug ?? '';
  const href = `${getLinkPrefix(linkType)}/${safeSlug}`;

  const currentRating = getRating(
    linkType,
    diningType,
    hotelRating,
    foodRating,
    takeoutRating,
  );

  if (!safeSlug || !title) {
    console.warn('PostPreview skipped rendering due to missing slug or title', {
      slug,
      title,
    });
    return null;
  }

  // Determine which icon to show for the category badge
  const categoryIcon = linkType === 'hotel' ? <Hotel className="h-4 w-4 mr-1" /> : <Utensils className="h-4 w-4 mr-1" />;

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1">
      {/* Image container */}
      <div className="relative shrink-0">
        <CoverImage
          slug={safeSlug}
          title={title}
          image={coverImage}
          priority={false}
          rating={currentRating}
          showRating={showRating}
          linkType={linkType}
          diningType={diningType}
          category={category}
        />
        {category && (
          <Badge className="absolute top-4 left-4 text-xs">
            {categoryIcon}
            {category}
          </Badge>
        )}
      </div>

      <CardContent className="mt-4 flex grow flex-col p-4">
        <Link
          href={href}
          className={`${inter.variable} font-secondary`}
          aria-label={`Read more about ${title}`}
        >
          <CardTitle className="font-montserrat text-lg font-bold text-gray-900 line-clamp-2 h-16 transition-colors duration-300 group-hover:text-pink-500">
            {title}
          </CardTitle>
        </Link>

        {/* Meta Info (Location, Date) */}
        <div className="mt-3 flex flex-col items-start gap-y-2 text-sm text-gray-500">
          {location && (
            <div className="flex items-center gap-x-2">
              <MapPin className="h-4 w-4 shrink-0 text-pink-500" />
              <p className="line-clamp-1">{location}</p>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-x-2">
              <Calendar className="h-4 w-4 shrink-0 text-pink-500" />
              <Date dateString={date} />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto px-4 pb-4">
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full">
            Read Review
          </Button>
        </Link>
      </CardFooter>
    </div>
  );
};

export default PostPreview;