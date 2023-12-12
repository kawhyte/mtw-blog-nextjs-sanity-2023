import { Blockquote } from '@mantine/core'
import { oswald } from 'app/fonts'
import React from 'react'

let duo = [
  {
    id: 1,
    color:"blue",
    name: 'Mr.',
    blurb: '',
    image: 'https://tailone.tailwindtemplate.net/src/img/dummy/avatar1.png',
    food: 'Jerk Pork',
    music: '',
    hotel: '',
    quote_by:" - Oscar Wilde",
    place_to_visit: '',
    quote: 'Be yourself; everyone else is already taken.',
  },
  {
    id: 2,
    color:"pink",
    name: 'Mrs.',
    blurb: '',
    image: 'https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png',
    food: 'Pasta e Fagioli Soup',
    music: '',
    hotel: '',
    quote_by:"- Frank Zappa",
    place_to_visit: '',
    quote: 'So many books, so little time',
  },
]

function Welcome() {
  return (
    <>
      <div className="section relative bg-white pb-8 pt-20 dark:bg-gray-100 md:pt-16 ">
        <div className="container mx-auto px-4 xl:max-w-6xl">
          <header className="mx-auto mb-12 text-center">
            <h2 className="mb-2 text-2xl font-bold leading-normal text-gray-800 dark:text-gray-900">
              <span className="font-light">Meet the Dynamic </span> Duo
            </h2>
          </header>

          <div className="-mx-9 flex flex-row flex-wrap justify-center">
            {duo.map((person) => (
              <div
                key={person.id}
                className="w-2/3 max-w-full flex-shrink px-4 sm:w-1/2 md:w-5/12 lg:w-1/4 xl:px-6"
              >
                <div
                  className="hover-grayscale-0 wow fadeInUp relative mb-12 overflow-hidden bg-white dark:bg-gray-800"
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
                    <p className="mb-1 text-lg font-bold leading-normal ">{person.name}</p>

                    <Blockquote className="mb-1 -my-2 text-base font-bold leading-normal " color={person.color}  cite={person.quote_by}    mt="xl">
                {person.quote}
    </Blockquote>
   
                    {/* <p className="mb-1 text-md font-bold leading-normal ">{person.quote} - {person.quote_by}</p> */}

                    <p className="mb-1 text-lg font-bold leading-normal border-t mx-6"></p>
                    <p className="mb-1 text-lg font-bold leading-normal">Favorites</p>
                  </div>
                  <p className="font-light leading-relaxed text-gray-500">
                    Food: {person.food}
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
