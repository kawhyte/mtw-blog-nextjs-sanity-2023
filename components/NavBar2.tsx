/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import {  inter, roboto_mono } from 'app/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { IoRestaurantOutline } from 'react-icons/io5'
import { LiaCrownSolid } from 'react-icons/lia'
import { PiSneakerLight } from "react-icons/pi";
import { RiHotelLine } from 'react-icons/ri'
import { TfiMapAlt } from 'react-icons/tfi'

import BodySectionSeparator from './IndexTopTen'
import SectionSeparator from './SectionSeparator'
import { Box, NavLink } from '@mantine/core'



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
  // {
  //   name: 'Stuff We Like',
  //   href: '/stuff_we_like',
  //       icon: <PiSneakerLight className="h-6 w-10  text-gray-500" />,

   
  //   text: 'Man walking',
  //   bg: bg,
  //   current: false,
  // },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav({ color = 'bg-black', bgColor }) {



  const data = [
    { icon: <LiaCrownSolid className="h-6 w-10  text-gray-500" />, label: 'Dashboard', description: 'Item with description' },
    {
      icon: <RiHotelLine className="h-6 w-10  text-gray-500" />,
      label: 'Security',
      rightSection: <RiHotelLine className="h-6 w-10  text-gray-500" />,
    },
    { icon: <RiHotelLine className="h-6 w-10  text-gray-500" />, label: 'Activity' },
  ];
  


  const [active, setActive] = useState(0);

  const items = data.map((item, index) => (
    <NavLink
      key={item.label}
      active={index === active}
      label={item.label}
      description={item.description}
      rightSection={item.rightSection}
      
      //  icon={<item.icon size="1rem" stroke={1.5} />}
      onClick={() => setActive(index)}
    />
  ));

  return (







   
    
      <Box w={220}>{items}</Box>


    
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
