import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'
import { InstagramEmbed } from 'react-social-media-embed'

const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

let instagram = [
  {
    url: 'https://www.instagram.com/p/CqzLI_or4QD/',
  },
  {
    url: 'https://www.instagram.com/p/CtDelhSOMYc/',
  },
  {
    url: 'https://www.instagram.com/p/CtSc9f5rTcL/',
  },
  {
    url: 'https://www.instagram.com/p/CuaSdGqvqf8/',
  },
  {
    url: 'https://www.instagram.com/p/CrW6zyzPxVK/',
  },
  {
    url: "https://www.instagram.com/p/CtScyA3PdUH/",
  },
]
const InstagramHighlights = () => {
  return (
    <div className="rounded-xl bg-yellow-50 px-10 py-12 ">
          <div className=" container mx-auto mb-10 flex w-full flex-wrap">
            <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
              <h1 className={ `${oswald.variable}  font-heading  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl`}>
                Featured Instagram Posts
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>
          </div>
          <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            {instagram.map((item) => (
              <div key={item.url}>
                <InstagramEmbed url={item.url} width={328} />
              </div>
            ))}
          </div>
        </div>

  )
}

export default InstagramHighlights
