
import { oswald } from "app/fonts";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });


export default function Youtube({ link }) {
  // console.log('YOUTUBE ', link)

  return (
    <>
      <hr className="mb-12 mt-12 border-accent-2" />

      {link?.match(
        /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm
      ) && (
        <>
          <div className="mb-10 flex w-full flex-col text-center font-medium lg:mb-12">
            <div className="flex ">
            <p className={`${oswald.variable} font-heading text-left text-5xl font-semibold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-5xl`}>

              
                {link.title ? link.title : 'Video'}
              </p>
            </div>
          </div>

          <div
            className="-mx-5 mb-12 max-w-5xl sm:mx-0 md:mb-24"
            style={{ aspectRatio: 16 / 9 }}
          >
            <div className=" h-full w-full">
              <ReactPlayer
                // className="react-player"
                url={link}
                width={'100%'}
                height={'100%'}
                controls={true}
                loop
                muted
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

{
  /* <style>
  .video-wrapper {
    aspect-ratio: 16 / 9;
  }

  .video-wrapper iframe {
    width: 100%;
    height: 100%;
  }
</style> */
}
