import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoRestaurantOutline } from 'react-icons/io5'
import { LiaCrownSolid } from 'react-icons/lia'
import { PiSneakerLight } from 'react-icons/pi'
import { RiHotelLine } from 'react-icons/ri'
import { TfiMapAlt } from 'react-icons/tfi'

const category = [
  {
    name: 'All Hotel Reviews',
    href: '/hotel',
    image: <RiHotelLine className="h-6 w-10  text-pink-500" />,
    // image:
    // 	"https://res.cloudinary.com/babyhulk/image/upload/c_scale,w_880/v1634776268/project/PXL_20210905_004151576.MP.webp",
    text: 'City skyline',
    alt: 'City skyline',
    bgcolor: ' text-pink-500  hover:bg-pink-100 ',
  },

  {
    name: 'All Food Reviews ',
    href: '/food',
    image: <IoRestaurantOutline className="h-6 w-10  text-green-500" />,
    // image:
    // 	"https://res.cloudinary.com/babyhulk/image/upload/v1621897187/project/MVIMG_20191203_091517.webp",
    text: 'Hotel icon',
    alt: 'View of Food',
    bgcolor: 'text-green-500 hover:bg-green-100 ',
  },
  {
    name: ' Guides',
    href: '/guide',
    image: <TfiMapAlt className="h-6 w-10   text-indigo-500 " />,
    // image:
    // 	"https://res.cloudinary.com/babyhulk/image/upload/v1621896780/project/PXL_20210428_025517322.MP.webp",
    text: 'Sunset',
    alt: 'View of Sunset at a hotel',
    bgcolor: 'text-indigo-500 hover:bg-indigo-100 ',
  },
  // {
  //   name: 'Stuff We Like',
  //   href: '/stuff_we_like',
  //   image: <PiSneakerLight className="h-6 w-10   text-pink-500" />,
  //   image2:"|",
  //   // image:
  //   // 	"https://res.cloudinary.com/babyhulk/image/upload/v1621897765/project/PXL_20210222_215622925.MP.webp",
  //   text: 'Hotel icon',
  //   alt: 'View of mountains',
  //   bgcolor:
  //     ' hover:bg-pink-100 text-pink-500',
  // },
]

function Categories() {
  return (
    <>
      <section className=" xl:block container mx-auto   flex-col  text-center   w-2/4 ">
        <div className=" border w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer max-w-5xl">
          <div className=" container mx-auto px-1 py-3   ">
            <div className="relative  text-center  grid  grid-cols-4  gap-2 place-items-center   lg:grid-cols-4   ">
              {category.map((item) => (
                <div key={item.href}>
                  <Link
                    key={item.name}
                    href={item.href}
                    className="cursor-pointer"
                    passHref
                    legacyBehavior
                  >
                    <span
                      className={`flex flex-row items-center text-base content-between text-gray-600 p-1 pr-4 pl-2 rounded-full ${item.bgcolor} `}
                    >
                      {item.image}
                      {item.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Categories
