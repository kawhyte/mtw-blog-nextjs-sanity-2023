import { ActionIcon, Badge, Button, Card, Group, Skeleton, Text } from '@mantine/core'
import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
//import Image from 'next/image'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

import { categoryRating } from '../lib/getHotelCategory'
import PostBody from './PostBody'
import PostDate from './PostDate'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
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
    

    
        <Skeleton className="z-10">

     

          <CldImage
            className={cn('', {
              '	relative mx-auto rounded-xl z-20 transition-all  hover:scale-110 hover:duration-200':
                slug,
            })}
            deliveryType="fetch"
            width={1200}
            height={801}
            //rawTransformations={['e_blur:2000']}
            //placeholder="vectorize"
            //plugins={[placeholder({mode: 'blur'})]}

            //blurDataURL=""

            // {urlForImage(source)
            //   .width(740)
            //   .height(744)
            //   .quality(1)
            //   .format('webp')
            //   .url()}
            // blurDataURL={urlForImage(source)
            //   .width(740)
            //   .height(744)
            //   .quality(1)
            //   .format('webp')
            //   .url()}
            //placeholder="blur"
            //unoptimized={true}
            alt={`Cover Image for ${title}`}
            src={urlForImage(source).url()} //.width(1240).height(801).format('webp').url()}
            //src={urlBlurred}//.width(1240).height(801).format('webp').url()}
            sizes="(max-width: 640px) 100vw,
        (max-width: 768px) 80vw,
        (max-width: 1024px) 60vw,
        50vw"
            format="auto"
            //quality="auto"
            crop="thumb"
            gravity="auto"
            loading="lazy"
            //priority={priority}
          />
        </Skeleton>
     
      
      {/* <Image
        className={cn('', {
          '	mx-auto rounded-xl relative transition-all  hover:scale-110 hover:duration-200':
            slug,
        })}
        width={740}
        height={770}
        blurDataURL={urlForImage(source)
          .width(740)
          .height(744)
          .quality(1)
          .format('webp')
          .url()}
        placeholder="blur"
        alt={`Cover Image for ${title}`}
        src={urlForImage(source).width(1240).height(801).format('webp').url()}
        sizes="100vw"
        priority={priority}
      /> */}
    </div>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )

  const categoryType = categoryRating(category)

  //console.log("categoryType----'] ", categoryType.name)
  // console.log("category ", category)

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <div>
            {category && (
              <Badge
                className="absolute  z-10  m-3"
                size="sm"
                color={categoryType.color}
                variant={categoryType.variant}
              >
                {categoryType.name}
              </Badge>
            )}
            {image}
          </div>
          <p className="z-20 mb-2 break-words pt-4 text-center text-xl font-semibold leading-tight tracking-tighter  text-pink-500 hover:underline  md:mx-0 md:text-3xl">
            {title}
          </p>

          <section>
            <span className="text-center text-lg text-gray-500">
              {location}
            </span>
          </section>
          <div className="text-center text-lg  text-gray-500">
            <PostDate dateString={date} />
          </div>
          {/* <PostBody content={excerpt2} /> */}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

// <Link
// as={`/${slugType}/${slug}`}
// href={`/${slugType}/[slug]`}
// className='hover:underline break-words'>

// </Link>
// </p>
