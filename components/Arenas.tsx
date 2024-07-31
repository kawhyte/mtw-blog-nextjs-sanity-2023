import { Progress } from '@mantine/core'
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
  //  console.log('arenas 77 ', arenas[0])

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
              'We are traveling near and far to every state/country to visit all the NBA and WNBA arenas (37) across the US and Canada. Follow us on this journey.'
            }
            animation={'/basketball.svg'}
          />

          <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-2 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 xl:grid-cols-4">
            {arenas?.map((item) => (
              <div
                key={item._id}
                className={`w-full max-w-sm overflow-hidden rounded-lg border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-800 ${
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
                      className="h-56 w-full object-cover object-center brightness-[0.7] grayscale "
                      height={300}
                      width={224}
                      alt={`${item.name} arena`}
                    />

                    <h1
                      className={`${oswald.variable} absolute inset-x-0 bottom-2 text-center font-heading text-2xl font-medium text-gray-50  `}
                    >
                      {item.name}
                    </h1>

                    <div className='left-0 top-2  w-48 lg:w-full px-2 absolute flex flex-col gap-2 lg:flex-row justify-between '> 

                    <div className="  flex flex-row items-center justify-start rounded-full bg-pink-500/80 px-1 py-1 align-middle ">
                      <IoLocationOutline className="ml-1 h-4 w-4 text-red-50" />

                      <h1 className="px-2 text-xs text-white line-clamp-1 ">
                        {item.location}
                      </h1>
                    </div>

                    {item.visited === true ? (
                      <>
                        <div className="  flex flex-row items-center justify-start rounded-full bg-indigo-500/80 px-1 py-1 align-middle ">
                          <FaRegCalendarAlt className="ml-1 mr-2 h-4 w-4    text-white" />
                          <p className=" pr-2 text-xs text-white line-clamp-1">
                            <PostDate dateString={item.date} />
                          </p>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  </div>
                </div>

                {/*<div className="flex flex-col items-center justify-center bg-gray-900 px-2 py-3 align-middle">
                   <h1
                    className={`${oswald.variable} title-font  text-center font-heading text-2xl font-medium text-gray-200  md:text-2xl`}
                  >
                    {item.name}
                  </h1> */}

                {/* <div className=" flex items-center text-gray-700 dark:text-gray-200">
                    <svg
                      aria-label="location pin icon"
                      className=" h-4 w-4 fill-current md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.063 10.063 6.27214 12.2721 6.27214C14.4813 6.27214 16.2721 8.063 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16757 11.1676 8.27214 12.2721 8.27214C13.3767 8.27214 14.2721 9.16757 14.2721 10.2721Z"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.3941 5.48178 3.79418C8.90918 0.194258 14.6059 0.0543983 18.2059 3.48179C21.8058 6.90919 21.9457 12.606 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.9732 6.93028 5.17326C9.59603 2.37332 14.0268 2.26454 16.8268 4.93029C19.6267 7.59604 19.7355 12.0269 17.0698 14.8268Z"
                      />
                    </svg>

                    <h1 className="px-2 text-xs md:text-sm">
                      {' '}
                      {item.location}
                    </h1>
                  </div> */}
                {/* {item.visited === true ? (
                    <span className="mt-3 rounded-full bg-green-200 px-4  py-2 text-[.6rem] text-green-600  md:text-xs ">
                      Visited: <PostDate dateString={item.date} />
                    </span>
                  ) : (
                    ''
                  )} 
                </div>*/}
                <div className=" flex flex-row flex-wrap items-center justify-evenly">
                  {item.gallery?.map((photo) => (
                    <div
                      key={photo.name}
                      className="my-4 flex flex-col items-center justify-between "
                    >
                      {/* <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/4ndR-n-gall7_h3f7NYcpQ_96x96.png"
                  alt="avatar"
                /> */}

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
                        className=" h-9 w-9   md:h-11 md:w-11  "
                        height={96}
                        width={96}
                        // @TODO add alternative text to avatar image schema
                        alt={`${photo.name} logo`}
                      />

                      <p className="mx-1 mt-1 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs">
                        {photo.name}
                      </p>
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
