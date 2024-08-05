import { Spoiler } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import React from 'react'
import { FaThumbsDown,FaThumbsUp } from 'react-icons/fa6'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { RiLightbulbFlashLine } from "react-icons/ri";

import PostBody from '../components/PostBody'
import SectionTitle from './SectionTitle'

const boxHeight = 390
function ProConList({ positives, negatives, verdict2 }) {
  return (
    <>
      <section className="mx-6 text-gray-800 md:mx-0">
        {/* <h1 className= {`${oswald.variable} font-heading text-center text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl md:leading-none lg:text-5xl`}>
          Bottom Line
        </h1> */}
        <SectionTitle> Bottom Line</SectionTitle>

        <div className="container flex flex-wrap py-6 md:mx-auto lg:py-12">
          <div className=" grid grid-cols-1  gap-6 2xl:grid-cols-3">
            <div className="md:w-full">
              <div className="flex flex-col rounded-lg  border-opacity-50  bg-yellow-100/70  p-2 md:p-5  shadow-lg shadow-yellow- shadow-yellow-200/40  ">
                <div className="flex justify-start align-middle ">
                  <FaThumbsUp className='h-7 w-7 mr-3 bg-green-100 text-green-500 p-1 rounded-2xl ' />

                  <h2
                    className={` flex items-baseline text-center mb-3 font-heading text-2xl font-bold text-gray-600 md:text-left md:text-2xl md:leading-none lg:text-xl`}
                  >
                    What we loved
                  </h2>
                </div>
                {/* <div className="grow rounded-xl bg-white p-8"> */}
                <div className="-mb-1 flex flex-col items-center   space-y-2.5 sm:items-start sm:text-left">
                  <Spoiler
                    maxHeight={boxHeight}
                    color="pink"
                    showLabel="Show more"
                    hideLabel="Hide"
                  >
                    <ul>
                      {positives?.map((positive, index) => (
                        <li
                          key={index}
                          className={`${inter.variable} font-secondary  my-3 text-sm font-extralight leading-loose md:text-base`}
                        >
                          <div className="flex items-baseline align-bottom">
                            <FaCheck className="mr-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-green-500" />
                            {/* <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-green-500">
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20 6L9 17l-5-5"></path>
                              </svg>
                            </span> */}
                            <p className="leading-loose"> {positive}</p>{' '}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Spoiler>
                </div>
                {/* </div> */}
              </div>
            </div>

            <div className="md:w-full">
              <div className="flex flex-col rounded-lg  border-opacity-50  bg-gray-100  p-2 md:p-5 shadow-lg shadow-gray-200/60  ">
                <div className="flex justify-start align-middle ">
                  {/* <FaThumbsUp className='h-7 w-7 mr-3 bg-green-100 text-green-500 p-1 rounded-lg ' /> */}

                  <FaThumbsDown className='h-7 w-7 mr-3 bg-red-100 text-red-500 p-1 rounded-2xl ' />


                  <h2
                    className={` flex items-baseline text-center mb-3 font-heading text-2xl font-bold text-gray-600 md:text-left md:text-2xl md:leading-none lg:text-xl`}
                  >
                    What we did not like
                  </h2>
                </div>
                {/* <div className="grow rounded-xl bg-white p-8"> */}
                <div className="-mb-1 flex flex-col items-center   space-y-2.5 sm:items-start sm:text-left">
                  <Spoiler
                    maxHeight={boxHeight}
                    color="pink"
                    showLabel="Show more"
                    hideLabel="Hide"
                  >
                    <ul>
                      {negatives?.map((positive, index) => (
                        <li
                          key={index}
                          className={`${inter.variable} font-secondary  my-3 text-sm font-extralight leading-loose md:text-base`}
                        >
                          <div className="flex flex-row  items-baseline align-bottom">
                            <div className="mr-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-red-500">
                              <IoClose />
                            </div>
                            {/* <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-red-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="h-4 w-4"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
                              </svg>
                            </span> */}
                            <p className="leading-loose"> {positive}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Spoiler>
                </div>
                {/* </div> */}
              </div>
            </div>

            {/* <div className=" md:w-full">
              <div className="mr-0 flex  flex-col  rounded-lg border-opacity-50 bg-gradient-to-b from-gray-100 via-gray-200 to-red-100 md:p-5  ">
                <div className="mx-2 my-2 flex justify-start align-middle">
                  <h2 className="font-fancy title-font mb-3 pr-3 text-lg font-bold text-gray-900 md:text-2xl">
                    What we did not like
                  </h2>
                  <div className="mx-3 mb-4 inline-flex  h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500   sm:mb-0 sm:mr-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                  </div>
                </div>
                <div className="mx-2 mb-2 grow rounded-xl bg-white p-6 md:mx-0 md:mb-0">
                  <div className="-mb-1 flex flex-col items-center   space-y-2.5 sm:items-start sm:text-left">
                    <Spoiler
                      maxHeight={boxHeight}
                      color="pink"
                      showLabel="Show more"
                      hideLabel="Hide"
                    >
                      <ul>
                        {negatives?.map((negative, index) => (
                          <li
                            key={index}
                            className={`${inter.variable} font-secondary my-3 text-base font-extralight leading-relaxed md:text-lg`}
                          >
                            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-red-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="h-4 w-4"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
                              </svg>
                            </span>
                            {negative}
                          </li>
                        ))}
                      </ul>
                    </Spoiler>
                  </div>
                </div>
              </div>
            </div> */}
            <div className=" md:w-full">
              <div className="flex flex-col  rounded-lg  border-opacity-50 bg-indigo-100  p-2 md:p-5 shadow-lg shadow-indigo-100/50  ">
                <div className="flex justify-start align-middle ">
                 
                <RiLightbulbFlashLine className='h-7 w-7 mr-3 bg-yellow-100 text-yellow-500 p-1 rounded-2xl ' />

                 
                  <h2 className={` flex items-baseline text-center font-heading text-2xl font-bold text-gray-600 md:text-left md:text-2xl md:leading-none lg:text-xl`}
                  >
                    Verdict
                  </h2>
                  {/* <div className="mx-3 mb-4 inline-flex  h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100  text-yellow-500 sm:mb-0  sm:mr-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div> */}
                </div>
               
                  <div
                    className={`${inter.variable} font-secondary  flex flex-col px-7 text-base leading-relaxed sm:items-start lg:text-lg`}
                  >
                    {/*<p className='font-sans text-base md:text-lg'>{verdict}</p>*/}
                    <Spoiler
                      maxHeight={boxHeight}
                      color="pink"
                      showLabel="Show more"
                      hideLabel="Hide"
                    >
                      <PostBody content={verdict2} />
                    </Spoiler>
                  </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProConList
