import { video } from '@cloudinary/url-gen/qualifiers/source'
import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'


//  const url = encodeURIComponent("https://scontent-sjc3-1.cdninstagram.com/v/t51.29350-15/363827451_786834503238969_6827302780644465821_n.webp?stp=dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=POPCItyJEboAX9KBQbd&_nc_ht=scontent-sjc3-1.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfDkaxgQL6p2RE-2G66Zh1Qhtac8cVRr1XOFVlO-1j3iKQ&oe=65247349")

const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})


const InstagramHighlights = ({ instagram }) => {
 console.log("Instgram URLLL", instagram)
//  console.log("url ", url )
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
          instagram.slice(0, 12).map(
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
                      // src={`${item.permalink}media/?size=m`}
                      // src={'https://www.instagram.com/p/CtmGR04Lx-I/media/?size=m'}
                    
                      alt={item.caption}
                    />
                  </a>

  

                  {/* <p className='truncate'>{item.caption}</p> */}


                </div>) ||

              item.media_type == 'VIDEO' &&(
<a href={item.permalink}>
                <img
                      className="aspect-square object-cover cursor-pointer"
                      width={700}
                      height={700}
                      src={item.thumbnail_url}
                      // src={`${item.permalink}media/?size=m`}
                      // src={'https://www.instagram.com/p/CtmGR04Lx-I/media/?size=m'}
                    
                      alt={item.caption}
                    />

</a>
              )


             
          )}
      </div>
    </div>
  )
}

export default InstagramHighlights
