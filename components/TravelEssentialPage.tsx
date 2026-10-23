import Layout from 'components/BlogLayout'
import GearCard from 'components/gear/GearCard'
import StaticPageHead from 'components/StaticPageHead'
import { GEAR_SECTIONS } from 'lib/gearSections'
import type { Essential, Settings } from 'lib/sanity.queries'

import BlogHeader from './BlogHeader'
import Footer from './Footer'

interface TravelEssentialPageProps {
  preview?: boolean
  loading?: boolean
  posts: Essential[]
  settings: Settings
}

interface GearGroup {
  id: string
  title: string
  blurb?: string
  items: Essential[]
}

// Inside a group: the ones we'd buy again first, then the newest
const byPick = (a: Essential, b: Essential) =>
  Number(b.recommend !== false) - Number(a.recommend !== false) ||
  (b.date ?? '').localeCompare(a.date ?? '')

/** The Studio "Section" groups in page order; items without one go last */
function groupGear(items: Essential[]): GearGroup[] {
  const known = new Set<string>(GEAR_SECTIONS.map((s) => s.value))
  const groups: GearGroup[] = GEAR_SECTIONS.map((section) => ({
    id: section.value,
    title: section.title,
    blurb: section.blurb,
    items: items.filter((item) => item.section === section.value),
  })).filter((group) => group.items.length > 0)
  const rest = items.filter((item) => !item.section || !known.has(item.section))
  if (rest.length > 0) {
    groups.push({
      id: 'more',
      title: groups.length > 0 ? 'More gear' : 'Everything we pack',
      items: rest,
    })
  }
  return groups.map((group) => ({
    ...group,
    items: [...group.items].sort(byPick),
  }))
}

export default function TravelEssentialPage({
  preview,
  loading,
  posts,
  settings,
}: TravelEssentialPageProps) {
  const groups = groupGear(posts)
  const skipCount = posts.filter((item) => item.recommend === false).length
  const keepCount = posts.length - skipCount
  const intro = `The gear that actually makes it into our bags, from game days to cruises. ${keepCount} pick${keepCount === 1 ? '' : 's'} we'd buy again${
    skipCount > 0 ? `, and ${skipCount} we wouldn't` : ''
  }.`

  return (
    <>
      <StaticPageHead
        settings={settings}
        title="What We Pack: Travel Gear | Meet the Whytes"
        description="Our tried-and-tested gear for NBA games, cruises, day trips and beyond, grouped by what it's for, plus the one thing we'd skip."
        path="/essentials"
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title="" description={[]} level={1} />

        <section className="border-b border-border bg-primary-soft-background">
          <div className="container mx-auto flex max-w-7xl flex-col gap-5 px-4 pb-5 pt-7 md:px-6 md:pb-7 md:pt-11">
            <div className="flex flex-col gap-2">
              <h1 className="text-page font-extrabold tracking-tight text-primary md:text-page">
                What We Pack
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
                {intro}
              </p>
            </div>
            {groups.length > 1 && (
              <nav
                aria-label="Jump to a section"
                className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
              >
                {groups.map((group) => (
                  <a
                    key={group.id}
                    href={`#${group.id}`}
                    className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:border-foreground/40"
                  >
                    {group.title}
                    <span className="font-semibold text-muted-foreground">
                      {group.items.length}
                    </span>
                  </a>
                ))}
              </nav>
            )}
          </div>
        </section>

        <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-4 py-7 md:gap-13 md:px-6 md:py-10">
          {groups.map((group, groupIndex) => (
            <section
              key={group.id}
              id={group.id}
              className="flex scroll-mt-24 flex-col gap-4 md:gap-5"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-title font-extrabold tracking-tight sm:text-title">
                  {group.title}{' '}
                  <span className="text-sm font-semibold text-muted-foreground sm:text-base">
                    ({group.items.length})
                  </span>
                </h2>
                {group.blurb && (
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {group.blurb}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:grid-cols-4">
                {group.items.map((item, index) => (
                  <GearCard
                    key={item._id}
                    item={item}
                    priority={groupIndex === 0 && index < 4}
                  />
                ))}
              </div>
            </section>
          ))}

          {posts.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              Our gear list is being packed. Check back soon.
            </p>
          )}
        </div>
      </Layout>
      <Footer />
    </>
  )
}
