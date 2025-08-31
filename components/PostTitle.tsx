import { montserrat } from 'app/fonts'

export default function PostTitle({ children }) {
  return (
    <h1
      className={`${montserrat.variable} font-adventure-heading text-adventure-title z-10 py-2 text-left text-blog-heading`}
    >
      {children}
    </h1>
  )
}

export function CardTitle({ children }) {
  return (
    <h1
      className={`${montserrat.variable} font-adventure-subheading line-clamp-1 text-2xl text-blog-heading`}
    >
      {children}
    </h1>
  )
}
