import { Badge, Progress } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { useState } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FaPersonWalking } from 'react-icons/fa6'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { IoHammer, IoLocation,IoLocationOutline } from 'react-icons/io5'

import { CMS_NAME } from '../lib/constants'
import Container from './BlogContainer'
import BlogHeader from './BlogHeader'
import Layout from './BlogLayout'
import Footer from './Footer'
import PostDate, { PostYear } from './PostDate'
import ReviewHeader from './ReviewHeader'

const Arenas = ({ arenas }) => {


  return (
    <>
    

      <Layout preview={false} loading={false}>
        <Head>
          <title>{CMS_NAME}</title>
          {/* <title> { `${CMS_NAME} - Travel and Food Reviews`}</title> */}
        </Head>
        {/* <Container> */}
          {/* <BlogHeader title={'title'} description={[]} level={1} /> */}

          <ReviewHeader
            title={'Visiting Every NBA & WNBA Arena'}
            arenas={arenas}
            summary={
              `We are traveling near and far to every state/country to visit all the NBA and WNBA arenas (${(arenas.length)}) across the US and Canada. Follow us on this journey.`
            }
            animation={'/basketball.svg'}
          />

          <div className="container mx-auto   mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-16  gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6  lg:grid-cols-3 2xl:grid-cols-4">
            {arenas?.map((item) => (
              <div
                key={item._id}
                className={`w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-800 ${
                  item.visited === false
                    ? 'opacity-40 grayscale '
                    : 'grayscale-0 '
                } `}
              >
                <div className="static ">
        
                  <div className="bg-muted relative">
                    <img
                      src={
                        item?.arenaImage.asset?._ref
                          ? urlForImage(item?.arenaImage.asset?._ref)
                              .height(801)
                              .width(1240)
                              .fit('crop')
                              .url()
                          : 'https://fakeimg.pl/1240x801'
                      }
                      className=" h-42  w-full object-cover object-center brightness-[0.7]  "
                      height={300}
                      width={224}
                      alt={`${item.name} arena`}
                    />
                  </div>
                </div>

                <div className=" mx-3 mb-3 mt-4 flex flex-col items-start justify-between gap-y-2 align-middle ">
                  <div className="flex w-full justify-between align-middle">
                    <h1
                      className={`${oswald.variable}    text-center font-heading text-2xl font-medium text-gray-50  `}
                    >
                      {item.name}
                    </h1>

           
                  </div>

                  <div className="flex w-full flex-row items-center justify-between py-2 align-middle ">
                    <div className="flex">
                      <IoLocation className=" h-4 w-4 text-red-50" />

                      <h1 className="line-clamp-1 px-1 text-sm text-white ">
                        {item.location}
                      </h1>
                    </div>

                    {item.visited === true ? (
                      <>
                        <div className="  my-1 flex flex-row items-center justify-start rounded-full bg-pink-500/80  px-1 py-1 align-middle ">
                          <FaRegCalendarAlt className="ml-1 mr-2 h-4 w-4    text-white" />
                          <p className=" line-clamp-1 pr-2 text-xs text-white">
                            <PostDate dateString={item.date} />
                          </p>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <div className="mx-4 border-t border-gray-500"></div>

                <div className=" flex items-center  justify-evenly  align-middle text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs ">
                  <div className="my-4 flex items-center ">
                    <IoHammer className=" h-4 w-4 text-red-50" />
                    <p className='px-1'>Constructed in <PostYear dateString={item.buildDate}/></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPersonWalking className=" h-4 w-4 text-red-50" />
                    <p className='px-1'>Capacity {new Intl.NumberFormat().format(item.capacity)}

                    </p>
                  </div>
                
                </div>

                <div className="mx-4 border-t border-gray-500"></div>

                <div className=" mx-3 mt-2 flex flex-row flex-wrap justify-start gap-x-2  align-top ">
                  {item.gallery?.map((photo) => (
                    <div
                      key={photo.name}
                      className="  mb-3 mt-4 flex flex-col items-center justify-between pr-2 "
                    >
               
                      <div className="flex flex-row gap-x-1">
                        <img
                          src={
                            photo?.asset?._ref
                              ? urlForImage(photo)
                                  .height(86)
                                  .width(86)
                                  .fit('crop')
                                  .url()
                              : 'https://source.unsplash.com/96x96/?face'
                          }
                          className=" h-8 w-8 rounded-full border-2 p-1 md:h-9 md:w-9   "
                          height={96}
                          width={96}
                          // @TODO add alternative text to avatar image schema
                          alt={`${photo.name} logo`}
                        />

                        <div className="flex flex-col ">
                          <p className="mx-1  cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs">
                            {photo.name}
                          </p>

                          {photo.played === true ? (
                            <div className="flex items-center">
                              <IoMdEye className="mx-1 h-4 w-4 text-green-300" />
                              <p className="my-1 cursor-pointer text-xs font-bold text-gray-400 dark:text-gray-400 md:text-xs">
                                {' '}
                                Watched
                              </p>
                            </div>
                          ) : (
                            <IoMdEyeOff className="mx-1 my-1 h-4 w-4 text-gray-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        {/* </Container> */}
      </Layout>
    
    </>
  )
}

export default Arenas
