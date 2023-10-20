import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import Link from 'next/link'
import React from 'react'

let essentials = [
  {
    name: 'Comfortable Shoes',
    url: '/presto.webp',
    bg: ' bg-yellow-50',
    description: 'Comfortable shoes are a must-have for every traveler.',
    our_pick: 'Nike Presto',
    link: 'https://www.nike.com/w/presto-shoes-9o4cyzy7ok',
    badges: [

      { emoji: '🦓', label: 'Onsite zoo' },
      { emoji: '🌊', label: 'long walks' },
      { emoji: '🌲', label: 'Nature' },
      { emoji: '🤽', label: 'Water sports' },
    ],
  },
  {
    name: 'Sunscreen',
    url: '/sunscreen.webp',
    bg: ' bg-green-50',
    description: 'Sunscreen is the most important skincare product you can use.',
    our_pick: 'Black Girl Sunscreen',
    link: 'https://www.blackgirlsunscreen.com/',
    badges: [
      { emoji: '☀️', label: 'Sunny weather' },
   
      { emoji: '🌊', label: 'Long walks' },
      { emoji: '🌲', label: 'Nature' },
      { emoji: '🤽', label: 'Water sports' },
    ],
  },
  {
    name: 'Travel Kettle',
    url: '/kettle.png',
    bg: ' bg-pink-50',
    description: 'Great for a hot cup of tea or coffee on the go. ',
    our_pick: 'Brentwood  Kettle',
    link: 'https://www.amazon.com/gp/product/B07NMT99NB/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1',
    badges: [
      { emoji: '☀️', label: 'Sunny weather' },
      { emoji: '🦓', label: 'Onsite zoo' },
      { emoji: '🌊', label: 'Sea' },
      { emoji: '🌲', label: 'Nature' },

    ],
  },
  {
    name: 'Cable Organizers',
    url: '/wire_bag.png',
    bg: ' bg-blue-50',
    description: 'Keep your electronic accessories organized and tangle-free.',
    our_pick: 'Bubm Cable Bag',
    link: 'https://www.amazon.com/Organizer-BUBM-Electronics-Accessory-Organizer-Grey/dp/B01IPJPGW4?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=A14U021DT5YCUR&th=1',
    badges: [

      { emoji: '🌲', label: 'Nature' },
      { emoji: '🤽', label: 'Water sports' },
    ],
  },
  {
    name: 'Portable Power',
    url: '/anker.png',
    bg: ' bg-indigo-50',
    description: ' Recharge electronic devices on the go. ',
    our_pick: 'Iniu Portable Charger',
    link: 'https://www.amazon.com/gp/product/B08MZG8TN8/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1',
    badges: [
      { emoji: '☀️', label: 'Sunny weather' },
      { emoji: '☀️', label: 'day trips' },
    ],
  },
  {
    name: 'Backpack',
    url: '/rei.png',
    bg: ' bg-green-50',
    description: 'A good travel backpack is perfect for short trips.',
    our_pick: 'REI Co-op backpack',
    link: 'https://www.rei.com/b/rei-co-op/c/travel-backpacks?ir=category%3Atravel-backpacks&r=c%3Bb',
    badges: [
      { emoji: '☀️', label: 'day trips' },
      { emoji: '🦓', label: 'Onsite zoo' },
    ],
  },
]

function Welcome() {
  return (
    <>
      <section className="container mx-auto  py-14 text-gray-600 ">
        <div className="container mx-auto px-5 py-24 pt-16">
          <div className="mb-20 flex w-full  justify-between">
            <div>
              <h1
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Our Travel Essentials Picks
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
              <p
                className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
              >
        
                Traveling is a great way to experience new cultures and see the world. However, packing for a trip can be daunting, especially if you are trying to pack light. Here are a few travel essentials that you should never leave home without:
              </p>
            </div>

            {/* <div className="mt-4 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Link href="/stuff_we_like" passHref legacyBehavior>
                  <button
                    type="button"
                    className={`${inter.variable} font-secondary py-2 px-4 text-gray-500 hover:underline  w-full transition ease-in duration-200 text-center text-xs md:text-base font-semibold`}
                  >
                  Show all
                  </button>
                </Link>
              </div>
            </div>  */}
          </div>

          <div className="  grid grid-cols-1 content-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 ">
            {essentials.map((item) => (
              <>
                <div className="mx-auto max-w-2xl">
                  <div
                    className={`${item.bg}  max-w-sm rounded-lg shadow-md  dark:border-gray-700 `}
                  >
                    {/* <p
                      className={`px-5 pt-5 text-xs font-black tracking-tight text-gray-500 md:text-base `}
                    >
                      {item.name}
                    </p> */}
                    <Link href={item.link}>
                      <img
                        className=" transition-all hover:translate-x-3  hover:translate-y-2 hover:duration-700 md:p-8"
                        src={item.url}
                        alt="product image"
                      />

                      <Card.Section className={'mx-2'} mt="md">
                        <Group>
                          <Badge
                            size="lg"
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                          >
                            {item.our_pick}
                          </Badge>
                        </Group>
                        <Text fz="sm" mt="xs" className=''>
                          {item.description}
                        </Text>
                      </Card.Section>
{/* 
                      <Card.Section className={'pl-2'}>
                        <Text mt="sm" className={'pl-2 text-sm pb-2'} c="dimmed">
                          Perfect for
                        </Text>
                        <Group mt={3}>
                          {item.badges.map((badge) => (
                            <Badge
                              variant="light"
                              key={badge.label}
                              leftSection={badge.emoji}
                            >
                              {badge.label}
                            </Badge>
                          ))}
                        </Group>
                      </Card.Section> */}

                      <div className="flex flex-col px-5 pb-5 text-sm">
                        {/* <p className=" px-2  text-center text-xs font-normal  tracking-tight text-gray-500 md:text-sm">
                          Our Pick
                        </p>
                        <p className="px-2 py-2 text-center text-xs font-normal   tracking-tight text-pink-400 hover:text-pink-600 md:text-sm  ">
                          {item.description}
                        </p> */}

                        {/* <div className="mb-5 mt-2.5 flex items-center">
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="ml-3 mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
                          5.0
                        </span>
                      </div> */}
                      </div>
                    </Link>
                  </div>
                </div>

                {/* <div key={item.name} className="group  relative cursor-pointer overflow-hidden ">
                  <div className=" hidden pt-30 absolute   inset-x-0 z-50 cursor-pointer  items-end rounded-xl bg-transparent  text-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 lg:block">
                    <div className="translate-y-2   transform  space-y-3 p-4 pb-10 text-xs transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 md:text-sm">
                      <div className="flex content-center text-xs  justify-center rounded-lg bg-red-50 align-middle font-bold">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <img
                    alt={item.name}
                    className="flex h-full w-full content-end justify-center  object-scale-down object-center align-bottom"
                    src={item.url}
                  />
                </div> */}
                {/* <Box maw={240} mx="auto">
                  <Image
                    radius="md"
                    src={item.url}
                    alt={item.name}
                    caption={item.name}
                  />
                </Box> */}
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Welcome
