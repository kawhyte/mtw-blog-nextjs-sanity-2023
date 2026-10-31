import { ArrowUp, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Same sections as the navbar, plus search
const FOOTER_LINKS = [
  { href: '/arenas', label: 'Arenas' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/food', label: 'Food' },
  { href: '/cruises', label: 'Cruises' },
  { href: '/guides', label: 'Guides' },
  { href: '/essentials', label: 'Travel Gear' },
  { href: '/search', label: 'Search' },
]

const SOCIAL = [
  {
    href: 'https://www.instagram.com/mtwtravel/',
    label: 'Instagram',
    icon: Instagram,
  },
  {
    href: 'https://www.youtube.com/channel/UC519Rsb02cRpbzDNLMWflVA',
    label: 'YouTube',
    icon: Youtube,
  },
]

/**
 * Site footer: who we are in one line, a link to every section (somewhere
 * to go next at the end of a long page, and links for Google), the social
 * accounts, then the credit and "Back to top".
 */
export default function Footer() {
  const year = new Date().getFullYear()
  return (
    // BlogLayout's <main> is a flex column: the spacer keeps the old 5rem gap
    // above the footer, and mt-auto pushes it to the bottom of short pages
    <>
      <div aria-hidden="true" className="h-20 shrink-0" />
      <footer className="mt-auto border-t border-border bg-primary-soft-background text-foreground">
        <div className="container mx-auto max-w-7xl px-4 pb-6 pt-7 md:px-6 md:pb-7 md:pt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="flex max-w-[420px] flex-col gap-3">
              <Link
                href="/"
                className="flex w-fit items-center gap-2.5"
                aria-label="Meet the Whytes home"
              >
                <Image
                  className="rounded-xl"
                  src="/icon/icon.jpg"
                  unoptimized
                  alt=""
                  width={40}
                  height={40}
                />
                <span className="font-heading-family text-lg font-extrabold tracking-tight">
                  meet the whytes
                </span>
              </Link>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Visiting and ranking every NBA &amp; WNBA arena, plus the hotels
                we stay in and the food we find along the way.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end lg:gap-[18px]">
              <nav aria-label="Footer">
                <ul className="grid grid-cols-2 gap-x-4 md:flex md:flex-wrap md:gap-x-7">
                  {FOOTER_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center text-base font-bold hover:text-primary md:min-h-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <ul className="flex gap-2.5">
                {SOCIAL.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label={`Meet the Whytes on ${label}`}
                      className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-border bg-card px-3.5 text-sm font-bold transition-colors hover:border-stone-300"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground md:mt-8">
            <p>
              &copy; {year} Created by{' '}
              <a
                href="https://www.kennywhyte.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground underline underline-offset-[3px] hover:text-primary"
              >
                Kenny
              </a>
            </p>
            <a
              href="#"
              className="flex min-h-11 items-center gap-1 font-bold text-foreground hover:text-primary"
            >
              Back to top
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
