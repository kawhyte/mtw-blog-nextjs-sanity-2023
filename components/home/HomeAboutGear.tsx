import SanityImage from 'components/SanityImage'
import type { HomeGear } from 'lib/homeData'
import { Backpack, Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const DUO = [
  {
    name: 'Mr. Whyte',
    image: '/avatar_mr.png',
    ring: 'bg-stone-100',
    text: 'text-foreground',
  },
  {
    name: 'Mrs. Whyte',
    image: '/avatar_mrs.png',
    ring: 'bg-pink-50',
    text: 'text-primary',
  },
]

// Typed in by hand (not in Sanity): bump it after a new country
const COUNTRIES_VISITED = 18

/** "Meet the Whytes" and "What we pack", side by side on laptops */
export default function HomeAboutGear({
  gear,
  gearCount,
}: {
  gear: HomeGear[]
  gearCount: number
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      <section className="flex flex-col gap-4 rounded-3xl border-2 border-border bg-primary-soft-background p-5 md:p-7">
        <div className="flex items-center gap-4">
          {DUO.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-[72px] w-[72px] items-center justify-center rounded-full md:h-[88px] md:w-[88px] ${person.ring}`}
              >
                <Image
                  src={person.image}
                  alt={person.name}
                  width={76}
                  height={76}
                  unoptimized
                  className="h-[86%] w-[86%] rounded-full object-cover"
                />
              </span>
              <span className={`text-sm font-bold ${person.text}`}>
                {person.name}
              </span>
            </div>
          ))}
          <h2 className="ml-2 text-title font-extrabold tracking-tight md:text-title">
            Meet the Whytes
          </h2>
        </div>
        <p className="text-base leading-relaxed text-foreground/85 md:text-base">
          We&apos;re Rene and Kenny, and we travel for basketball. Tip-off is
          only half the trip, so this is our playbook for everything around it:
          the hotels we crash in, the local food we hunt down and the gear we
          pack.
        </p>
        <p className="flex items-center gap-2 text-sm text-foreground/85">
          <Globe
            className="h-[18px] w-[18px] text-foreground"
            aria-hidden="true"
          />
          <b>{COUNTRIES_VISITED}</b> countries visited together
        </p>
      </section>

      {gear.length > 0 && (
        <section className="flex flex-col gap-4 rounded-3xl border-2 border-border bg-card p-5 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Backpack
                className="h-6 w-6 text-foreground"
                aria-hidden="true"
              />
              <h2 className="text-title font-extrabold tracking-tight md:text-title">
                What we pack
              </h2>
            </div>
            <Link
              href="/essentials"
              className="-my-3 whitespace-nowrap py-3 text-sm font-bold text-pink-700 hover:underline"
            >
              All {gearCount} items <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="text-base text-foreground/75">
            Tried-and-tested gear for game days, cruises and day trips.
          </p>
          <ul className="grid grid-cols-4 gap-3">
            {gear.map((item) => (
              <li key={item._id}>
                <Link
                  href="/essentials"
                  className="flex min-w-0 flex-col gap-1.5 hover:text-primary"
                >
                  <span className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 border-border bg-white">
                    {item.image && (
                      <SanityImage
                        image={item.image}
                        width={200}
                        alt={item.name}
                        sizes="120px"
                        className="h-4/5 w-4/5 object-contain"
                      />
                    )}
                  </span>
                  <span className="text-xs font-semibold leading-snug md:text-sm">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
