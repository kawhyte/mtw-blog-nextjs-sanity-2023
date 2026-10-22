'use client'

import cn from 'classnames'
import {
  Backpack,
  Building2,
  MapPin,
  Menu,
  Search,
  Trophy,
  Utensils,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type React from 'react'
import { useEffect, useState } from 'react'

import SearchDialog from './SearchBox'

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
  /** Pages that belong to this section (e.g. a single review) */
  matches: string[]
}

const NAV_LINKS: NavLink[] = [
  {
    href: '/arenas',
    label: 'Arenas',
    icon: <Trophy className="h-5 w-5" aria-hidden="true" />,
    matches: ['/arenas', '/arena/', '/city/'],
  },
  {
    href: '/hotels',
    label: 'Hotels',
    icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
    matches: ['/hotels', '/hotel/'],
  },
  {
    href: '/food',
    label: 'Food',
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
    matches: ['/food'],
  },
  {
    href: '/guides',
    label: 'Guides',
    icon: <MapPin className="h-5 w-5" aria-hidden="true" />,
    matches: ['/guides', '/guide/'],
  },
  {
    href: '/essentials',
    label: 'Travel Gear',
    icon: <Backpack className="h-5 w-5" aria-hidden="true" />,
    matches: ['/essentials'],
  },
]

/**
 * Site navbar: logo, text links and a Search button on laptops and up;
 * logo + Search + Menu buttons below 1024px, so nothing gets squished.
 * Search opens a popup (also ⌘K / Ctrl+K).
 */
export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const isActive = (link: NavLink) =>
    link.matches.some((path) => router.pathname.startsWith(path))

  // Close everything when navigating
  useEffect(() => {
    const close = () => {
      setIsMenuOpen(false)
      setIsSearchOpen(false)
    }
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  }, [router.events])

  // ⌘K / Ctrl+K opens search from anywhere
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsMenuOpen(false)
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // The full-screen phone menu shouldn't let the page scroll behind it
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const openSearch = () => {
    setIsMenuOpen(false)
    setIsSearchOpen(true)
  }

  const iconButton =
    'flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur"
    >
      <div className="container mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Meet the Whytes home"
        >
          <Image
            className="rounded-xl"
            src="/icon/icon.jpg"
            unoptimized
            alt=""
            width={40}
            height={40}
            priority
          />
          <span className="font-heading-family hidden text-[17px] font-extrabold tracking-tight text-foreground sm:inline">
            meet the whytes
          </span>
        </Link>

        <div className="flex-1" />

        {/* Laptops and up: text links + search button */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(link)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative block py-2 text-[15px] transition-colors hover:text-primary',
                    active
                      ? 'font-bold text-primary'
                      : 'font-semibold text-foreground',
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-primary"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={openSearch}
          className="hidden h-[42px] w-44 items-center gap-2.5 rounded-full border-2 border-border bg-card pl-3.5 pr-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/40 lg:ml-2 lg:flex xl:ml-4 xl:w-56"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 whitespace-nowrap text-left">
            Search<span className="hidden xl:inline"> the site</span>
          </span>
          <kbd className="rounded-md border border-border px-1.5 font-sans text-xs font-semibold">
            ⌘K
          </kbd>
        </button>

        {/* Below 1024px: search + menu buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search the site"
            className={iconButton}
          >
            <Search className="h-[19px] w-[19px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={iconButton}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Phone / tablet menu: full screen under the bar */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-background lg:hidden"
        >
          <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-12 items-center gap-2.5 rounded-full border-2 border-border bg-card px-4 text-[15px] text-muted-foreground"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
              Search the site
            </button>
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex min-h-14 items-center gap-3.5 rounded-2xl px-4 text-lg font-bold transition-colors',
                        active
                          ? 'bg-primary-soft-background text-primary'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      {link.icon}
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="ml-auto text-muted-foreground"
                      >
                        ›
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
              <Image
                className="rounded-[10px]"
                src="/icon/icon.jpg"
                unoptimized
                alt=""
                width={36}
                height={36}
              />
              <p className="text-sm leading-snug text-muted-foreground">
                Rene &amp; Kenny, visiting and ranking every NBA and WNBA arena.
              </p>
            </div>
          </div>
        </div>
      )}

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </nav>
  )
}
