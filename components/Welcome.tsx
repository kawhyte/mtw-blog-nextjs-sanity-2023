import { Blockquote } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import {
  Book,
  Code,
  Coffee,
  Dumbbell,
  Footprints,
  Gamepad,
  Luggage,
  Pizza,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { FaCode } from 'react-icons/fa6'
import { FiCoffee } from 'react-icons/fi'
import { IoGameControllerOutline } from 'react-icons/io5'
import { PiBarbell } from 'react-icons/pi'
import { PiHamburger } from 'react-icons/pi'
import { PiSuitcaseRolling } from 'react-icons/pi'
import { SiNike } from 'react-icons/si'
import { SlNotebook } from 'react-icons/sl'

import AvatarCard from './AvatarCard'
import SectionTitle from './SectionTitle'

const places = [
  {
    title: 'Jamaica',
    icon: '🇯🇲',
  },
  {
    title: 'Netherlands',
    icon: '🇳🇱',
  },
  {
    title: 'United States',
    icon: '🇺🇸',
  },

  {
    title: 'Denmark',
    icon: '🇩🇰',
  },
  {
    title: 'Finland',
    icon: '🇫🇮',
  },
  {
    title: 'Mexico',
    icon: '🇲🇽',
  },
  {
    title: 'Sweden',
    icon: '🇸🇪',
  },
  {
    title: 'The Bahamas',
    icon: '🇧🇸',
  },
  {
    title: 'Indonesia',
    icon: '🇮🇩',
  },
  {
    title: 'France',
    icon: '🇫🇷',
  },
  {
    title: 'United Kingdom',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },

  {
    title: 'Japan',
    icon: '🇯🇵',
  },
  {
    title: 'Canada',
    icon: '🇨🇦',
  },
  {
    title: 'Puerto Rico',
    icon: '🇵🇷',
  },
]

const duo = [
  {
    id: 1,
    color: 'indigo',
    name: 'Mr. Whyte',

    image: '/avatar_mr.png',
    favorite: [
      { id: 3, name: 'Coding', img: <FaCode className="h-7 w-7 " /> },
      {
        id: 4,
        name: 'Games',
        img: <IoGameControllerOutline className="h-7 w-7 " />,
      },
      { id: 5, name: 'Coffee', img: <FiCoffee className="h-7 w-7 " /> },
      { id: 6, name: 'Sneakers', img: <SiNike className="h-7 w-7" /> },
    ],
    quote_by: ' - Oscar Wilde',
    quote: 'Be yourself; everyone else is already taken.',
  },
  {
    id: 2,
    color: 'pink',
    name: 'Mrs. Whyte',
    image: '/avatar_mrs.png',
    favorite: [
      { id: 7, name: 'Burgers', img: <PiHamburger className="h-7 w-7" /> },
      { id: 8, name: 'Reading', img: <SlNotebook className="h-7 w-6" /> },
      { id: 3, name: 'Travel', img: <PiSuitcaseRolling className="h-7 w-7" /> },
      { id: 6, name: 'Weightlifting', img: <PiBarbell className="h-7 w-7 " /> },
    ],
    quote_by: '- Frank Zappa',
    quote: 'So many books, so little time',
  },
]

const size = 'h-10 w-10'

const favorite = [
  { id: 7, name: 'Burgers', img: <PiHamburger className="h-8 w-8" /> },
  { id: 8, name: 'Reading', img: <SlNotebook className="h-8 w-7" /> },
  { id: 3, name: 'Traveling', img: <PiSuitcaseRolling className="h-8 w-8" /> },
  { id: 6, name: 'Weightlifting', img: <PiBarbell className="h-7 w-7 " /> },
  { id: 3, name: 'Coding', img: <FaCode className="h-7 w-6 " /> },
  {
    id: 4,
    name: 'Retro Games',
    img: <IoGameControllerOutline className="h-7 w-7 " />,
  },
  { id: 5, name: 'Coffee', img: <FiCoffee className="h-7 w-7 " /> },
  { id: 6, name: 'Sneakers', img: <SiNike className="h-7 w-7" /> },
]

function Welcome() {
  const interests = [
    { icon: Pizza, label: 'Pizza' },
    { icon: Book, label: 'Reading' },
    { icon: Luggage, label: 'Traveling' },
    { icon: Code, label: 'Coding' },
    { icon: Gamepad, label: 'Retro Games' },
    { icon: Coffee, label: 'Coffee' },
    { icon: Footprints, label: 'Sneakers' },
    { icon: Dumbbell, label: 'Weightlifting' },
  ]

  const countries = [
    { code: 'CA', name: 'Canada' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'MX', name: 'Mexico' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'SE', name: 'Sweden' },
    { code: 'BS', name: 'The Bahamas' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
  ]

  return (
    <>
      <div className="container mx-auto space-y-6">
        <header className=" mx-auto mb-12 ">
          <SectionTitle
            header={'Meet the Dynamic Duo'}
            description={`
                
                Hi! We are the Whytes. Welcome to our space on the
              interwebs. We are a
              husband 👖 and wife 👗 duo. We love to travel, relax & try new
              food.`}
          />
        </header>

        <div className="max-w-8xl grid w-full grid-cols-2 place-items-center gap-4 md:grid-cols-2">
          {/* Mr. Whyte Card */}

          <AvatarCard data={duo[0]} />
          {/* <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <h2 className="text-2xl font-bold text-indigo-600">Mr. Whyte</h2>
          </div>
          <blockquote className="text-gray-600 italic">
            "Be yourself; everyone else is already taken. - Oscar Wilde"
          </blockquote>
        </div> */}

          {/* <div className="p-6  rounded-3xl w-full  outline  bg-[#fff5e6]">
          <h2 className={`${oswald.variable}  title-font my-4  font-heading   text-gray-900 sm:text-2xl lg:text-3xl font-bold mb-6`}>Things we like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <item.icon className="w-6 h-6" />
                <span className="text-sm text-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div> */}

          {/* Mrs. Whyte Card */}
          <AvatarCard data={duo[1]} />

          {/* <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 justify-end">
            <h2 className="text-2xl font-bold text-pink-600">Mrs. Whyte</h2>
            <div className="w-16 h-16 rounded-full bg-gray-200" />
          </div>
          <blockquote className="text-gray-600 italic">
            "So many books, so little time - Frank Zappa"
          </blockquote>
        </div> */}
        </div>

        {/* Interests Card */}
        <div className="max-w-8xl w-full rounded-3xl bg-[#fff5e6] p-6">
          <h2
            className={`${oswald.variable}  title-font my-4  mb-6   font-heading font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl`}
          >
            Things we like
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm"
              >
                <item.icon className="h-6 w-6" />
                <span className="text-nowrap text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Countries Card */}
        <div className="max-w-8xl w-full rounded-3xl bg-[#f0f7ff] p-6">
          <h2
            className={`${oswald.variable}  title-font my-4  mb-6   font-heading font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl`}
          >
            Countries we&apos;ve visited
          </h2>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm"
              >
                <img
                  src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                  alt={`${country.name} flag`}
                  className="h-3 w-4 object-cover"
                />
                <span className="text-sm">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="     ">
        <div className="xl:max-w-9xl rounded-xl px-4   pb-6">
          <header className=" mx-auto mb-12 ">
            <SectionTitle
              header={'Meet the Dynamic Duo'}
              description={`
                
                Hi! We are the Whytes. Welcome to our space on the
              interwebs. We are a
              husband 👖 and wife 👗 duo. We love to travel, relax & try new
              food.
                        
                        `}
            />
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-10 ">
            
           
            <AvatarCard data={duo[0]} />

            <div className="col-span-4 rounded-xl bg-orange-100 pl-6 pt-3">
              <p
                className={`${oswald.variable}  title-font my-4  font-heading text-xl font-medium  text-gray-900 sm:text-2xl`}
              >
                Things we like
              </p>

              <div className="mb-6 mr-2 mt-5 grid  grid-cols-3 gap-y-4 md:grid-cols-4 ">
                {favorite?.map((item) => (
                  <div
                    key={item.id}
                    className=" flex flex-col items-center gap-2   rounded-lg  px-1 align-middle "
                  >
                    <span>{item.img} </span>
                    <span
                      className={`text-nowrap whitespace-nowrap rounded-full   px-2  text-xs    font-extralight  text-gray-500 `}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <AvatarCard data={duo[1]} />
           


            

            <div className="col-span-10 rounded-xl bg-blue-100 pl-6 pt-3 ">
              <p
                className={`${oswald.variable}  title-font my-2  font-heading text-xl font-medium  text-gray-900 sm:text-2xl`}
              >
                Countries we&apos;ve visited
              </p>

              <div
                className={
                  'min-w-sm max-w-8xl  my-6 mr-5 grid grid-cols-2  gap-4 md:grid-cols-3 lg:grid-cols-7'
                }
              >
                {places
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-row items-center gap-2   rounded-lg  px-1 align-middle outline outline-2 outline-gray-500"
                    >
                      <span className="text-3xl"> {item.icon}</span>
                      <span className="text-xs font-semibold">
                        {item.title}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            


            <div className="col-span-2 rounded-xl  ">
              
            </div>
          </div>

          
        </div>
      </div> */}
    </>
  )
}

export default Welcome
