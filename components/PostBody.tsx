/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */
import { PortableText } from '@portabletext/react'
import {getImageDimensions} from '@sanity/asset-utils'
import urlBuilder from '@sanity/image-url'
import { urlForImage } from 'lib/sanity.image'

import styles from './PostBody.module.css'

// Barebones lazy-loaded image component
const SampleImageComponent = ({value}) => {

  // console.log("Value ", value)
  const {width, height} = getImageDimensions(value)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      // src={urlBuilder().image(value).width(800).fit('max').auto('format').url()}
      src={urlForImage(value).height(height).width(width).url()}
      alt={value.alt || ' '}
      loading="lazy"
      style={{
        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  )
}



export default function PostBody({ content }) {
  return (
    <div className={` max-w-7xl my-y leading-relaxed text-base md:text-lg font-thin ${styles.portableText}`}>
      <PortableText value={content} 
      components={{
        // ...
        types: {
          image: SampleImageComponent,
        },
      }}
      
      
      
      />


    </div>
  )
}
