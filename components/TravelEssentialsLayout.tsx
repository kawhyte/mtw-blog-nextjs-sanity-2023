import { Badge, Card, Group, Image, Text } from '@mantine/core'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'
import Button from 'ui/Button'

import PostBody from './PostBody'
import StarRating from './StarRating'

const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
  console.log('Essential', posts)
  return (
    <>
      <div className="container flex justify-center mb-5 mt-10 px-3 text-gray-600  mx-auto sm:py-3">
        <div className=" mx-3 grid grid-cols-1  place-content-center gap-8   sm:grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-10 xl:grid-cols-3  ">
          {posts?.map((item) => (
            <div key={item._id}>
              <div
                className={` rounded-lg border-4 max-w-md   border-black  shadow-offsetIndigo  `}
              >

                <div> { item.recommend ? 
                <Badge  color="green" className=" ml-3 mt-3">
                  <p className={`${oswald.variable} text-xs uppercase`}>
                    {'Recommended'}
                  </p>
                </Badge>   : <Badge color="red"  className=" ml-3 mt-3">
                  <p className={`${oswald.variable} text-xs uppercase`}>
                    {'Not Recommended'}
                  </p>
                </Badge>
                
                
                }
                <div className="relative my-4 flex justify-center ">
                  <Image
                    width={200}
                    height={200}
                    placeholder="blur"
                    // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
                    className=" "
                    alt="hero"
                    src={
                      item?.productImage?.asset?._ref
                        ? urlForImage(item?.productImage?.asset?._ref)
                            .height(200)
                            .width(200)
                            .fit('crop')
                            .url()
                        : 'https://fakeimg.pl/1240x801'
                    }
                  />
                </div>
                </div>
                {/* <img
                    width={1500}
                    height={1500}
                    alt={`Cover Image for ${item.name}`}
                    className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:px-4 md:py-4 lg:rounded-l-2xl md:mt-0"
                    src={urlForImage(item.productImage.asset._ref)
                      .width(400)
                      .height(400)
                      .format('webp').blur(20)
                      .url()}
                  /> */}

                <div className="ml-6 flex flex-col   ">
                  <h2
                    className={` text-lg font-extrabold leading-8 text-gray-900 sm:text-xl sm:leading-9 `}
                  >
                    {item.name}
                  </h2>

                  <p className="mt-2 text-base leading-6 text-gray-500 ">
                    $20
                  </p>

                </div>

                

                <div className='ml-6 my-2'> 
                  <PostBody content={item.description} />
</div>
                <div className="mx-20 my-6">
                  {' '}
                  <Button link={item.link}> Get Item</Button>
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
