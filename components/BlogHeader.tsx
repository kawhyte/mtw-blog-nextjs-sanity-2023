import { PortableText } from '@portabletext/react'
import Link from 'next/link'

import styles from './BlogHeader.module.css'
import NavBar from './NavBar'

export default function BlogHeader({
  title,
  description,
  level,
}: {
  title: string
  description?: any[]
  level: 1 | 2
}) {
  switch (level) {
    case 1:
      return (
        <header className="mb-10 sticky top-0  z-50  mt-4 flex flex-col items-center md:mb-12 md:flex-row md:justify-between">
          {/* <h1 className="text-6xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
            {title}kk

          </h1> */}
          <NavBar bgColor={""}/>
          {/* <h4
            className={`mt-5 text-center text-lg md:pl-8 md:text-left ${styles.portableText}`}
          >
            <PortableText value={description} />
          </h4> */}
        </header>
      )

    case 2:
      return (
        <header className="mb-10 sticky top-0  z-50  mt-4 flex flex-col items-center md:mb-12 md:flex-row md:justify-between">
          <NavBar bgColor={""}/>
          {/* <h2 className="mb-20 mt-8 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
            <Link href="/" className="hover:underline">
              {title}PP
            </Link>
          </h2> */}
        </header>
      )

    default:
      throw new Error(
        `Invalid level: ${
          JSON.stringify(level) || typeof level
        }, only 1 or 2 are allowed`
      )
  }
}
