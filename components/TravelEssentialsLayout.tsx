import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'

import PostBody from './PostBody'

const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
//console.log('KENNY Essentials 2', posts)
  return (
    <>
    
      <div className="container mx-auto  px-3 py-3 text-gray-600">
        <div className="  grid grid-cols-1 content-center gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4  ">
          {posts.map((item) => (
            <div key={item.name} >
              <div key={item.name}  className="relative mx-auto   max-w-sm ">
                <div
                  className={` ${item.background}  max-w-sm rounded-lg shadow-md  dark:border-gray-700 `}
                >
                  <Link 
                    href={item.link}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* <Badge
                          className="absolute mx-5 mt-3"
                          variant="dot"
                          color="gray"
                        >
                          {item.categoryName}
                        </Badge> */}
                    <div className="pb-5"></div>
                    <div className=" mx-20 md:mx-0 md:pt-0  ">
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
                    <section className="flex flex-col justify-center">
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
                    </section>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TravelEssentialLayout
