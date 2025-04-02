import { Badge, Blockquote, Flex, Text } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'
import { IconType } from 'react-icons'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoBed, IoLocation, IoStorefront } from 'react-icons/io5'

import BodySectionSeparator from './body-section-separator'
import CoverImagePost from './CoverImagePost'
import PostBody from './PostBody'
import StarRating from './StarRating'

// Type for common post meta information
interface PostMetaItemProps {
  icon: IconType
  text?: string | JSX.Element
}

// Reusable component for displaying post meta information
const PostMetaItem: React.FC<PostMetaItemProps> = ({ icon: Icon, text }) => (
  <Flex align="center" className="text-gray-700 md:text-left">
    <Icon className="mr-2 h-4 w-4 text-pink-500 md:h-5 md:w-5" />
    {text && (
      <Text size="sm" transform="capitalize" truncate>
        {text}
      </Text>
    )}
  </Flex>
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
    <Badge color="pink" variant="filled" size="lg">
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
      <Text
        component="p"
        className={`${oswald.variable} font-heading mb-2 text-2xl font-bold md:text-left md:leading-none lg:text-2xl`}
      >
        Quick Tip
      </Text>
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
  return (
    <>
      <div className="pl-4 pt-5 sm:ml-0 md:pt-12">
        <PostTitle>{title}</PostTitle>

        <div className="mt-2 max-w-4xl">
          <div className="grid grid-cols-2 gap-y-3 md:grid-cols-4">
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
        </div>
      </div>

      <div className="mb-8 sm:mx-0 md:mb-16">
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
              className={`${inter.variable} font-secondary my-8 max-w-6xl text-justify lg:text-lg`}
            >
              <Blockquote color="pink">
                <PostBody content={excerpt2} />
              </Blockquote>
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
