import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Skeleton,
  Text,
  Title,
} from '@mantine/core'
import cn from 'classnames'
import { calculateRating } from 'lib/calculateRating'
import { ratingWeights } from 'lib/ratingWeights'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
//import Image from 'next/image'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

import { categoryRating } from '../lib/getHotelCategory'
import PostBody from './PostBody'
import PostDate from './PostDate'
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
  showRating:boolean
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

  // console.log("PPP2 Cover Image",hotelRating,foodRating )

  const image = source?.asset?._ref ? (
    <div
      className={cn('	', {
        ' ': slug,
      })}
    >
      <Image
        className={cn('w-full object-cover object-center brightness-[0.85]', {
          '	relative z-20   transition-all  ': slug,
        })}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
        width={502}
        height={203}
        alt={`Cover Image for ${title}`}
        src={urlForImage(source)?.height(203)?.width(402)?.url()}
      />
    </div>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )
  // console.log("Backingup1", hotelRating)

  // let rating = hotelRating
  const categoryType = categoryRating(category)

  let rateWeights = ratingWeights(linkType, diningType)
  //console.log(`RateWeights8 for`, rating, rateWeights )

  const overallRating = calculateRating(rating, rateWeights)
  //console.log('HHH33', overallRating)
  // const propertyNames = Object.entries(rating).filter(
  //   ([key]) => key !== '_type'
  // )

  return (
    <div className="relative sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <div>
            {category && (
              <Badge
                className="absolute z-30 m-3  py-2"
                size="md"
                color={categoryType.color}
                variant={categoryType.variant}
              >
                {categoryType.name}
              </Badge>
            )}

            {/* <Badge className="absolute  top-3 right-3 ml-3 z-50 py-2 ">{overallRating.numericalRating.toFixed(2)}</Badge> */}

          { showRating &&  <Badge
              size="lg"
              className=" absolute  right-3 top-3 z-50 ml-3 py-2 "
              variant="gradient"
              gradient={
                overallRating.numericalRating.toFixed(2) > '4.14'
                  ? { from: 'green', to: 'lime', deg: 105 }
                  : overallRating.numericalRating.toFixed(2) > '3.4'
                  ? { from: '#FFD400', to: '#FED44B', deg: 60 }
                  : overallRating.numericalRating.toFixed(2) > '3.0'
                  ? { from: '#ed6ea0', to: '#ec8c69', deg: 35 }
                  : { from: 'orange', to: 'red' }
              }
            >
              {overallRating.numericalRating.toFixed(2)}
            </Badge>}

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
