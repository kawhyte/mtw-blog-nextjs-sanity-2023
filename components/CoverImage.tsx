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
} from '@mantine/core'
import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
//import Image from 'next/image'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

import { categoryRating } from '../lib/getHotelCategory'
import PostBody from './PostBody'
import PostDate from './PostDate'
import { calculateRating } from 'lib/calculateRating'
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
  hotelRating:any
  foodRating:any
  linkType:string
  diningType:any
}

export default function CoverImage(props: CoverImageProps) {
  const {
    title,
    date,
    slug,
    location,
    hotelRating,
    foodRating,
    category,
    excerpt2,
    image: source,
    priority,
    linkType,
    diningType
  } = props

  console.log("PPP2",linkType,diningType )
  console.log("PPP2",hotelRating,foodRating )

  const image = source?.asset?._ref ? (
    <div
      className={cn('	', {
        ' ': slug,
      })}
    >
      <Image
        className={cn('w-full object-cover object-center brightness-[0.85]', {
          '	relative z-20   transition-all  ':
            slug,
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
let rating = hotelRating
  const categoryType = categoryRating(category)

  let weights: { [category: string]: number } = {
    cleanliness: 0.2,
    service: 0.25,
    value: 0.2,
    location: 0.15,
    food: 0.2, // Default weight for food
  }

  switch (linkType) {
    case 'hotel':
      weights.Location = 0.2
      weights.Bed_Comfort = 0.2
      weights.Room_Cleanliness = 0.1
      weights.Gym = 0.05
      weights.Pool = 0.05
      weights.Service = 0.15
      weights.Internet_Speed = 0.05
      weights.Room_Amenities = 0.1
      weights.Value = 0.1
      
      break
    case 'food':
      switch (diningType) {
        case 'takeout':
          weights.tasteAndFlavor = 0.1
          weights.presentation = 0.3
          weights.accuracy = 0.1
          weights.packaging = 0.1
          weights.overallSatisfaction = 0.2
          weights.foodValue = 0.2
          break
        case 'dinein':
          weights.Restaurant_Location = 0.05
          weights.Restaurant_Service = 0.2
          weights.Food_Value = 0.15
          weights.Presentation_on_Plate = 0.05
          weights.Memorability = 0.15
          weights.Restaurant_Cleanliness = 0.2
          weights.Flavor_and_Taste = 0.2
          // rating = hotelRating
          break

        default:
          weights.Restaurant_Location = 0.05
          weights.Restaurant_Service = 0.2
          weights.Food_Value = 0.15
          weights.Presentation_on_Plate = 0.05
          weights.Memorability = 0.15
          weights.Restaurant_Cleanliness = 0.2
          weights.Flavor_and_Taste = 0.2
          break
      }

      break

    default:
      weights.Restaurant_Location = 0.2
      weights.food = 0.4
      weights.packaging = 0.1
      break
  }



    const overallRating = calculateRating(rating, weights)
    console.log('HHH', overallRating)
    // const propertyNames = Object.entries(rating).filter(
    //   ([key]) => key !== '_type'
    // )

  return (
    <div className="sm:mx-0 relative">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <div>
            {category && (
              <Badge
              className="absolute z-30 py-2  m-3"
              size="md"
              color={categoryType.color}
              variant={categoryType.variant}
              >
                {categoryType.name}
              </Badge>
            )}

            <Badge className="absolute  top-3 right-3 ml-3 z-50 py-2 ">4.5</Badge>
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
