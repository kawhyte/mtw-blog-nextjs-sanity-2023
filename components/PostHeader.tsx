import { inter, oswald } from 'app/fonts'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import {
  BedDouble,
  Calendar,
  MapPin,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import { IconType } from 'react-icons'
import { IoBed, IoLocation, IoStorefront } from 'react-icons/io5'

import { Badge } from '@/components/ui/badge'

import BodySectionSeparator from './body-section-separator'
import CoverImagePost from './CoverImagePost'
import PostBody from './PostBody'
import PageHeader from './SlugPageTitleWithIconHeager'
import StarRating from './StarRating'

// Type for common post meta information
interface PostMetaItemProps {
  icon: IconType
  text?: string | JSX.Element
}

// Reusable component for displaying post meta information
const PostMetaItem: React.FC<PostMetaItemProps> = ({ icon: Icon, text }) => (
  <div className="flex items-center text-gray-700 md:text-left">
    <Icon className="mr-2 h-4 w-4 text-pink-500 md:h-5 md:w-5" />
    {text && <span className="text-sm capitalize truncate">{text}</span>}
  </div>
)

// Type for props related to location/category
interface LocationCategoryProps {
  location?: string
  linkType?: Post['linkType']
  category?: string
}

// // Component for displaying location information
const LocationInfo: React.FC<LocationCategoryProps> = ({
  location,
  linkType,
  category,
}) =>
  linkType === 'food' && location ? (
    <PostMetaItem icon={IoLocation} text={location} />
  ) : linkType === 'hotel' && category && location ? (
    <>
      <PostMetaItem icon={IoLocation} text={location} />
      <PostMetaItem icon={IoStorefront} text={`${category} Hotel`} />
    </>
  ) : null

// Type for props related to dining
interface DiningBadgeProps {
  linkType?: Post['linkType']
  diningType?: Post['diningType']
}

// Component for displaying the dining type badge
const DiningBadge: React.FC<DiningBadgeProps> = ({ linkType, diningType }) =>
  linkType === 'food' && diningType ? (
    <Badge
      variant="default"
      className="bg-brand-primary hover:bg-brand-primary-dark text-primary-foreground border-brand-primary text-sm px-3 py-1"
    >
      {diningType.slice(0, 4)}-{diningType.slice(4)}
    </Badge>
  ) : null

// Type for props related to room information
interface RoomInfoProps {
  linkType?: Post['linkType']
  room?: Post['room']
}

// Component for displaying room information
const RoomInfo: React.FC<RoomInfoProps> = ({ linkType, room }) =>
  room && <PostMetaItem icon={IoBed} text={linkType === 'hotel' ? room : ''} />

// Type for props related to the quick tip
interface QuickTipProps {
  tip?: Post['tip']
}

// Component for displaying the quick tip section
const QuickTip: React.FC<QuickTipProps> = ({ tip }) =>
  tip && (
    <div className="max-w-4xl rounded-lg border-l-4 border-green-500 bg-green-100 p-4 text-gray-600">
      <p
        className={`${oswald.variable} font-heading mb-2 text-2xl font-bold md:text-left md:leading-none lg:text-2xl`}
      >
        Quick Tip
      </p>
      <PostBody content={tip} />
    </div>
  )

// Type for the main PostHeader component props
type PostHeaderProps = Pick<
  Post,
  | 'title'
  | 'coverImage'
  | 'date'
  | 'slug'
  | 'location'
  | 'linkType'
  | 'diningType'
  | 'room'
  | 'excerpt2'
  | 'hotelRating'
  | 'foodRating'
  | 'takeoutRating'
  | 'gallery'
  | 'category'
  | 'tip'
>

export default function PostHeader({
  title,
  coverImage,
  date,
  slug,
  location,
  linkType,
  diningType,
  room,
  excerpt2,
  hotelRating,
  foodRating,
  takeoutRating,
  gallery,
  category,
  tip,
}: PostHeaderProps) {
  const headerItems = []
  const iconClasses = 'mr-2 h-4 w-4 shrink-0 text-purple-500' // Define common icon style

  if (location) {
    headerItems.push({
      icon: <MapPin className={iconClasses} />,
      text: location,
    })
  }
  if (date) {
    headerItems.push({
      icon: <Calendar className={iconClasses} />,
      // label: 'Built',
      text: <Date dateString={date} />,
    })
  }
  if (category) {
    headerItems.push({
      icon: <Store className={iconClasses} />,
      // label: 'Visited',
      text: category + ' Hotel',
      // text: new Date(arena.date).toLocaleDateString(undefined, {
      //   year: 'numeric',
      //   month: 'long',
      //   day: 'numeric',
      // }),
    })
  }
  if (linkType == 'hotel') {
    headerItems.push({
      icon: <BedDouble className={iconClasses} />,
      // label: 'Capacity',
      text: room,
    })
  }
  if (linkType == 'food') {
    if (diningType == 'dinein') {
      headerItems.push({
        icon: <UtensilsCrossed className={iconClasses} />,
        // label: 'Capacity',
        text: 'Dine-in',
      })
    } else {
      headerItems.push({
        icon: <UtensilsCrossed className={iconClasses} />,
        // label: 'Capacity',
        text: 'Takeout',
      })
    }
  }

  return (
    <>
      <div className="pl-4  sm:ml-0 ">
        <PageHeader title={title ?? 'Unnamed Place'} items={headerItems} />

        {/* <PostTitle>{title}</PostTitle> */}

        {/* <div className="mt-2 max-w-4xl">
          <div className="grid grid-cols-2 gap-y-3 md:grid-cols-4 md:place-content-center md:place-items-center md:gap-x-4">
            <LocationInfo
              location={location}
              linkType={linkType}
              category={category}
            />

            <PostMetaItem
              icon={FaRegCalendarAlt}
              text={<Date dateString={date} />}
            />

            <DiningBadge linkType={linkType} diningType={diningType} />

            <RoomInfo linkType={linkType} room={room} />
          </div>
        </div> */}
      </div>

      <div className="mb-8 sm:mx-0 md:mb-16 ">
        <CoverImagePost
          title={title}
          image={coverImage}
          priority
          slug={slug}
          gallery={gallery}
        />

        {excerpt2 && (
          <>
            <div
              className={`${inter.variable} font-secondary my-8 flex max-w-6xl flex-col items-center justify-center align-middle lg:text-lg`}
            >
              <div className="text-sm text-gray-600">
                <svg
                  className="size-20 text-purple-500"
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>

              {/* <Blockquote className='-my-2' color="pink">  </Blockquote> */}
              <PostBody content={excerpt2} />
            </div>
            <BodySectionSeparator />
          </>
        )}

        {(linkType === 'hotel' || linkType === 'food') && (
          <div className="mx-6 my-6 block text-base md:mx-0 md:mb-12">
            <StarRating
              // Determine the correct rating object to pass
              rating={
                linkType === 'hotel'
                  ? hotelRating
                  : linkType === 'food' && diningType === 'dinein'
                    ? foodRating
                    : linkType === 'food' && diningType === 'takeout'
                      ? takeoutRating
                      : undefined // Fallback if needed
              }
              // Pass discriminators if StarRating needs them
              diningType={diningType}
              linkType={linkType}
            />
          </div>
        )}

        <QuickTip tip={tip} />
      </div>
    </>
  )
}
