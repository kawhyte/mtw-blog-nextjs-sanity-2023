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
}

export default function CoverImage(props: CoverImageProps) {
  const {
    title,
    date,
    slug,
    location,
    category,
    excerpt2,
    image: source,
    priority,
  } = props

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

  const categoryType = categoryRating(category)

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <div>
            {category && (
              <Badge
                className="absolute z-30  m-3"
                size="sm"
                color={categoryType.color}
                variant={categoryType.variant}
              >
                {categoryType.name}
              </Badge>
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
