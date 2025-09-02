"use client" // Necessary because we're using hooks (useState, useRouter)

import cn from 'classnames'
import { Award, Building, ChevronDown, ChevronUp, MapPin, Menu, Search, Utensils, X } from "lucide-react" // Added ChevronDown, ChevronUp
import Image from 'next/image';
import Link from "next/link"
import { useRouter } from 'next/router' // Import useRouter
import type React from "react"
import { useEffect,useRef, useState } from "react" // Added useRef, useEffect
import { LiaBasketballBallSolid, LiaBathSolid, LiaCrownSolid } from 'react-icons/lia';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [isPicksDropdownOpen, setIsPicksDropdownOpen] = useState(false); // State for the picks dropdown

  const router = useRouter(); // Initialize router
  const picksDropdownRef = useRef<HTMLDivElement>(null); // Ref for the desktop dropdown container

  // --- Handlers ---
  const toggleMenu = () => {
      // When toggling the main menu, ensure the picks dropdown is also closed
      if (!isMenuOpen) { // If opening the menu
          setIsPicksDropdownOpen(false);
      }
      setIsMenuOpen(!isMenuOpen);
      setIsSearchOpen(false); // Close search if menu opens
  }
  const toggleSearch = () => {
      setIsSearchOpen(!isSearchOpen);
      setIsMenuOpen(false); // Close menu if search opens
      setIsPicksDropdownOpen(false); // Close picks dropdown if search opens
  }

  const togglePicksDropdown = (e?: React.MouseEvent) => {
      // Prevent event propagation if it's a click event to avoid conflicts, especially in mobile
      e?.stopPropagation();
      setIsPicksDropdownOpen(!isPicksDropdownOpen);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };

  // Note: handleToggleMenu and handleToggleSearch were simplified and merged into toggleMenu/toggleSearch
  // This avoids potential state conflicts if both tried to open simultaneously.

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false); // Close search overlay on submit
      setSearchTerm('');
      // No need to close dropdowns here, routeChangeStart effect handles it
    }
  };

  // Close dropdowns and menu when navigating
  useEffect(() => {
      const handleRouteChange = () => {
          setIsMenuOpen(false);
          setIsSearchOpen(false);
          setIsPicksDropdownOpen(false);
      };

      router.events.on('routeChangeStart', handleRouteChange);

      // Cleanup the event listener on component unmount
      return () => {
          router.events.off('routeChangeStart', handleRouteChange);
      };
  }, [router.events]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the dropdown container referenced by picksDropdownRef
      if (picksDropdownRef.current && !picksDropdownRef.current.contains(event.target as Node)) {
        setIsPicksDropdownOpen(false);
      }
    };

    // Only add listener if the desktop dropdown is open
    if (isPicksDropdownOpen && window.innerWidth >= 768) { // Assuming md breakpoint is 768px
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPicksDropdownOpen]); // Re-run effect when dropdown state changes


  return (
      <nav className="sticky top-0 z-50 w-full bg-slate-50 shadow-sm">
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="absolute inset-0 z-30 flex items-center justify-center bg-slate-50 p-4 md:hidden"
          aria-label="Mobile search form"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for Hotels, Restaurants, or Guides..."
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus // Automatically focus the input when it appears
            />
            <button
              type="button" // Important: type="button" to prevent form submission
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={toggleSearch} // Use toggleSearch to close
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </form>
      )}

      <div className="mx-auto flex max-w-396 items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 flex h-10 w-10 items-center justify-center ">
              <span className="font-bold ">
                  <Image
                          className="rounded-xl"
                          src="/icon/icon.jpg" // Ensure this path is correct in your public folder
                          alt="MTW icon"
                          width={45}
                          height={45}
                          priority
                        />
                        </span>
            </div>
            <span className="hidden font-space-grotesk text-base font-medium 2xl:block">meet the whytes</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearchSubmit} className="ml-4 hidden flex-1 max-w-md md:ml-6 md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for Hotels, Restaurants, or Guides..."
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
               type="submit"
               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600" // Added hover state
               aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Mobile Icons (Search and Menu Toggle) */}
        <div className="flex items-center md:hidden">
            {/* Mobile Search Button */}
            <button
               type="button"
               className="ml-auto mr-2 p-1 text-gray-600 hover:text-purple-600" // Added padding for easier tapping
               onClick={toggleSearch}
               aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
               type="button"
               className="p-1 text-gray-600 hover:text-purple-600" // Added padding
               onClick={toggleMenu}
               aria-label="Toggle menu"
               aria-expanded={isMenuOpen} // Accessibility: Indicate if menu is open
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex lg:space-x-4">
          <NavItem href="/arenas" icon={<LiaBasketballBallSolid size={22} />} text="NBA/WNBA Arenas" />
          {/* --- DESKTOP DROPDOWN START --- */}
          <div className="relative" ref={picksDropdownRef}> {/* Add ref here */}
              <button // Using button as it triggers a UI change, not navigation
                  type="button"
                  onClick={togglePicksDropdown}
                  className={cn(
                      "relative flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:bg-linear-to-r from-pink-100 to-orange-100",
                      // Add active state based on if a child route is active or dropdown is open
                      {
                        "text-purple-600": isPicksDropdownOpen || router.pathname.startsWith('/top-hotel-picks') || router.pathname.startsWith('/top-restaurant-picks'),
                      }
                  )}
                  aria-haspopup="true" // Accessibility: Indicates it has a popup menu
                  aria-expanded={isPicksDropdownOpen} // Accessibility: Indicates if dropdown is open
                  id="desktop-picks-menu-button" // Added ID for aria-labelledby
              >
                  <span className={cn("mb-1", (isPicksDropdownOpen || router.pathname.startsWith('/top-hotel-picks') || router.pathname.startsWith('/top-restaurant-picks')) ? "text-purple-600" : "text-purple-500")}>
                      <LiaCrownSolid size={22} />
                  </span>
                  <span className='flex items-center'> {/* Wrap text and icon */}
                      Our Top Picks
                      {/* Chevron indicating dropdown state */}
                      {isPicksDropdownOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                  </span>
                  {/* Active underline indicator */}
                  {(router.pathname.startsWith('/top-hotel-picks') || router.pathname.startsWith('/top-restaurant-picks')) && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-3/5 -translate-x-1/2 transform rounded-full bg-purple-500"></span>
                  )}
              </button>
              {/* Dropdown Menu */}
              {isPicksDropdownOpen && (
                  <div
                      className="absolute left-1/2 top-full z-10 mt-2 w-48 -translate-x-1/2 transform rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu" // Accessibility: Defines the role
                      aria-orientation="vertical"
                      aria-labelledby="desktop-picks-menu-button" // Associates menu with its button
                  >
                      <div className="py-1" role="none">
                          <Link
                              href="/top-hotel-picks"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem" // Accessibility
                              onClick={() => setIsPicksDropdownOpen(false)} // Close this dropdown on click
                          >
                              Top Hotel Picks
                          </Link>
                          <Link
                              href="/top-restaurant-picks"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem" // Accessibility
                              onClick={() => setIsPicksDropdownOpen(false)} // Close this dropdown on click
                          >
                              Top Restaurant Picks
                          </Link>
                      </div>
                  </div>
              )}
          </div>
          {/* --- DESKTOP DROPDOWN END --- */}
          <NavItem href="/hotels" icon={<Building size={22} />} text="Hotel Reviews" />
          <NavItem href="/food" icon={<Utensils size={22} />} text="Food Reviews" />
                        <NavItem href="/guides" icon={<MapPin size={22} />} text="Guides" />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute left-0 right-0 z-20 bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden",
          {
            "translate-y-0 opacity-100": isMenuOpen,
            // Use pointer-events-none ONLY when fully closed to prevent interfering with closing animation/clicks
            "-translate-y-full opacity-0": !isMenuOpen,
          }
        )}
        // Add pointer-events-none via style when menu is closed AFTER transition potentially
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
        aria-hidden={!isMenuOpen} // Accessibility: Hide when not visible
      >
        <div className="flex flex-col p-4">
          {/* Pass toggleMenu to top-level mobile items */}
          <MobileNavItem href="/arenas" icon={<LiaBasketballBallSolid size={18} />} text="NBA & WNBA Arenas" onClick={toggleMenu}/>

          {/* --- MOBILE DROPDOWN START --- */}
          {/* Button to toggle the mobile dropdown sub-menu */}
          <button
            type="button"
            onClick={togglePicksDropdown} // Toggles only the sub-menu visibility
            className={cn(
                "flex w-full items-center justify-between border-b border-gray-100 py-3 text-left text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-100", // Added text-left
                 // Highlight if dropdown is open or a child is active
                {
                  "bg-purple-50 text-purple-700 font-medium": isPicksDropdownOpen || router.pathname.startsWith('/top-hotel-picks') || router.pathname.startsWith('/top-restaurant-picks'),
                }
              )}
            aria-expanded={isPicksDropdownOpen} // Accessibility
            aria-controls="mobile-picks-submenu" // Accessibility: Links button to the submenu content
          >
            <span className="flex items-center">
                {/* Icon for the dropdown toggle */}
                <span className={cn("mr-3", isPicksDropdownOpen || router.pathname.startsWith('/top-hotel-picks') || router.pathname.startsWith('/top-restaurant-picks') ? "text-purple-700" : "text-purple-500")}>
                    <LiaCrownSolid size={18} />
                </span>
                <span>Our Top Picks</span>
            </span>
             {/* Chevron indicator showing dropdown state */}
             {isPicksDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Conditionally rendered sub-menu items */}
          {isPicksDropdownOpen && (
            <div id="mobile-picks-submenu" className="ml-4 flex flex-col border-l border-gray-200 pl-2"> {/* Indent sub-items */}
              {/* ***** CORRECTION ***** */}
              {/* REMOVED onClick={toggleMenu} from these sub-items */}
              {/* The routeChangeStart effect will handle closing the main menu */}
              <MobileNavItem
                href="/top-hotel-picks"
                icon={<Building size={16} />} // Optional: smaller icon
                text="Top Hotel Picks"
                // onClick={toggleMenu} // REMOVED - This caused the original issue
                isSubItem
              />
              <MobileNavItem
                href="/top-restaurant-picks"
                icon={<Utensils size={16} />} // Optional: smaller icon
                text="Top Restaurant Picks"
                // onClick={toggleMenu} // REMOVED - This caused the original issue
                isSubItem
              />
            </div>
          )}
          {/* --- MOBILE DROPDOWN END --- */}

          {/* Other top-level mobile items */}
          <MobileNavItem href="/hotels" icon={<Building size={18} />} text="Hotel Reviews" onClick={toggleMenu}/>
          <MobileNavItem href="/food" icon={<Utensils size={18} />} text="Food Reviews" onClick={toggleMenu}/>
          <MobileNavItem href="/guides" icon={<MapPin size={18} />} text="Guides" onClick={toggleMenu}/>
        </div>
      </div>
    </nav>
  )
}

