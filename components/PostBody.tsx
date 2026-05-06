import { PortableText } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import { useState } from 'react'

import styles from './PostBody.module.css'

const SampleImageComponent = ({ value }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { width, height } = getImageDimensions(value)
  const lqip = value.asset?.metadata?.lqip

  return (
    <figure className="image-container">
      <Image
        src={urlForImage(value).height(height).width(width).url()}
        alt={value.alt || ' '}
        width={width}
        height={height}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        onLoad={() => setIsLoaded(true)}
        className={`single-image transition-all duration-700 ease-in-out ${isLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'}`}
        style={{ aspectRatio: width / height }}
      />
      {value.caption && (
        <figcaption className="image-caption">{value.caption}</figcaption>
      )}
    </figure>
  )
}

export default function PostBody({ content }) {
  const processBlocks = (blocks) => {
    let result = []
    let imageGroup = []

    blocks?.forEach((block) => {
      if (block._type === 'image') {
        imageGroup.push(block)
      } else {
        if (imageGroup.length > 0) {
          result.push({ _type: 'imageGroup', images: imageGroup })
          imageGroup = []
        }
        result.push(block)
      }
    })

    if (imageGroup.length > 0) {
      result.push({ _type: 'imageGroup', images: imageGroup })
    }

    return result
  }

  return (
    <div
      className={`max-w-7xl leading-loose text-sm md:text-base font-thin ${styles.portableText}`}
    >
      <PortableText
        value={processBlocks(content)}
        components={{
          types: {
            image: SampleImageComponent,
            imageGroup: ({ value }) => (
              <div className="image-grid">
                {value.images.map((img, idx) => (
                  <SampleImageComponent key={idx} value={img} />
                ))}
              </div>
            ),
          },
        }}
      />
    </div>
  )
}
