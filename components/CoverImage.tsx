// import { AdvancedImage } from '@cloudinary/react'
// import { Cloudinary } from '@cloudinary/url-gen'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import cn from 'classnames'
import { ca } from 'date-fns/locale'
import { calculateRating } from 'lib/calculateRating'
import { getRatingWeights } from 'lib/ratingWeights'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
//import Image from 'next/image'
import Link from 'next/link'
// import { CldImage } from 'next-cloudinary'

import { categoryRating } from '../lib/getHotelCategory'
import PostBody from './PostBody'
import PostDate from './PostDate'
import RatingBadge from './RatingBadge'
//import { useState } from 'react';
interface CoverImageProps {
  title: string
  slug?: string
  date?: any
  location?: string
  image: any
  category?: string
  priority?: boolean
  excerpt2?: any
  // hotelRating:any
  // foodRating:any
  rating: any
  linkType: string
  diningType: any
  showRating: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const {
    title,
    date,
    slug,
    location,
    showRating,
    // hotelRating,
    // foodRating,
    rating,
    category,
    excerpt2,
    image: source,
    priority,
    linkType,
    diningType,
  } = props



  const image = source?.asset?._ref ? (
    <div className="relative md:h-[219px] md:w-[350px]">
      <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
      <Image
        className={cn('w-full object-cover object-center brightness-[0.85]', {
          '	relative z-20   transition-all  ': slug,
        })}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
        width={320}
        height={200}
        alt={`Cover Image for ${title}`}
        src={urlForImage(source)?.height(200)?.width(320)?.fit('crop').url()}
        loading='lazy'
      />
    </div>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )
 

  // let rating = hotelRating
  const categoryType = categoryRating(category)

  let rateWeights = getRatingWeights(linkType, diningType)
 

  const overallRating = calculateRating(rating, rateWeights)

  

  return (
    <div className="relative sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <div className=''>
            {linkType === 'hotel'
              ? category && (
                <Badge
                className={`absolute z-30 top-10 left-3 sm:top-3 text-xs px-2 py-1 ${
                  categoryType.color === 'blue' ? 'bg-category-economy/10 text-category-economy border-category-economy/20' :
                  categoryType.color === 'yellow' ? 'bg-category-luxury/10 text-category-luxury border-category-luxury/20' :
                  categoryType.color === 'green' ? 'bg-category-midscale/10 text-category-midscale border-category-midscale/20' :
                  categoryType.color === 'red' ? 'bg-error/10 text-error border-error/20' :
                  'bg-muted text-muted-foreground border-border'
                }`}
                variant="outline"
              >
                {categoryType.name}
              </Badge>
                )
              : ''}

            {/* <Badge className="absolute  top-3 right-3 ml-3 z-50 py-2 ">{overallRating.numericalRating.toFixed(2)}</Badge> */}

            {showRating && linkType !== 'story' && (
              <>
              
              {/* <div className="absolute right-3 top-3 z-30 flex  flex-col  items-center justify-center  rounded-2xl bg-black bg-opacity-50 p-1">
                <h2
                  className={` mx-2 my-1 text-lg font-black leading-tight tracking-tighter text-gray-100  md:text-left  md:leading-none `}
                >
                  {overallRating.numericalRating.toFixed(2)}
                </h2>

                <Badge size="md" className="  " color="violet">
                  {overallRating.textRating}
                </Badge>
              </div> */}
              
              <RatingBadge average={overallRating.numericalRating.toFixed(2)} textRating={overallRating.textRating} color={overallRating.color} /></>
            )}

            {image}
          </div>

          {/* <p className="z-20 mb-2 break-words text-center text-xl font-semibold leading-tight tracking-tighter  text-pink-500 hover:underline  md:mx-0 md:text-3xl">
            {title}
          </p> */}

          {/* <section>
            <span className="text-center text-lg text-gray-500">
              {location}
            </span>
          </section> */}
          {/* <div className="text-center text-lg  text-gray-500">
            <PostDate dateString={date} />
          </div> */}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
