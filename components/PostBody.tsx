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

import styles from './PostBody.module.css'


export default function PostBody({ content }) {
  return (
    <div className={` max-w-2xl my-3 mx-3 leading-relaxed text-base md:text-lg font-extralight ${styles.portableText}`}>
      <PortableText value={content} />


    </div>
  )
}
