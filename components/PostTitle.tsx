import { oswald } from 'app/fonts'

export default function PostTitle({ children }) {
  return (
    <h1
      className={`${oswald.variable} font-fancy z-10 py-2 text-left font-heading text-2xl font-semibold leading-tight  tracking-tighter md:py-2 md:text-3xl md:leading-none lg:text-5xl`}
    >
      {children}
    </h1>
  )
}

export function CardTitle({ children }) {
  return (
    <h1
      className={`${oswald.variable} line-clamp-1 font-heading text-2xl font-medium text-gray-700  `}
    >
      {' '}
      {children}
    </h1>
  )
}