// --- Helper Components ---

// Updated NavItem to handle potential active state for parent dropdown
function NavItem({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
 const router = useRouter();
 // Simple active state check
 const isActive = router.pathname === href || (href !== '/' && router.pathname.startsWith(href + '/'));

 return (
   <Link
     href={href}
     className={cn(
       "relative flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:bg-linear-to-r from-pink-100 to-orange-100",
       {
         "text-purple-600": isActive, // Highlight if directly active
       }
     )}
     // Add aria-current for accessibility on active links
     aria-current={isActive ? 'page' : undefined}
   >
     <span className={cn("mb-1", isActive ? "text-purple-600" : "text-purple-500")}>{icon}</span>
     <span>{text}</span>
     {/* Underline for active state */}
     {isActive && (
       <span className="absolute bottom-0 left-1/2 h-0.5 w-3/5 -translate-x-1/2 transform rounded-full bg-purple-500"></span>
     )}
   </Link>
 )
}

// ***** CORRECTION *****
// Made onClick prop optional 'onClick?:'
function MobileNavItem({ href, icon, text, onClick, isSubItem = false }: {
    href: string;
    icon: React.ReactNode;
    text: string;
    onClick?: () => void; // MADE OPTIONAL
    isSubItem?: boolean
}) {
 const router = useRouter();
 // Determine active state for styling/aria attributes
 const isActive = router.pathname === href || (href !== '/' && router.pathname.startsWith(href + '/'));

 return (
   <Link
     href={href}
     // Only attach onClick handler if it was actually provided
     // For sub-menu items, it won't be provided, allowing the link to navigate
     onClick={onClick}
     className={cn(
       "flex items-center border-b border-gray-100 py-3 text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-100",
       {
         "bg-purple-50 text-purple-700 font-medium": isActive, // Style for active item
         "pl-2": isSubItem, // Indent sub-items slightly
         // Example: 'last:border-b-0': isSubItem // Potentially remove border for last sub-item if needed
       }
     )}
     // Add aria-current for accessibility on active links
     aria-current={isActive ? 'page' : undefined}
   >
     {/* Icon container */}
     <span className={cn("mr-3", isActive ? "text-purple-700" : "text-purple-500")}>
       {icon}
     </span>
     {/* Text label */}
     <span>{text}</span>
   </Link>
 )
}