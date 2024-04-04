import { Blockquote } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import React from 'react'

let duo = [
  {
    id: 1,
    color: 'indigo',
    name: 'Mr.',

    image: '/avatar_mr.png',
    favorite: [
      { id: 3, name: 'Sneakers', img: 'fav/sneakers.webp' },
      { id: 4, name: 'Retro Games', img: 'fav/videogame.webp' },
      { id: 5, name: 'Coffee', img: 'fav/coffee.webp' },
      { id: 6, name: 'Weightlifting', img: 'fav/weightlifting.webp' },
    ],
    quote_by: ' - Oscar Wilde',
    quote: 'Be yourself; everyone else is already taken.',
  },
  {
    id: 2,
    color: 'pink',
    name: 'Mrs.',
    image: '/avatar_mrs.png',
    favorite: [
      { id: 6, name: 'Weightlifting', img: 'fav/weightlifting.webp' },
      { id: 7, name: 'Pizza', img: 'fav/pizza.webp' },
      { id: 8, name: 'Reading', img: 'fav/reading.webp' },
      { id: 3, name: 'Sneakers', img: 'fav/sneakers.webp' },
    ],
    quote_by: '- Frank Zappa',
    quote: 'So many books, so little time',
  },
]

let colors = [
  
  { shade: 'bg-red-400' },
  { shade: 'bg-red-400' },
  { shade: 'bg-red-400' },
  { shade: 'bg-red-400' },
  { shade: 'bg-red-400' },


]

function Welcome() {
  return (
    <>
      <div className=" hidden  container mx-auto mt-20 lg:flex  md:mt-40 ">
        <div className="container mx-auto rounded-xl bg-pink-50 px-4 pb-6 xl:max-w-6xl">
          <header className="  m mx-auto my-10 text-center">
            <h2 className="mb-2 text-2xl font-bold leading-normal text-gray-800 dark:text-gray-900">
              <span
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Meet the Dynamic Duo
              </span>
            </h2>
          </header>

          <div className="h-16"></div>

          <div className=" mb-3 grid  h-96 md:w-5/6  grid-cols-2 justify-items-center gap-y-52 md:gap-x-20 md:grid-cols-2 md:gap-10">
            {duo.map((person) => (
              <div key={person.id}>
                <div className="bg-white">
                  <div className="flex min-w-full items-center justify-center">
                    <div className="lg:relative flex">
                      <div className="absolute h-96 w-72 transform rounded-lg bg-green-400 transition-all"></div>
                      <div className="absolute -left-4 -top-4 h-96 w-72  transform rounded-lg bg-yellow-400 transition-all"></div>
                      <div className="lg:absolute hidden lg:block -left-8 -top-8 h-96 w-72  transform rounded-lg bg-red-400 transition-all"></div>
                      <div className="lg:absolute hidden lg:block -left-12 -top-12 h-96 w-72  transform rounded-lg bg-black transition-all"></div>
                      <div className="lg:absolute hidden lg:block -left-16 -top-16 h-96 w-72  transform rounded-lg bg-purple-400 transition-all"></div>
                      <div className="lg:absolute -left-20  -top-20 flex h-96 w-72  transform flex-col items-center justify-center rounded-lg  border-2 border-black bg-white transition-all">
                        <div className="lg:relative flex flex-col  items-center overflow-hidden pb-12  ">
                          <img
                            src={person.image}
                            className="mx-auto h-auto w-36 max-w-full rounded-full bg-gray-200 p-3 grayscale"
                            alt="title image"
                          />

                          <p
                            className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium text-${person.color}-500 text-gray-900 sm:text-4xl`}
                          >
                            {person.name}
                          </p>
                        </div>

                        <div className="-mt-10 px-3">
                          <span className=" text-gray-500 ml-2 text-sm  mt-2  font-extralight text-center">
                            &quot;{person.quote}&quot; {person.quote_by}
                          </span>
                        </div>
                        <div className=" hidden lg:block mb-2 rounded-3xl  p-2">
                          <p className=" text-gray-500 ml-2 text-sm  mt-2  font-extralight text-start">Likes:</p>
                          <div className="text-nowrap mt-2 grid grid-cols-2 gap-x-1 gap-y-1 px-3">
                            {person.favorite?.map((item) => (
                              <div
                                key={item.id}
                                className=" text-nowrap gap-x-2 text-center font-light leading-relaxed text-gray-500"
                              >
                                <span className={`text-nowrap rounded-full bg-${person.color}-500  px-2 py-1 text-xs    font-extralight  text-white `}>
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* <div
                          className="hover-grayscale-0 fadeInUp relative mb-12 overflow-hidden  bg-white
                  "
                        >
                          <p
                            className={`${oswald.variable} title-font my-5 mb-3 text-center font-heading text-xl font-medium text-gray-500 sm:text-3xl`}
                          >
                            Things I like
                          </p>
                          <div className="my-5 grid grid-cols-3  gap-4">
                            {person.favorite?.map((item) => (
                              <div
                                key={item.id}
                                className="m-2 flex flex-col  text-center font-light leading-relaxed text-gray-500"
                              >
                                <img
                                  src={item.img}
                                  className="mx-auto h-auto max-w-full rounded-full "
                                  alt="title image"
                                  width={80}
                                  height={80}
                                />

                                <p className="ml-2 mt-2 text-center  text-sm  font-extralight text-gray-500 ">
                                  {' '}
                                  {item.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
