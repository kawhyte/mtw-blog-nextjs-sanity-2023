import { inter, oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import PostDate from './PostDate'
import Link from 'next/link'

const ArenasIndexPage = ({ arenas }) => {
  console.log('arenas 77 ', arenas[0])

  return (
<> 
<div className=" container mx-auto flex   md:mt-96 my-44 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50 pr-3 rounded-xl">
      <div className="z-20 w-full px-4  py-12 text-start sm:px-6 lg:w-1/2 lg:px-8 lg:py-16">
      <h1
            className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
          >
            Our Quest to Visit Every NBA & WNBA Arena 🏀
          </h1>
          <p
            className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
          >
            We are traveling near and far to every state/country to visit all
            the NBA and WNBA arena across the US and Canada. Follow us on this
            journey.
          </p>
        <div className="lg:mt-0 lg:flex-shrink-0">
          <div className="mt-12 inline-flex rounded-md shadow ">
            <Link href="/arenas" passHref legacyBehavior>
              <button
                type="button"
                className="w-full rounded-lg  bg-yellow-400 px-6 py-2 text-center text-base font-semibold text-black shadow-md transition duration-200 ease-in hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2  focus:ring-offset-yellow-200 "
              >
                View Our Journey ⛹🏾‍♀️
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-1/2  right-12 top-0  hidden h-full lg:block">
      <div className='grid grid-cols-4 gap-3'> 
      {arenas?.map((item) => (
        <div
          key={item._id}
          className={`w-full max-w-sm overflow-hidden  text-gray-500 ${item.visited === false ? "grayscale opacity-80" : "grayscale-0" } `}
        >
          <div className="static">
            {/* {item.visited === true ?
              <span className="absolute z-10 ml-3  mt-3 rounded-full bg-gray-200 px-4 py-2  text-sm text-gray-600 ">
                Visited: <PostDate dateString={item.date} />
              </span> :  ""
            } */}
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
{/* 
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
              /> */}
            </div>
          </div>

          <div className="flex flex-row items-center justify-center  px-2 py-3">
            {/* <h1
              className={`${oswald.variable}  title-font mb-4 font-heading text-lg font-medium text-gray-200 sm:text-xl`}
            >
              {item.name}
            </h1> */}

            <div className=" flex items-center ">
              {/* <svg
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
              </svg> */}

              {/* <h1 className="px-2 text-sm"> {item.location}</h1> */}
            </div>
          </div>
          <div className=" flex flex-row flex-wrap items-center justify-evenly ml-10">



          <div
                key={item.gallery[0].name}
                className="my-4 flex flex-col items-center justify-between  "
              >
                {/* <img
                  className="mx-4 hidden h-10 w-10 rounded-full object-cover sm:block"
                  src="https://ssl.gstatic.com/onebox/media/sports/logos/4ndR-n-gall7_h3f7NYcpQ_96x96.png"
                  alt="avatar"
                /> */}

                <img
                  src={
                    item.gallery[0]?.asset?._ref
                      ? urlForImage(item.gallery[0])
                          .height(96)
                          .width(96)
                          .fit('crop')
                          .url()
                      : ''
                  }
                  className=" h-20 w-20 rounded-full"
                  height={96}
                  width={96}
                  // @TODO add alternative text to avatar image schema
                  alt={`${item.gallery[0].name} logo`}
                />

                <a
                  className="mt-2 cursor-pointer font-bold text-gray-900 "
                  role="link"
                >
                  {item.gallery[0].name}
                </a>
              </div>






            {/*  */}
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
    </div>











    
    </>
  )
}

export default ArenasIndexPage
