import { Home } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Something Went Wrong | Meet the Whytes</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="text-7xl font-black text-primary sm:text-9xl">500</p>
        <h1 className="mt-4 text-title font-bold text-foreground sm:text-page">
          Well, that was an airball.
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Something went wrong on our end. Please refresh the page or try
          again in a minute.
        </p>
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
