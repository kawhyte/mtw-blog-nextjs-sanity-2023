import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'


const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})


const InstagramHighlights = ({ instagram }) => {

  return (
    <div className="container mx-auto  rounded-xl bg-yellow-50 px-10 py-12 ">
      <div className=" container mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1
            className={`${oswald.variable}  title-font  mb-2 font-heading text-2xl font-medium text-gray-900 sm:text-3xl`}
          >
            Latest Instagram Posts
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-5  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-4">
        {instagram &&
          instagram.slice(0, 15).map(
            (item) =>
              item.media_type !== 'VIDEO' && (
                <div key={item.id}>
                  {/* <InstagramEmbed url={item.url} width={328} /> */}
                  <a href={item.permalink}>
                    <img
                      className="aspect-square object-cover"
                      width={700}
                      height={700}
                      src={item.media_url}
                      alt={item.caption}
                    />
                  </a>

                  {/* <div className=" rounded overflow-hidden border w-full  bg-white mx-3 md:mx-0 lg:mx-0">
    <div className="w-full flex justify-between p-3">
      <div className="flex">
        <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
          <img src="https://avatars0.githubusercontent.com/u/38799309?v=4" alt="profilepic" />
        </div>
        <span className="pt-1 ml-2 font-bold text-sm">braydoncoyer</span>
      </div>
      <span className="px-2 hover:bg-gray-300 cursor-pointer rounded"><i className="fas fa-ellipsis-h pt-2 text-lg"></i></span>
    </div>
    <img width={600} height={600}  alt={item.caption} className="w-full bg-cover" src={item.media_url} />
    <div className="px-3 pb-2">
      <div className="pt-2">
        <i className="far fa-heart cursor-pointer"></i>
        <span className="text-sm text-gray-400 font-medium">12 likes</span>
      </div>
      <div className="pt-1">
        <div className="mb-2 text-sm">
          <span className="font-medium mr-2">MTW</span> {item.caption}
        </div>
      </div>
      <div className="text-sm mb-2 text-gray-400 cursor-pointer font-medium">View all 14 comments</div>
    
    </div>
  </div> */}

                  {/* <p className='truncate'>{item.caption}</p> */}
                </div>
              )
          )}
      </div>
    </div>
  )
}

export default InstagramHighlights
