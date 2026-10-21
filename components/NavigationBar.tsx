'use client' // Necessary because we're using hooks (useState, useRouter)

import cn from 'classnames'
import {
  Backpack,
  Building,
  MapPin,
  Menu,
  Search,
  Utensils,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router' // Import useRouter
import type React from 'react'
import { useEffect, useState } from 'react'
import { LiaBasketballBallSolid } from 'react-icons/lia'

import SearchBox from './SearchBox'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const router = useRouter() // Initialize router

  // --- Handlers ---
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsSearchOpen(false) // Close search if menu opens
  }
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsMenuOpen(false) // Close menu if search opens
  }

  // Note: handleToggleMenu and handleToggleSearch were simplified and merged into toggleMenu/toggleSearch
  // This avoids potential state conflicts if both tried to open simultaneously.

  // Close dropdowns and menu when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
      setIsSearchOpen(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  return (
    <nav className="sticky top-0 z-50 w-full bg-background shadow-sm">
      {/* Mobile Search Overlay */}
      {isSearchOpen && <SearchBox variant="mobile" onClose={toggleSearch} />}

      <div className="mx-auto flex max-w-396 items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center ">
              <span className="font-bold ">
                <Image
                  className="rounded-xl"
                  src="/icon/icon.jpg" // Ensure this path is correct in your public folder
                  unoptimized
                  alt="Meet the Whytes - NBA & WNBA Arena Travel Blog Logo"
                  width={45}
                  height={45}
                />
              </span>
            </div>
            <span className="hidden text-base font-medium 2xl:block">
              meet the whytes
            </span>
          </Link>
        </div>

        {/* Desktop Search */}
        <SearchBox variant="desktop" />

        {/* Mobile Icons (Search and Menu Toggle) */}
        <div className="flex items-center md:hidden">
          {/* Mobile Search Button */}
          <button
            type="button"
            className="ml-auto mr-2 min-h-11 min-w-11 p-2 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={toggleSearch}
            aria-label="Open search"
          >
            <Search size={20} />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="min-h-11 min-w-11 p-2 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex lg:space-x-4">
          <NavItem
            href="/arenas"
            icon={<LiaBasketballBallSolid size={22} />}
            text="NBA/WNBA Arenas"
          />
          <NavItem
            href="/hotels"
            icon={<Building size={22} />}
            text="Hotel Reviews"
          />
          <NavItem
            href="/food"
            icon={<Utensils size={22} />}
            text="Food Reviews"
          />
          <NavItem href="/guides" icon={<MapPin size={22} />} text="Guides" />
          <NavItem
            href="/essentials"
            icon={<Backpack size={22} />}
            text="Travel Gear"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 right-0 z-20 bg-card shadow-lg transition-transform duration-300 ease-in-out md:hidden',
          {
            'translate-y-0 opacity-100': isMenuOpen,
            // Use pointer-events-none ONLY when fully closed to prevent interfering with closing animation/clicks
            '-translate-y-full opacity-0': !isMenuOpen,
          },
        )}
        // Add pointer-events-none via style when menu is closed AFTER transition potentially
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
        aria-hidden={!isMenuOpen} // Accessibility: Hide when not visible
      >
        <div className="flex flex-col p-4">
          {/* Pass toggleMenu to top-level mobile items */}
          <MobileNavItem
            href="/arenas"
            icon={<LiaBasketballBallSolid size={18} />}
            text="NBA & WNBA Arenas"
            onClick={toggleMenu}
          />

          {/* Other top-level mobile items */}
          <MobileNavItem
            href="/hotels"
            icon={<Building size={18} />}
            text="Hotel Reviews"
            onClick={toggleMenu}
          />
          <MobileNavItem
            href="/food"
            icon={<Utensils size={18} />}
            text="Food Reviews"
            onClick={toggleMenu}
          />
          <MobileNavItem
            href="/guides"
            icon={<MapPin size={18} />}
            text="Guides"
            onClick={toggleMenu}
          />
          <MobileNavItem
            href="/essentials"
            icon={<Backpack size={18} />}
            text="Travel Gear"
            onClick={toggleMenu}
          />
        </div>
      </div>
    </nav>
  )
}

// --- Helper Components ---

// Updated NavItem to handle potential active state for parent dropdown
function NavItem({
  href,
  icon,
  text,
}: {
  href: string
  icon: React.ReactNode
  text: string
}) {
  const router = useRouter()
  // Simple active state check
  const isActive =
    router.pathname === href ||
    (href !== '/' && router.pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      className={cn(
        'relative flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 ease-in-out hover:bg-accent',
        {
          'text-primary': isActive, // Highlight if directly active
        },
      )}
      // Add aria-current for accessibility on active links
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={cn('mb-1', isActive ? 'text-primary' : 'text-primary')}>
        {icon}
      </span>
      <span>{text}</span>
      {/* Underline for active state */}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-3/5 -translate-x-1/2 transform rounded-full bg-primary"></span>
      )}
    </Link>
  )
}

// ***** CORRECTION *****
// Made onClick prop optional 'onClick?:'
function MobileNavItem({
  href,
  icon,
  text,
  onClick,
  isSubItem = false,
}: {
  href: string
  icon: React.ReactNode
  text: string
  onClick?: () => void
  isSubItem?: boolean
}) {
  const router = useRouter()
  const isActive =
    router.pathname === href ||
    (href !== '/' && router.pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center border-b border-border py-4 px-2 text-foreground transition-colors duration-200 ease-in-out hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring min-h-12',
        {
          'bg-accent text-primary font-medium': isActive,
          'pl-4': isSubItem,
        },
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={cn('mr-3', isActive ? 'text-primary' : 'text-primary')}>
        {icon}
      </span>
      <span>{text}</span>
    </Link>
  )
}
