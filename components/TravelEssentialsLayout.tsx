import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'

import PostBody from './PostBody'


const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
  //console.log('KENNY Essentials 2', posts)
  return (
    <>
      <section className="container mx-auto  py-14  text-gray-600 ">
        <div className="container mx-auto px-5 py-24 pt-16">
          <div className="mb-20 flex w-full  justify-between">
            <div className="  grid grid-cols-1 content-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5  ">
              {posts.map((item) => (
                <>
                  <div className="mx-aut0 relative   max-w-2xl">
                    <div
                      className={` ${item.background}  max-w-sm rounded-lg shadow-md  dark:border-gray-700 `}
                    >
                      <Link href={item.link}>
                        {/* <span
                          className={` ${item.background}-500 absolute mx-5 mt-3  uppercase rounded px-2  py-1 text-base font-medium  text-white`}
                        >
                          {item.categoryName}
                        </span> */}
                        <Badge
                          className="absolute mx-5 mt-3"
                          variant="dot"
                          color="gray"
                        >
                          {item.categoryName}
                        </Badge>
<div className='pb-5'></div>
                        <div className=" mx-20  pt-10 md:mx-0 md:pt-0  ">
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
                          />
                        </div>

                        {/* <Text  fw={500}>  {item.name}</Text> */}

                        <Badge
                          size="lg"
                          className=" mx-5 mt-6"
                          variant="gradient"
                          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        >
                          {item.name}
                        </Badge>
                        <Text className="pb-1" fw={500}>
                          <PostBody content={item.description} />
                        </Text>
                      </Link>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TravelEssentialLayout
