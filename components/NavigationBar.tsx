"use client" // Necessary because we're using hooks (useState, useRouter)

 import type React from "react"
 import { useState } from "react"
 import Link from "next/link"
 import { useRouter } from 'next/router' // Import useRouter
 import { Menu, Search, X, MapPin, Award, Utensils, Building } from "lucide-react"
 import { LiaBasketballBallSolid, LiaBathSolid, LiaCrownSolid } from 'react-icons/lia';
 import cn from 'classnames'
 import Image from 'next/image';

 export default function Navbar() {
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [isSearchOpen, setIsSearchOpen] = useState(false)
   const [searchTerm, setSearchTerm] = useState('');

   const router = useRouter(); // Initialize router

   // Handlers for state toggling
   const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
   const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

   // Handler for search input changes
   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Added type annotation
       setSearchTerm(event.target.value);
     };

   // Close menu when search opens and vice-versa for better mobile UX
   const handleToggleMenu = () => {
     if (isSearchOpen) setIsSearchOpen(false);
     setIsMenuOpen(!isMenuOpen);
   };

   const handleToggleSearch = () => {
     if (isMenuOpen) setIsMenuOpen(false);
     setIsSearchOpen(!isSearchOpen);
     // Optionally clear search term when closing search, or focus input when opening
     // if (!isSearchOpen) setSearchTerm(''); // Example: Clear on close
   };

   // Handler for submitting the search form
   const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => { // Added type annotation
     event.preventDefault(); // Prevent default form submission (page reload)
     if (searchTerm.trim()) {
       // Navigate to search results page
       router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
       setIsSearchOpen(false); // Optionally close search overlay after submission
       setSearchTerm('');     // Optionally clear search term after submission
     }
   };

   return (
     <nav className="sticky top-0 z-50 w-full bg-slate-50 shadow-sm">
       {/* Mobile Search Overlay */}
       {isSearchOpen && (
         // --- MODIFICATION START ---
         // Wrap the overlay content in a form to handle submission
         <form
           onSubmit={handleSearchSubmit}
           className="absolute inset-0 z-30 flex items-center justify-center bg-slate-50 p-4 md:hidden"
           aria-label="Mobile search form"
         >
           <div className="relative w-full">
             <input
               type="text"
               placeholder="Search..."
               className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
               value={searchTerm} // Bind value to state
               onChange={handleSearchChange} // Update state on change
               autoFocus // Automatically focus the input when overlay opens
             />
             {/* Close button - ensure type="button" to prevent form submission */}
             <button
               type="button" // Important: Prevents form submission
               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
               onClick={handleToggleSearch} // Closes the search overlay
               aria-label="Close search"
             >
               <X size={18} />
             </button>
             {/* You could add an explicit submit button here if needed, e.g.:
             <button type="submit" className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Submit search">
                <Search size={18} />
             </button>
             But usually, the keyboard's "Go/Search" action is sufficient for mobile.
             Adjust padding-right (pr-10) on input if adding another button.
             */}
           </div>
         </form>
         // --- MODIFICATION END ---
       )}

       <div className="mx-auto flex max-w-[99rem] items-center justify-between px-4 py-3">
         {/* Logo */}
         <div className="flex items-center">
           <Link href="/" className="flex items-center">
             <div className="mr-2 flex h-10 w-10 items-center justify-center ">
               <span className="font-bold ">
                   <Image
                           className="rounded-xl"
                           src="/icon/icon.jpg"
                           alt="MTW icon"
                           width={45}
                           height={45}
                         />
                         </span>
             </div>
             <span className="hidden font-space-grotesk text-base font-medium 2xl:block">meet the whytes</span>
           </Link>
         </div>

         {/* Desktop Search */}
         {/* Note: Desktop search already uses the handlers correctly */}
         <form onSubmit={handleSearchSubmit} className="ml-4 hidden flex-1 max-w-md md:ml-6 md:block">
           <div className="relative">
             <input
               type="text"
               placeholder="Search..."
               className="w-full rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
               value={searchTerm}
               onChange={handleSearchChange}
             />
             {/* Desktop clear/submit button - can be enhanced */}
             <button
                // Changed to type="submit" to also submit form on click
                type="submit"
                // Removed onClick={() => setSearchTerm('')} - submit handles it
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="Submit search" // Updated aria-label
             >
               <Search size={18} />
             </button>
           </div>
         </form>

         {/* Mobile Search Button (Toggles the overlay) */}
         {/* This button just OPENS the search, it doesn't submit */}
         <button
            type="button" // Good practice: explicitly set type="button"
            className="ml-auto mr-2 md:hidden"
            onClick={handleToggleSearch} // Opens the overlay
            aria-label="Open search" // Changed label for clarity
         >
           <Search size={20} />
         </button>

         {/* Mobile Menu Button */}
         <button
            type="button" // Good practice
            className="md:hidden"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
         >
           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>

         {/* Desktop Navigation */}
         <div className="hidden items-center space-x-1 md:flex lg:space-x-4">
           <NavItem href="/arenas" icon={<LiaBasketballBallSolid size={22} />} text="NBA & WNBA Arenas" />
           <NavItem href="/picks" icon={<LiaCrownSolid size={22} />} text="Our Top Picks" />
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
             "-translate-y-full opacity-0 !pointer-events-none": !isMenuOpen, // Ensure menu is hidden visually and functionally
           }
         )}
       >
         <div className="flex flex-col p-4">
           <MobileNavItem href="/arenas" icon={<LiaBasketballBallSolid size={18} />} text="NBA & WNBA Arenas" onClick={toggleMenu}/>
           <MobileNavItem href="/picks" icon={<LiaCrownSolid size={18} />} text="Our Top Picks" onClick={toggleMenu}/>
           <MobileNavItem href="/hotels" icon={<Building size={18} />} text="Hotel Reviews" onClick={toggleMenu}/>
           <MobileNavItem href="/food" icon={<Utensils size={18} />} text="Food Reviews" onClick={toggleMenu}/>
           <MobileNavItem href="/guides" icon={<MapPin size={18} />} text="Guides" onClick={toggleMenu}/>
         </div>
       </div>
     </nav>
   )
 }

 // --- Helper Components (NavItem, MobileNavItem) remain the same ---
 // Updated NavItem component
 function NavItem({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  const router = useRouter();
  const isActive = router.pathname === href || (href !== '/' && router.pathname.startsWith(href + '/'));

  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gradient-to-r from-pink-100 to-orange-100",
        {
          "text-purple-600": isActive,
        }
      )}
    >
      <span className={cn("mb-1", isActive ? "text-purple-600" : "text-purple-500")}>{icon}</span>
      <span>{text}</span>
      {isActive && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-3/5 -translate-x-1/2 transform rounded-full bg-purple-500"></span>
      )}
    </Link>
  )
 }

 // Updated MobileNavItem component
 function MobileNavItem({ href, icon, text, onClick }: { href: string; icon: React.ReactNode; text: string; onClick: () => void }) {
  const router = useRouter();
  const isActive = router.pathname === href || (href !== '/' && router.pathname.startsWith(href + '/'));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center border-b border-gray-100 py-3 text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-100",
        {
          "bg-purple-50 text-purple-700 font-medium": isActive,
        }
      )}
    >
      <span className={cn("mr-3", isActive ? "text-purple-700" : "text-purple-500")}>
        {icon}
      </span>
      <span>{text}</span>
    </Link>
  )
 }

 // Make sure you have a [..search].js or similar route file under pages/search
 // to handle the /search?q=... route.
 // Example pages/search.js (very basic):
 /*
 import { useRouter } from 'next/router';

 export default function SearchResults() {
   const router = useRouter();
   const { q } = router.query;

   return (
     <div>
       <h1>Search Results for: {q}</h1>
       {/* Add logic to fetch and display search results here *}
     </div>
   );
 }
 */