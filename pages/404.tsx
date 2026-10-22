import { ArrowRight, Home } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

const sections = [
  { href: '/hotels', label: 'Hotel Reviews' },
  { href: '/food', label: 'Food Reviews' },
  { href: '/guides', label: 'Travel Guides' },
  { href: '/arenas', label: 'Arena Quest' },
]

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Meet the Whytes</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="text-7xl font-black text-primary sm:text-9xl">404</p>
        <h1 className="mt-4 text-title font-bold text-foreground sm:text-page">
          This page took a wrong turn at the arena.
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have
          moved. Try one of these instead:
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-center gap-1 rounded-full border-2 border-border-bold bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-offsetIndigo transition-transform hover:-translate-y-0.5"
            >
              {s.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="mt-8 flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          <Home className="h-4 w-4" />
          Back to the homepage
        </Link>
      </main>
    </>
  )
}
