/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { IoRestaurantOutline } from 'react-icons/io5'
import { LiaCrownSolid } from 'react-icons/lia'
import { PiSneakerLight } from "react-icons/pi";
import { RiHotelLine } from 'react-icons/ri'
import { TfiMapAlt } from 'react-icons/tfi'

import BodySectionSeparator from './IndexTopTen'
import SectionSeparator from './SectionSeparator'


 const bg = '  underline decoration-pink-200 underline-offset-8 hover:decoration-pink-500/50 focus:decoration-pink-500/50 '
const navigation = [
  {
    name: 'Our Top Picks',
    href: '/top_picks',
    icon: <LiaCrownSolid className="h-6 w-10  text-gray-500" />,
    text: 'Book icon',
    bg: '  underline  decoration-yellow-200 underline-offset-8 hover:decoration-yellow-500/50 focus:decoration-yellow-500/50',
    current: false,
  },
  {
    name: 'Hotel Reviews',
    href: '/hotel',
    icon: <RiHotelLine className="h-6 w-10  text-gray-500" />,
    text: 'Hotel icon',
    bg: ' underline decoration-pink-200 underline-offset-8 hover:decoration-pink-500/50 focus:decoration-pink-500/50',
    current: false,
  },
  {
    name: 'Food Reviews',
    href: '/food',
    icon: <IoRestaurantOutline className="h-6 w-10  text-gray-500" />,
    text: 'Food icon',
    bg: ' underline decoration-green-200 underline-offset-8 hover:decoration-green-500/50 focus:decoration-green-500/50',
    current: false,
  },
  {
    name: 'Guides',
    href: '/story',
    icon: <TfiMapAlt className="h-6 w-10   text-gray-500 " />,
    text: 'Book icon',
    bg: ' underline decoration-indigo-200  underline-offset-8 hover:decoration-indigo-500/50 focus:decoration-indigo-500/50',
    current: false,
  },
  {
    name: 'Stuff We Like',
    href: '/allreviews',
        icon: <PiSneakerLight className="h-6 w-10  text-gray-500" />,

    // icon: '/icon/walk.svg', PiSneakerLight
    text: 'Man walking',
    bg: bg,
    current: false,
  },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav({ color = 'bg-black', bgColor }) {
  let col = color ? ' text-gray-900' : ' text-white'
  let bg = bgColor ? ' bg-white  shadow-l' : ' '
  const container = useRef(null)
  const animation = 'food.json'

  return (
    <Disclosure
      as="nav"
      className={
        ' mt- blur-backdrop-filter   max-w-8xl firefox:bg-opacity-90 sticky top-0 z-50 mx-auto h-[72px]  w-full   whitespace-nowrap bg-transparent bg-white   bg-opacity-50 bg-clip-padding py-4 pt-6 backdrop-blur-sm backdrop-filter xl:px-1  ' +
        bg
      }
    >
      {({ open }) => (
        <>
          <div className="max-w-8xl  container mx-auto cursor-pointer">
            <div className="relative flex h-6 items-center justify-between">
              <div className="absolute -top-2 right-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className=" inline-flex items-center justify-center rounded-md bg-gray-700 p-2 text-gray-200  hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="">
                <Link
                  href="/"
                  className="cursor-pointer"
                  passHref
                  legacyBehavior
                >
                  <div className="flex flex-shrink-0 items-center justify-center  ">
                    <div className="pl-2 ">
                      <Image
                        className="rounded-xl"
                        src="/icon/icon.jpg"
                        alt="MTW icon"
                        width={45}
                        height={45}
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch md:justify-end ">
                <div className="hidden sm:ml-6 md:block">
                  <div className="flex flex-row items-center justify-center space-x-4  align-middle">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={` + flex flex-col items-center justify-center rounded-xl px-4 py-2  align-middle decoration-[0.25rem] hover:decoration-[0.5rem] focus:decoration-[0.5rem] motion-safe:transition-all motion-safe:duration-200 ${item.bg} `}
                        >
                          {item.icon}
                          {/* {item.icon && (
                              <Image
                                className="mr-2"
                                src={item.icon}
                                alt={item.text}
                                width={25}
                                height={25}
                              />
                            )} */}

                          <div className={`  text-blackgroup-hover:opacity-600 mt-1 text-sm text-gray-600 `}>
                            {item.name}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden ">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-black hover:bg-gray-700 hover:text-white',
                    'block rounded-md bg-green-100 px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
          

   
        </>
      )}
    </Disclosure>
  )
}

{
  /*
		name: "Stories/Guides",
		href: "/story",
		icon: "/icon/book.svg",
		text: "Book icon",
		current: false,
	*/
}

{
  /* <Link
className={` + flex flex-row items-center justify-center rounded-xl px-2 py-2  align-middle decoration-[0.25rem] hover:decoration-[0.5rem] focus:decoration-[0.5rem] motion-safe:transition-all motion-safe:duration-200 ${item.bg}`}
href={item.href}
key={item.name}

>
<a>  {item.icon && (
  <Image
    className="mr-2"
    src={item.icon}
    alt={item.text}
    width={25}
    height={25}
  />
)}
{item.name}</a> 
</Link> */
}
