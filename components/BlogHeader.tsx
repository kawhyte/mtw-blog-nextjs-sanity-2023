import { PortableText } from '@portabletext/react'
import Link from 'next/link'

import styles from './BlogHeader.module.css'
// import NavBar from './NavBar'
import NavBar from './NavigationBar'

export default function BlogHeader({
  title,
  description,
  level,
}: {
  title?: string
  description?: any[]
  level: 1 | 2
}) {
  switch (level) {
    case 1:
      return (
        <header className=" sticky top-0  z-50   flex flex-col items-center  md:flex-row md:justify-between">
          <NavBar />
        </header>
      )

    case 2:
      return (
        <header className="sticky top-0  z-50 flex flex-col items-center  md:flex-row md:justify-between">
          <NavBar />
        </header>
      )

    default:
      throw new Error(
        `Invalid level: ${
          JSON.stringify(level) || typeof level
        }, only 1 or 2 are allowed`,
      )
  }
}
