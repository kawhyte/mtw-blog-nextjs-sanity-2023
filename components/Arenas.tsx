import { Progress } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { useState } from 'react'

import { CMS_NAME } from '../lib/constants'
import Container from './BlogContainer'
import BlogHeader from './BlogHeader'
import Layout from './BlogLayout'
import Footer from './Footer'
import IndexPageHead from './IndexPageHead'
import PostDate from './PostDate'
import ReviewHeader from './ReviewHeader'

const Arenas = ({ arenas }) => {
  //  console.log('arenas 77 ', arenas[0])

  const totalDistance = arenas.reduce(
    (total, item) => total + item.galleryCount,
    0
  )

  // console.log("totalDistance ", totalDistance)

  const percentage = ((arenas[0].visitedCount / totalDistance) * 100).toFixed(2)

  console.log('percentage ', percentage)

  return (
    <>
      {/* <IndexPageHead settings={settings} />*/}

      <Layout preview={false} loading={false}>
        <Head>
          {/* <title>{CMS_NAME}</title> */}
          {/* <title> { `${CMS_NAME} - Travel and Food Reviews`}</title> */}
        </Head>
        <Container>
          <BlogHeader title={'title'} description={[]} level={1} />

          <div className="  flex flex-col items-center justify-center bg-indigo-50 pt-12 lg:flex-row">
            <div className="flex  flex-col items-center text-center md:items-start md:pl-16 md:text-left lg:grow lg:pl-24">
              <h1
                className={` ${oswald.variable}  mb-1 py-1 font-heading text-5xl font-bold leading-tight tracking-tighter text-pink-500  md:text-6xl`}
              >
                {'Our Quest to Visit Every NBA & WNBA Arena 🏀'}
              </h1>
              <p
                className={` font-secondary mb-8 px-5  leading-relaxed md:px-0 md:text-base lg:text-lg`}
              >
                {
                  'We are traveling near and far to every state/country to visit all the NBA and WNBA arena across the US and Canada. Follow us on this journey.'
                }
              </p>
            </div>

            <div className=" container mx-auto  p-10 lg:w-full lg:max-w-xl ">
              <div className="rounded-lg border bg-white p-4  pt-6 ">
                <p className="title-font mb-6 text-3xl font-medium text-gray-900">
                  {' '}
                  Our Progress
                </p>

                <div className="mt-3 flex flex-row justify-between">
                  <span className="text-xs  font-medium text-blue-700 ">
                    0%
                  </span>
                  <span className="text-xs font-medium text-blue-700 ">
                    100%
                  </span>
                </div>
                <div className=" h-4 w-full rounded-full bg-gray-400">
                  <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-6  bg-gradient-to-r from-green-500 to-blue-500 p-0.5 pt-2 text-center text-xs font-medium leading-none text-blue-100"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-evenly">
                  <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                    <h2 className="title-font text-2xl font-medium text-gray-900">
                      {arenas[0].visitedCount}{' '}
                    </h2>
                    <p className="leading-relaxed text-gray-500">
                      of 37 visited
                    </p>
                  </div>

                  <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                    <h2 className="title-font text-2xl font-medium text-gray-900">
                      {arenas[0].name}
                    </h2>
                    <p className="leading-relaxed text-gray-500">last visit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {arenas?.map((item) => (
              <div
                key={item._id}
                className={`w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 ${
                  item.visited === false
                    ? 'opacity-40 grayscale'
                    : 'grayscale-0'
                } `}
              >
                <div className="static">
                  {item.visited === true ? (
                    <span className="absolute z-10 ml-3  mt-3 rounded-full bg-gray-200 px-4 py-2  text-sm text-gray-600 ">
                      Visited: <PostDate dateString={item.date} />
                    </span>
                  ) : (
                    ''
                  )}
                  <div className="relative">
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
                      className="h-56 w-full object-cover object-center "
                      height={300}
                      width={224}
                      alt={`${item.name} arena`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-gray-900 px-2 py-3">
                  <h1
                    className={`${oswald.variable}  title-font mb-4 font-heading text-3xl font-medium text-gray-200 sm:text-4xl`}
                  >
                    {item.name}
                  </h1>

                  <div className=" flex items-center text-gray-700 dark:text-gray-200">
                    <svg
                      aria-label="location pin icon"
                      className="h-6 w-6 fill-current"
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

                    <h1 className="px-2 text-sm"> {item.location}</h1>
                  </div>
                </div>
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
                        className="h-12 w-12 "
                        height={96}
                        width={96}
                        // @TODO add alternative text to avatar image schema
                        alt={`${photo.name} logo`}
                      />

                      <a
                        className="mt-2 cursor-pointer font-bold text-gray-700 dark:text-gray-200"
                        role="link"
                      >
                        {photo.name}
                      </a>
                    </div>
                  ))}
                </div>
                {/* <div className="flex flex-col items-center">
                <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/F36nQLCQ2FND3za-Eteeqg_96x96.png"
                  alt="avatar"
                />
                <a
                  className="cursor-pointer font-bold text-gray-700 dark:text-gray-200"
                  role="link"
                >
                  Clippers
                </a>
              </div>
              <div className="flex flex-col items-center">
                <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/clUGrhmWLos42p7HrNfumA_96x96.png"
                  alt="avatar"
                />
                <a
                  className="cursor-pointer font-bold text-gray-700 dark:text-gray-200"
                  role="link"
                >
                Sparks
                </a>
              </div> */}
              </div>
            ))}
          </div>
        </Container>
      </Layout>
      <Footer />

      <div className="container mx-auto px-10 pb-24 pt-44">
        <div className=" my-14 flex flex-row justify-evenly    ">
          <div className="w-3/4">
            <h1
              className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
            >
              Our Quest to Visit Every NBA & WNBA Arena 🏀
            </h1>
            <div className="h-1 w-20 rounded bg-pink-500"></div>
            <p
              className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
            >
              We are traveling near and far to every state/country to visit all
              the NBA and WNBA arena across the US and Canada. Follow us on this
              journey.
            </p>
          </div>

          <div className="w-1/4 rounded-lg border  bg-white p-4">
            <div>
              <span className="inline-block rounded-full bg-pink-300 px-2 py-1 text-xs font-light uppercase text-white">
                {arenas[0].visitedCount} of 37 Arenas visited
              </span>
            </div>
            <div className="mt-3 h-4 w-full rounded-full bg-gray-400">
              <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 p-0.5 text-center text-xs font-medium leading-none text-blue-100"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {arenas?.map((item) => (
            <div
              key={item._id}
              className={`w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 ${
                item.visited === false ? 'opacity-40 grayscale' : 'grayscale-0'
              } `}
            >
              <div className="static">
                {item.visited === true ? (
                  <span className="absolute z-10 ml-3  mt-3 rounded-full bg-gray-200 px-4 py-2  text-sm text-gray-600 ">
                    Visited: <PostDate dateString={item.date} />
                  </span>
                ) : (
                  ''
                )}
                <div className="relative">
                  {/* <img
                className="h-56 w-full object-cover object-center "
                src="https://www.cryptoarena.com/assets/img/CA_1130x665-a227b45b2c.jpg"
                alt="avatar"
              /> */}
                  {/* 
<img
                        width={400}
                        height={400}
                        alt={`Cover Image for ${item.name}`}
                        className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:p-6    lg:rounded-l-2xl"
                        src={urlForImage(item.productImage.asset._ref)
                          .width(400)
                          .height(400)
                          .format('webp')
                          .url()}
                      /> */}

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
                    className="h-56 w-full object-cover object-center "
                    height={300}
                    width={224}
                    // @TODO add alternative text to avatar image schema
                    alt={`${item.name} arena`}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-900 px-2 py-3">
                <h1
                  className={`${oswald.variable}  title-font mb-4 font-heading text-3xl font-medium text-gray-200 sm:text-4xl`}
                >
                  {item.name}
                </h1>

                <div className=" flex items-center text-gray-700 dark:text-gray-200">
                  <svg
                    aria-label="location pin icon"
                    className="h-6 w-6 fill-current"
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

                  <h1 className="px-2 text-sm"> {item.location}</h1>
                </div>
              </div>
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
                      className="h-12 w-12 "
                      height={96}
                      width={96}
                      // @TODO add alternative text to avatar image schema
                      alt={`${photo.name} logo`}
                    />

                    <a
                      className="mt-2 cursor-pointer font-bold text-gray-700 dark:text-gray-200"
                      role="link"
                    >
                      {photo.name}
                    </a>
                  </div>
                ))}
              </div>
              {/* <div className="flex flex-col items-center">
                <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/F36nQLCQ2FND3za-Eteeqg_96x96.png"
                  alt="avatar"
                />
                <a
                  className="cursor-pointer font-bold text-gray-700 dark:text-gray-200"
                  role="link"
                >
                  Clippers
                </a>
              </div>
              <div className="flex flex-col items-center">
                <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/clUGrhmWLos42p7HrNfumA_96x96.png"
                  alt="avatar"
                />
                <a
                  className="cursor-pointer font-bold text-gray-700 dark:text-gray-200"
                  role="link"
                >
                Sparks
                </a>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Arenas
