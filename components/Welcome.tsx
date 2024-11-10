import { Blockquote } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
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
    title: 'Denmark',
    icon: '🇩🇰',
  },
  {
    title: 'USA (Hawaii)',
    icon: '🇺🇸',
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
    title: 'England',
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

    image: '/avatar_mr3.png',
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
    image: '/avatar_mrs3.png',
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
  return (
    <>
      <div className="     ">
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

          <div className=" grid gap-6 lg:grid-cols-5 ">
            <AvatarCard data={duo[0]} />
            {/* <div className="col-span-2  rounded-3xl bg-gray-200 outline  ">
              <div className="flex flex-col items-center pb-12 pl-8 pt-4  ">
                <img
                  src={duo[0].image}
                  className=" w-64 h-64 max-w-full "
                  alt="title image"
                />
                <div className="flex flex-col -mt-6">
                  <p
                    className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium text-${duo[0].color}-500 text-gray-900 sm:text-4xl`}
                  >
                    {duo[0].name}
                  </p>

                 
                </div>
              </div>

              <div className="-mt-10 mb-8 px-3 text-center">
                <span className=" mt-2 text-center  text-lg  font-extralight text-gray-500">
                  &quot;{duo[0].quote}&quot; {duo[0].quote_by}
                </span>
              </div>
            </div> */}

            <div className="col-span-3 rounded-xl bg-blue-100 pl-6 pt-3 ">
              <p
                className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium  text-gray-900 sm:text-4xl`}
              >
                Countries we&apos;ve visited
              </p>

              <div
                className={
                  'min-w-sm my-6  mr-5 grid max-w-3xl grid-cols-2  gap-4 md:grid-cols-3 lg:grid-cols-4'
                }
              >
                {places.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-row items-center gap-2   rounded-lg  px-1 align-middle outline outline-2 outline-gray-500"
                  >
                    {/*<span>
							 <div>
								<svg className='size-0 absolute'>
									<defs>
										<linearGradient id='icon-gradient'>
											<stop offset='0%' stopColor='rgb(134 239 172)  ' />
											<stop offset='100%' stopColor='rgb(187 247 208)' />
										</linearGradient>
									</defs>
									
								</svg>
							</div> 

						</span>*/}
                    <span className="text-3xl"> {item.icon}</span>
                    <span className="text-xs font-semibold">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-3 rounded-xl bg-orange-100 pl-6 pt-3">
              <p
                className={`${oswald.variable}  title-font my-4  font-heading text-3xl font-medium  text-gray-900 sm:text-4xl`}
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

            <div className="col-span-2 rounded-xl  ">
              {/* <div className="flex flex-col items-center  overflow-hidden pb-12 lg:relative  ">
                <img
                  src={duo[1].image}
                  className="mx-auto mt-3 h-auto w-32 max-w-full rounded-full bg-gray-200 p-3 grayscale"
                  alt="title image"
                />

                <p
                  className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium text-${duo[1].color}-500 text-gray-900 sm:text-4xl`}
                >
                  {duo[1].name}
                </p>
              </div>

              <div className="-mt-10 px-3">
                <span className=" ml-2 mt-2 text-center  text-sm  font-extralight text-gray-500">
                  &quot;{duo[1].quote}&quot; {duo[1].quote_by}
                </span>
              </div> */}
            </div>
          </div>

          {/* <div className=" mb-3 grid md:ml-20 lg:ml-0  lg:h-96 grid-cols-1  gap-3  justify-items-center md:gap-y-52 md:w-5/6 md:grid-cols-2  md:gap-x-20">
            {duo.map((person) => (
              <div key={person.id}>
                <div className="bg-white">
                  <div className="flex min-w-full items-center justify-center">
                    <div className="flex lg:relative">
                      
                   
                          <div className="lg:absolute hidden -left-4 -top-4 h-96 w-72  transform rounded-lg bg-yellow-100 transition-all"></div>
                          <div className="-left-8 -top-8 hidden h-96 w-72 transform rounded-lg  bg-green-100 transition-all lg:absolute lg:block"></div>
                          <div className="-left-12 -top-12 hidden h-96 w-72 transform rounded-lg  bg-purple-100 transition-all lg:absolute lg:block"></div>
                          <div className="-left-16 -top-16 hidden h-96 w-72 transform rounded-lg  bg-gray-300 transition-all lg:absolute lg:block"></div>
                          <div className="-left-20 -top-20   lg:flex  h-72 lg:h-96 w-72 transform  flex-col items-center justify-center rounded-lg border-4  border-black bg-white transition-all lg:absolute">
                     
                        
                        <div className="flex flex-col items-center  overflow-hidden pb-12 lg:relative  ">
                          <img
                            src={person.image}
                            className="mx-auto h-auto w-32 mt-3 max-w-full rounded-full bg-gray-200 p-3 grayscale"
                            alt="title image"
                          />

                          <p
                            className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium text-${person.color}-500 text-gray-900 sm:text-4xl`}
                          >
                            {person.name}
                          </p>
                        </div>

                        <div className="-mt-10 px-3">
                          <span className=" ml-2 mt-2 text-center  text-sm  font-extralight text-gray-500">
                            &quot;{person.quote}&quot; {person.quote_by}
                          </span>
                        </div>
                        <div className=" mb-2 mt-4 hidden  p-2  lg:block border-t">
                          <p className=" ml-2 mt- text-start  text-sm  font-extralight text-gray-500">
                            Likes:
                          </p>
                          <div className="text-nowrap mt-2 grid grid-cols-4 gap-x-4 gap-y-1 px-3">
                            {person.favorite?.map((item) => (
                              <div
                                key={item.id}
                                className=" text-nowrap flex flex-col items-center gap-x-2 text-center font-light leading-relaxed text-gray-500"
                              >
                                <span>{item.img} </span>
                                <span
                                  className={`text-nowrap rounded-full   px-2 py-1 text-xs    font-extralight  text-gray-500 `}
                                >
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* <section className="body-font text-gray-600 pt-24 md:pt-32 ">
        <div className=" container mx-auto px-5 ">
          <div className="-m-4 flex justify-evenly text-center ">
            {stats.map((item) => (
              <div key={item.id} className="w-full p-4 sm:w-1/2 md:w-1/4">
                <div key={item.id} className=" flex flex-col items-center  border-gray-200 px-4 py-6">
                  <img src={item.url} alt={item.name} width={200} />

                  <h2
                    className={` ${oswald.variable}  py-3 font-heading text-2xl font-medium  text-gray-900 md:text-4xl`}
                  >
                    {item.value}
                  </h2>
                  <p className="text-xs leading-relaxed md:text-base font-light ">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  )
}

export default Welcome
