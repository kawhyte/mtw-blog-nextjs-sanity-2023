// src/components/DynamicPostCard.tsx

// Import shadcn/ui components
// Your existing imports
import { inter } from 'app/fonts';
import Date from 'components/PostDate';
import type { FoodReview,Guide, HotelReview, Post } from 'lib/sanity.queries';
// Import Lucide icons
import { Calendar, Hotel,MapPin } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

import CoverImage from './CoverImage';

// Define props for DynamicPostCard - no change here
interface DynamicPostCardProps {
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
  visited?: boolean;
}

// Your existing helper functions - no change here
const getLinkPrefix = (linkType?: 'hotel' | 'food' | 'story' | 'favorite'): string => {
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

// The DynamicPostCard Component with Shadcn/ui
const DynamicPostCard = ({
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
  visited,
}: DynamicPostCardProps) => {
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
    console.warn('DynamicPostCard skipped rendering due to missing slug or title', {
      slug,
      title,
    });
    return null;
  }

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-4xl border-4 border-border-bold bg-card text-foreground shadow-offsetIndigo transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-lg ${ 
        visited === false ? 'opacity-40 grayscale ' : 'grayscale-0'
      }`}
    >
      <div className="relative">
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
      </div>

      <CardContent className="flex grow flex-col justify-between p-4">
        <div className="flex flex-col sm:mb-2 sm:ml-2 sm:gap-y-2">
          <Link
            href={href}
            className={`${inter.variable} font-secondary`}
            aria-label={`Read more about ${title}`}
          >
            <CardTitle className="font-montserrat line-clamp-1 pt-1 text-sm font-bold text-foreground no-underline decoration-primary decoration-dashed decoration-4 group-hover:underline sm:line-clamp-2 sm:h-8 sm:text-xl lg:text-xl xl:pt-1.5">
              {title}
            </CardTitle>
          </Link>

          {/* Meta Info (Location, Date) */}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center md:flex-col md:items-start">
            {location && (
              <div className="flex items-center gap-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                <p className="text-sm">{location}</p>
              </div>
            )}

            <div className="sm:ml-auto md:-ml-5">
              <span className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground sm:ml-5" />
               
                  <>
                    <span className="mr-1 hidden text-sm lg:block">Visited on</span>
                    <Date dateString={date} />
                  </>
                
              
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* <Separator className="mx-2 my-3" /> */}

     
        <CardFooter className="container mx-auto mt-auto flex items-center pt-1">
          <Link href={href} className="w-full flex">
            <Button
              variant="secondary"
              className="mx-auto mb-2 inline-block rounded-md bg-accent px-3 py-1 text-base font-semibold text-primary transition-colors duration-150 ease-in-out hover:bg-primary hover:text-primary-foreground"
            >
              View Details
            </Button>
          </Link>
        </CardFooter>
    
    </div>
  );
};

export default DynamicPostCard;