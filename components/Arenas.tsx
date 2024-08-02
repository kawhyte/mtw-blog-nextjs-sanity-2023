import { Badge, Progress } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { useState } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'

import { CMS_NAME } from '../lib/constants'
import Container from './BlogContainer'
import BlogHeader from './BlogHeader'
import Layout from './BlogLayout'
import Footer from './Footer'
import PostDate from './PostDate'
import ReviewHeader from './ReviewHeader'

const Arenas = ({ arenas }) => {
  console.log('arenas 77 ', arenas)

  const totalDistance = arenas.reduce(
    (total, item) => total + item.galleryCount,
    0
  )

  // console.log("totalDistance ", totalDistance)

  const percentage = ((arenas[0]?.visitedCount / totalDistance) * 100).toFixed(
    2
  )

  //console.log('percentage ', percentage)

  return (
    <>
      {/* <IndexPageHead settings={settings} />*/}

      <Layout preview={false} loading={false}>
        <Head>
          <title>{CMS_NAME}</title>
          {/* <title> { `${CMS_NAME} - Travel and Food Reviews`}</title> */}
        </Head>
        <Container>
          <BlogHeader title={'title'} description={[]} level={1} />

          <ReviewHeader
            title={'Visiting Every NBA & WNBA Arena'}
            arenas={arenas}
            summary={
              'We are traveling near and far to every state/country to visit all the NBA and WNBA arenas (36) across the US and Canada. Follow us on this journey.'
            }
            animation={'/basketball.svg'}
          />

          <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-2 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 xl:grid-cols-4">
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
                  {/* {item.visited === true ? (
                    <span className="absolute z-10 ml-3  mt-3  text-xs rounded-full text-green-600  bg-green-200 ">
                      Visited: <PostDate dateString={item.date} />
                    </span>
                  ) : (
                    ''
                  )} */}
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
                      className=" h-42 h- w-full object-cover object-center brightness-[0.7]  "
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

                    {/* {item.visited === true ? (
                      <>
                        <div className="  my-1 flex flex-row items-center justify-start rounded-full bg-indigo-500/80  px-1 py-1 align-middle ">
                          <FaRegCalendarAlt className="ml-1 mr-2 h-4 w-4    text-white" />
                          <p className=" line-clamp-1 pr-2 text-xs text-white">
                            <PostDate dateString={item.date} />
                          </p>
                        </div>
                      </>
                    ) : (
                      ''
                    )} */}
                  </div>

                  <div className="flex w-full flex-row items-center justify-between py-2 align-middle ">
                    <div className="flex">
                      <IoLocationOutline className=" h-4 w-4 text-red-50" />

                      <h1 className="line-clamp-1 px-1 text-sm text-white ">
                        {item.location}
                      </h1>
                    </div>

                    {item.visited === true ? (
                      <>
                        <div className="  my-1 flex flex-row items-center justify-start rounded-full bg-indigo-500/80  px-1 py-1 align-middle ">
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

                <div className=" mx-3 flex items-center  justify-between border-t border-gray-500 align-middle text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs ">
                  <div className="my-4 flex items-center gap-1">
                    <IoLocationOutline className="ml-1 h-4 w-4 text-red-50" />
                    <p> Year built</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoLocationOutline className="ml-1 h-4 w-4 text-red-50" />
                    <p> Capacity</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoLocationOutline className="ml-1 h-4 w-4 text-red-50" />
                    <p> Sq foot</p>
                  </div>
                </div>

                

                <div className=" mx-4 flex flex-row flex-wrap items-center border-t border-gray-500 ">
                  {item.gallery?.map((photo, index) => (
                    <div
                      key={photo.name}
                      className="my-5 flex flex-col items-center justify-between pr-2 "
                    >
                      {/* <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/4ndR-n-gall7_h3f7NYcpQ_96x96.png"
                  alt="avatar"
                /> */}
                      <div className="flex flex-row">
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
                          className=" h-8 w-8 rounded-full border-2 md:h-9 md:w-9 p-1   "
                          height={96}
                          width={96}
                          // @TODO add alternative text to avatar image schema
                          alt={`${photo.name} logo`}
                        />

                        <div className="mx-1 flex flex-col ">
                          <p className="mx-1  cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs">
                            {photo.name}
                          </p>

                        {item.played === true ?    <p className="mx-1 mb-1 cursor-pointer text-xs font-bold text-gray-500 dark:text-gray-500 md:text-xs">
                            {'Watched'}
                          </p> :""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Layout>
      <Footer />
    </>
  )
}

export default Arenas
