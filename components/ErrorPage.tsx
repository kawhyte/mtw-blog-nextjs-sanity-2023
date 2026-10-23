import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import SearchSuggestions, {
  type SectionCounts,
} from 'components/search/SearchSuggestions'
import Head from 'next/head'

/**
 * Shared layout for the 404 and 500 pages: the normal navbar and footer, a
 * linen band with a small label and the headline, then ways back into the
 * site, so nobody lands on a dead end.
 */
export default function ErrorPage({
  label,
  title,
  headline,
  text,
  counts,
  popular = true,
  children,
  after,
}: {
  /** Small pink label, e.g. "404 · PAGE NOT FOUND" */
  label: string
  /** Browser tab title */
  title: string
  headline: string
  text: string
  counts: SectionCounts
  /** Show the popular searches (off on the 500 page) */
  popular?: boolean
  /** Under the text in the linen band: the search box or buttons */
  children?: React.ReactNode
  /** Under the section tiles */
  after?: React.ReactNode
}) {
  return (
    <Layout preview={false} loading={false}>
      <Head>
        <title>{`${title} | Meet the Whytes`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <BlogHeader title={title} level={1} />
      <main className="min-h-[60vh]">
        <section className="bg-primary-soft-background">
          <div className="container mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-6 pt-7 md:gap-3.5 md:px-6 md:pb-10 md:pt-14">
            <p className="text-xs font-extrabold tracking-[0.14em] text-primary">
              {label}
            </p>
            <h1 className="font-heading-family max-w-[820px] text-section font-extrabold leading-tight tracking-tight text-foreground md:text-page">
              {headline}
            </h1>
            <p className="max-w-[620px] text-base leading-relaxed text-muted-foreground">
              {text}
            </p>
            {children && <div className="mt-2 md:mt-2.5">{children}</div>}
          </div>
        </section>
        <div className="container mx-auto flex max-w-7xl flex-col gap-7 px-4 pb-10 pt-6 md:gap-8 md:px-6 md:pb-12 md:pt-9">
          <SearchSuggestions counts={counts} popular={popular} />
          {after}
        </div>
      </main>
      <Footer />
    </Layout>
  )
}
