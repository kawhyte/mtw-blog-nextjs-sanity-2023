import { inter, oswald } from 'app/fonts'
import React from 'react'
import SectionTitle from './SectionTitle'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'

function RoomTech({ speed = 10, techAvailable, roomAmenitiesAvailiable }) {
  let speedResult = ['Web Browsing', 'Email']
  let textResult = 'OK'
  let bgColor = 'bg-blue-200'

  // console.log("roomAmenitiesAvailiable ", roomAmenitiesAvailiable)

  // console.log("techAvailable",techAvailable)

  if (speed <= 2) {
    speedResult = ['Web Browsing', 'Emails']
    textResult = 'Poor'
    bgColor = 'bg-red-500'
  } else if (speed >= 3 && speed < 5) {
    speedResult = ['Web Browsing', 'Emails', 'Streaming Music']
    textResult = 'Slow'
    bgColor = 'bg-orange-500'
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
    bgColor = 'bg-green-500'
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
    bgColor = 'bg-green-700'
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
      <section className="mt-8">
        <section className="overflow-hidden text-gray-800">
          <div className="mx-6 pb-12 md:container md:mx-auto">
            <div className="mb-9 flex w-full flex-col">
              <SectionTitle
                header={'Hotel Techology & Amenities'}
                description={undefined}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ">
              <div className="  w-full">
                {/*Internet Section */}
                <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-green-500 p-3 py-6">
                  <span
                    className={`absolute right-0 top-0 m-1 ${bgColor} px-3 py-1 text-base uppercase tracking-widest text-white sm:hidden md:block`}
                  >
                    {textResult}
                  </span>
                  <h2 className="title-font  mb-1  text-base font-medium uppercase tracking-widest text-green-500">
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
                        <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                          <IoMdCheckmarkCircle className="h-5 w-5" />
                        </div>

                        <p className="text-sm leading-relaxed text-gray-500">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/*Internet Section Ends Here*/}

              {/*Ports, Plugs & TV */}

              {techAvailable && (
                <div className=" w-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-pink-500 p-3 py-6">
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
                        <div className=" grid grid-cols-2 gap-5 sm:grid-cols-1">
                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.USB === 'Yes' ? (
                                <div className="mr-3 inline-flex  rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500">
                              Elevator Key Card required
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.HDMI === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-start justify-start rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500">
                              Guest In-Room Tablet
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.TV === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500">
                              Mobile Key Access
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.Chromecast === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500">
                              Chromecast/Smart TV
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.Wired === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500">
                              Wired Internet
                            </p>
                          </div>
                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.Bluetooth === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500">
                              Hospitality App/Texting
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {/*Ports, Plugs & TV Ends  */}
              {/*Hotel Amenities*/}

              {roomAmenitiesAvailiable && (
                <div className=" w-full ">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-blue-500 p-3 py-6">
                    <h2 className="title-font  mb-1 text-base font-medium uppercase tracking-widest text-blue-500">
                      Hotel Amentities
                    </h2>
                    <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-5xl leading-none text-gray-900"></h1>
                    <p className="mb-3 pb-2 text-base font-medium text-gray-900">
                      Breakdown of ameities availiable in the room:
                    </p>

                    <section
                      className={` ${inter.variable} font-secondary text-base text-gray-600 `}
                    >
                      <div className="container mx-auto px-2 py-2">
                        <div className=" grid grid-cols-2 gap-4 text-center sm:grid-cols-1">
                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {techAvailable.Chromecast === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm capitalize leading-relaxed text-gray-500">
                              Coffee Machine ({roomAmenitiesAvailiable?.Coffee})
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {roomAmenitiesAvailiable?.Toothpaste === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm capitalize leading-relaxed text-gray-500">
                              Toothpaste, Mouthwash etc.
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {roomAmenitiesAvailiable?.Fridge === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm capitalize leading-relaxed text-gray-500">
                              Useable Fridge
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {roomAmenitiesAvailiable?.Slippers === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm capitalize leading-relaxed text-gray-500">
                              Slippers/Robes
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {roomAmenitiesAvailiable?.Slippers === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm capitalize leading-relaxed text-gray-500">
                              Soap ({roomAmenitiesAvailiable?.Soap})
                            </p>
                          </div>

                          <div className=" flex text-2xl ">
                            <div className="title-font   uppercase leading-none text-gray-900">
                              {roomAmenitiesAvailiable?.Other === 'Yes' ? (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-green-400">
                                  <IoMdCheckmarkCircle className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="mr-3 inline-flex  items-center justify-center rounded-full  text-red-500">
                                  <IoMdCloseCircle className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm capitalize leading-relaxed text-gray-500">
                              Additional Amenities - Sewing kit etc.
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}
              {/*Hotel Amenities here*/}
            </div>
          </div>
        </section>
      </section>
    </>
  )
}

export default RoomTech
