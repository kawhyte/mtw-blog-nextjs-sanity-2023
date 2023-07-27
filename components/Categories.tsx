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
    bgcolor:
      'pr-4 pl-2 py-2  flex items-center text-base rounded-full text-pink-500 border border-pink-500 cursor-pointer  hover:bg-pink-100 ',
  },

  {
    name: 'All Food Reviews',
    href: '/food',
    image: <IoRestaurantOutline className="h-6 w-10  text-green-500" />,
    // image:
    // 	"https://res.cloudinary.com/babyhulk/image/upload/v1621897187/project/MVIMG_20191203_091517.webp",
    text: 'Hotel icon',
    alt: 'View of Food',
    bgcolor:
      'pr-4 pl-2 py-2  flex items-center text-base rounded-full text-green-500 border border-green-500 cursor-pointer hover:bg-green-100 ',
  },
  {
    name: 'All Guides',
    href: '/story',
    image: <TfiMapAlt className="h-6 w-10   text-indigo-500 " />,
    // image:
    // 	"https://res.cloudinary.com/babyhulk/image/upload/v1621896780/project/PXL_20210428_025517322.MP.webp",
    text: 'Sunset',
    alt: 'View of Sunset at a hotel',
    bgcolor:
      'pr-4 pl-2 py-2 flex items-center text-base rounded-full text-indigo-500 border border-indigo-500 cursor-pointer hover:bg-indigo-100 ',
  },
  {
    name: 'Stuff We Like',
    href: '/allreviews',
    image: <PiSneakerLight className="h-6 w-10   text-pink-500" />,
    // image:
    // 	"https://res.cloudinary.com/babyhulk/image/upload/v1621897765/project/PXL_20210222_215622925.MP.webp",
    text: 'Hotel icon',
    alt: 'View of mountains',
    bgcolor:
      'pr-4 pl-2 py-2 flex items-center text-base rounded-full text-pink-500 border border-pink-500 cursor-pointer hover:bg-pink-100 ',
  },
]

function Categories() {
  return (
    <>
      <section className="my-8  text-gray-600 bg-yellow-50 ">
        <div className="container mx-auto px-5 py-10 ">


          <div className="  ">
            <div className="relative  grid  grid-cols-2 gap-4 lg:gap-0 place-items-center   md:grid-cols-2 lg:grid-cols-4  ">
              {category.map((item) => (
                <div key={item.href}>
                  <Link
                    key={item.name}
                    href={item.href}
                    className="cursor-pointer"
                    passHref
                    legacyBehavior
                  >
                    <span className={item.bgcolor}>
                      {item.image}
                      {item.name}
                    </span>
                  </Link>

                  {/* 
                                <div className='relative   rounded-xl overflow-hidden  block'>
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className='relative cursor-pointer'
                                        passHref
                                        legacyBehavior>

                                            {item.image} */}
                  {/* <Image
                                            height={286}
                                            width={286}
                                            // blurDataURL={item.image}
                                            placeholder='blur'
                                            className='h-40 cursor-pointer rounded-xl w-full  object-cover object-center mb-6'
                                            src={item.image}
                                            alt={item.text}
                                            quality={50}
                                        /> */}
                  {/* </Link>
                                </div>
                                 */}

                  {/* <Link
                                    key={item.name}
                                    href={item.href}
                                    className='relative cursor-pointer'
                                    passHref
                                    legacyBehavior>
                                    <p className='  text-gray-700 text-xl cursor-pointer '>
                                        {item.name}
                                    </p>
                                </Link> */}
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
