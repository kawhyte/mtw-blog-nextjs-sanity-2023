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
      { id: 4, name: 'Video Games', img: 'fav/videogame.webp' },
      { id: 5, name: 'Coffee', img: 'fav/coffee.webp' },
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
      { id: 7, name: 'Pepperoni Pizza', img: 'fav/pizza.webp' },
      { id: 8, name: 'Reading', img: 'fav/reading.webp' },
    ],
    quote_by: '- Frank Zappa',
    quote: 'So many books, so little time',
  },
]

function Welcome() {
  return (
    <>
      <div className=" container mx-auto mt-20 flex  md:mt-40">
        <div className="container mx-auto rounded-xl bg-pink-50 px-4 xl:max-w-6xl">
          <header className="mx-auto my-10 text-center">
            <h2 className="mb-2 text-2xl font-bold leading-normal text-gray-800 dark:text-gray-900">
              <span
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Meet the Dynamic Duo
              </span>
            </h2>
          </header>

          <div className="m-6 mb-5 grid grid-cols-1 md:grid-cols-2 md:gap-10">
            {duo.map((person) => (
              <div key={person.id}>
                <div
                  className="hover-grayscale-0 fadeInUp relative mb-12 overflow-hidden  bg-white
                  "
                >
                  <div className="relative flex flex-col items-center overflow-hidden  px-6">
                    <img
                      src={person.image}
                      className="mx-auto mt-6 h-auto max-w-full rounded-full bg-gray-200 p-2 grayscale"
                      alt="title image"
                    />

                    <p
                      className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium text-${person.color}-500 text-gray-900 sm:text-4xl`}
                    >
                      {person.name}
                    </p>
                  </div>
                  <div className=" text-center ">
                    <div className="container px-12 ">
                      <Blockquote
                        className={` ${inter.variable} font-secondary mt-4 text-sm italic leading-relaxed md:text-base  lg:text-base `}
                        color={person.color}
                        cite={person.quote_by}
                        mt="xl"
                      >
                        {person.quote}
                      </Blockquote>
                    </div>

                    <p className="mx-6  mb-1 border-t text-lg font-bold leading-normal"></p>
                  </div>
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
