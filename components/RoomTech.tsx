import { inter, oswald } from 'app/fonts'
import React from 'react'

function RoomTech({ speed = 10, techAvailable,roomAmenitiesAvailiable }) {
  let speedResult = ['Web Browsing', 'Email']
  let textResult = 'OK'
  let bgColor = 'bg-blue-200'

 console.log("roomAmenitiesAvailiable ", roomAmenitiesAvailiable)

  if (speed <= 2) {
    speedResult = ['Web Browsing', 'Emails']
    textResult = 'Poor'
    bgColor = 'bg-red-500'
  } else if (speed >= 3 && speed < 5) {
    speedResult = ['Web Browsing', 'Emails', 'Streaming Music']
    textResult = 'Slow'
    bgColor = 'bg-pink-500'
  } else if (speed >= 6 && speed < 8) {
    speedResult = [
      'Web Browsing',
      'Emails',
      'Streaming Music',
      'Streaming Youtube',
    ]
    textResult = 'Slow'
    bgColor = 'bg-blue-500'
  } else if (speed >= 8 && speed < 13) {
    textResult = 'Average'
    bgColor = 'bg-purple-500'
    speedResult = [
      'Web Browsing',
      'Emails',
      'Streaming Music',
      'Streaming Youtube',
    ]
  } else if (speed >= 13 && speed < 22) {
    textResult = 'Average'
    bgColor = 'bg-yellow-500'
    speedResult = [
      'Web Browsing',
      'Emails',
      'Zoom Meetings',
      'Streaming Music',
      'Streaming Youtube',
    ]
  } else if (speed >= 23 && speed < 30) {
    textResult = 'Fast'
    bgColor = 'bg-indigo-400'
    speedResult = [
      'Web Browsing',
      'Emails',
      'Zoom Meetings',
      'Streaming Music',
      'Streaming Youtube',
      'Streaming HD Movies',
    ]
  } else if (speed >= 30 && speed < 40) {
    textResult = 'Very Fast'
    bgColor = 'bg-indigo-500'
    speedResult = [
      'Web Browsing',
      'Emails',
      'Zoom Meetings',
      'Streaming Music',
      'Streaming Youtube',
      'Streaming HD Movies',
      'Streaming 4k Movies',
    ]
  } else if (speed >= 40) {
    textResult = 'Excellent'
    bgColor = 'bg-green-500'
    speedResult = [
      'Web Browsing',
      'Emails',
      'Zoom Meetings',
      'Streaming Music',
      'Streaming Youtube',
      'Streaming HD Movies',
      'Streaming 4k Movies',
      'Streaming Video Games',
    ]
  } else {
    textResult = 'No Internet'
    speedResult = ['No Internet']
    // Fall through
  }

 
  return (
    <>
      {/* <div className="w-64 rounded-2xl border-2 border-green-500 bg-white p-4 shadow-lg ">
        <p className="text-md mb-4 font-medium  uppercase text-pink-500 ">
          Internet Speed
        </p>

        <section className="text-8xl font-bold text-gray-900 ">
          {speed}
          <span className="text-sm text-gray-500">Mbps</span>

          <p
            className={`px-4 py-2 ${bgColor}   w-full rounded-lg  text-center text-base font-semibold text-white shadow-md`}
          >
            {textResult}
          </p>
        </section>

        <p className="mt-4 text-base text-gray-600 ">
          This internet speed is great for:
        </p>
        <ul className="mb-6 mt-6 w-full text-sm text-gray-600 ">
          {speedResult.map((item, i) => (
            <li
              key={i}
              className={`${inter.variable} font-secondary mb-2 flex items-center  text-sm text-gray-600 md:text-base`}
            >
              <span className="mb-2 mr-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-400 text-white">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div> */}

      <section className="mt-8">
        <section className="overflow-hidden text-gray-800">
          <div className="mx-6 pb-12 md:container md:mx-auto">
            <div className="mb-12 flex w-full flex-col text-center">
              <h1
                className={`${oswald.variable} text-center font-heading text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl md:leading-none lg:text-5xl`}
              >
                Hotel Techology & Amenities
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
              <div className="  w-full">
                {/*Internet Section */}
                <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-green-500 py-6 p-3">
                  <span className={`absolute right-0 top-0 m-1 ${bgColor} px-3 py-1 text-base uppercase tracking-widest text-white sm:hidden md:block`}>
                    {textResult}
                  </span>
                  <h2 className="title-font  mb-1  text-base font-medium uppercase tracking-widest text-pink-500">
                    Internet Speed
                  </h2>

                  <h1 className="mb-4 flex items-start border-b border-gray-200 pb-4 text-5xl leading-none text-gray-900">
                    <span className="text-8xl">{speed}</span>
                    <span className="ml-1 text-lg font-normal text-gray-900">
                      Mbps
                    </span>
                  </h1>

                  <p className="mb-3 pb-2 text-base font-medium text-gray-900">
                    This internet speed is great for:
                  </p>

                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-2">
                    {speedResult.map((item, i) => (
                      <div
                        key={i}
                        className={`${inter.variable} font-secondary mb-2 flex items-center  text-sm text-gray-600 md:text-base`}
                      >
                        <span className="mb-2 mr-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-400 text-white">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                        </span>
                        <p className="leading-relaxed text-sm text-gray-500">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/*Internet Section Ends Here*/}

              {/*Ports, Plugs & TV */}

            { techAvailable &&  <div className=" w-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-pink-500 py-6 p-3">
                  <h2 className="title-font  mb-1 text-base font-medium uppercase tracking-widest text-pink-500">
                    TV Ports, Plugs & other tech
                  </h2>
                  <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-5xl leading-none text-gray-900"></h1>
                  <p className="mb-3 pb-2 text-base font-medium text-gray-900">
                    Availiable in the room/hotel:
                  </p>

                  <section
                    className={` ${inter.variable} font-secondary text-gray-600 `}
                  >
                    <div className="container mx-auto px-2 py-2">
                      <div className=" grid grid-cols-2 gap-4 text-center sm:grid-cols-2">
                        
                        
                        <div className=" text-2xl ">
                          <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {techAvailable.USB}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">
                            Key Card needed for Elevator
                          </p>
                        </div>


                        <div className="text-2xl">
                          <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {techAvailable.HDMI}
                          </h2>

                          <p className="leading-relaxed text-sm text-gray-500">
                            Guest In-Room Tablet
                          </p>
                        </div>

                          <div className="text-2xl">
                          <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {techAvailable.TV}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">Mobile Key Access</p>
                        </div>


                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {techAvailable.Chromecast}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">Chromecast/Smart TV</p>
                        </div>


                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {techAvailable.Wired}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">Wired Internet</p>
                        </div>


                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {techAvailable.Bluetooth}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">
                            Hospitality App/Texting
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div> }

 {/*Ports, Plugs & TV Ends  */}
  {/*Hotel Amenities*/}

            { roomAmenitiesAvailiable &&  <div className=" w-full ">
                <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-blue-500 py-6 p-3">
                  <h2 className="title-font  mb-1 text-base font-medium uppercase tracking-widest text-blue-500">
                     Hotel Amentities
                  </h2>
                  <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-5xl leading-none text-gray-900"></h1>
                  <p className="mb-3 pb-2 text-base font-medium text-gray-900">
                    Breakdown of ameities availiable in the room:
                  </p>

                  <section
                    className={` ${inter.variable} font-secondary text-gray-600 text-base `}
                  >
                    <div className="container mx-auto px-2 py-2">
                      <div className=" grid grid-cols-2 gap-4 text-center sm:grid-cols-2">
                      
                      <div className="text-2xl ">
                      <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {roomAmenitiesAvailiable?.Coffee}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">
                            Coffee Machine Type
                          </p>
                        </div>


                  

                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {roomAmenitiesAvailiable?.Toothpaste}
                            
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">Toothpaste, Mouthwash etc.</p>
                        </div>


                        <div className="text-2xl">
                          <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {roomAmenitiesAvailiable?.Fridge}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">Useable Fridge</p>
                        </div>


                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {roomAmenitiesAvailiable?.Slippers}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">Slippers/Robes</p>
                        </div>


                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {roomAmenitiesAvailiable?.Soap}
                          </h2>

                          <p className="leading-relaxed text-sm text-gray-500">
                            Soap Type
                          </p>
                        </div>



                        <div className="text-2xl">
                        <h2 className="title-font   leading-none text-gray-900 uppercase">
                            {roomAmenitiesAvailiable?.Other}
                          </h2>
                          <p className="leading-relaxed text-sm text-gray-500">
						  Other Amenities
                          </p>
                        </div>




                      </div>
                    </div>
                  </section>
                </div>
              </div>}
              {/*Hotel Amenities here*/}
            </div>
          </div>
        </section>
      </section>
    </>
  )
}

export default RoomTech
