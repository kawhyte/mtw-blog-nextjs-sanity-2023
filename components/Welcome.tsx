import { Blockquote } from '@mantine/core'
import { oswald } from 'app/fonts'
import React from 'react'

let duo = [
  {
    id: 1,
    color: 'indigo',
    name: 'Mr.',
    blurb: '',
    image: '/avatar_mr.png',
    food: 'Jerk Pork',
    music: '',
    hotel: '',
    quote_by: ' - Oscar Wilde',
    place_to_visit: '',
    quote: 'Be yourself; everyone else is already taken.',
  },
  {
    id: 2,
    color: 'pink',
    name: 'Mrs.',
    blurb: '',
    image: '/avatar_mrs.png',
    food: 'Pepperoni Pizza',
    music: '',
    hotel: '',
    quote_by: '- Frank Zappa',
    place_to_visit: '',
    quote: 'So many books, so little time',
  },
]

function Welcome() {
  return (
    <>
      <div className=" container mx-auto mb-20   mt-44  flex rounded-xl  bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50 md:mt-52">
        <div className="container mx-auto px-4 xl:max-w-6xl">
          <header className="mx-auto mb-12 text-center">
            <h2 className="mb-2 text-2xl font-bold leading-normal text-gray-800 dark:text-gray-900">
              <span
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Meet the Dynamic Duo
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-2 gap-4">
            {duo.map((person) => (
              <div
                key={person.id}
                // className=" w-full  px-4 bg-red-200"
              >
                <div
                  className="hover-grayscale-0 wow fadeInUp relative mb-12 overflow-hidden bg-white 
                  "
                  data-wow-duration="1s"
                >
                  <div className="relative overflow-hidden px-6">
                    <img
                      src={person.image}
                      className="mx-auto h-auto max-w-full rounded-full bg-gray-50 grayscale"
                      alt="title image"
                    />
                  </div>
                  <div className="pt-6 text-center ">
                    <p
                      className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-${person.color}-500 text-gray-900 sm:text-4xl`}
                    >
                      {person.name}
                    </p>
                    <div className="container px-12 ">
                      <Blockquote
                        className="-my-2 mb-1 text-base font-bold leading-normal "
                        color={person.color}
                        cite={person.quote_by}
                        mt="xl"
                      >
                        {person.quote}
                      </Blockquote>
                    </div>
                    {/* <p className="mb-1 text-md font-bold leading-normal ">{person.quote} - {person.quote_by}</p> */}

                    <p className="mx-6 mb-1 border-t text-lg font-bold leading-normal"></p>
                  </div>
                  <p className="mb-1 text-center text-lg font-bold leading-normal">
                    Things I like 
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <p className="border border-dashed m-2 font-light leading-relaxed text-gray-500 flex flex-col text-center">
                    <img
                      src={person.image}
                      className="mx-auto h-auto max-w-full rounded-full bg-gray-50 grayscale"
                      alt="title image"
                      width={80}
                      height={80}
                    />
                       {person.food}
                      <p> Food</p> 
                    </p>
                    <p className="font-light leading-relaxed text-gray-500">
                      Music: {person.music}
                    </p>
                    <p className="font-light leading-relaxed text-gray-500">
                      Trip:{person.place_to_visit}
                    </p>
                    <p className="font-light leading-relaxed text-gray-500">
                      Hotel:{person.hotel}
                    </p>
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
