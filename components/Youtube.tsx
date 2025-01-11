import { oswald } from "app/fonts";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function Youtube({ link }) {
  // Early return if link is invalid or doesn't match YouTube pattern
  if (
    !link ||
    !link.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)
  ) {
    return null; // Or display an error message
  }

  return (
    <>
      <hr className="mb-12 mt-12 border-accent-2" />

      <div className="mx-5 sm:mx-0">
        <div className="mb-10 flex w-full flex-col text-center font-medium lg:mb-12">
          <p
            className={`${oswald.variable} font-heading text-left text-5xl font-semibold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-5xl`}
          >
            {link.title ? link.title : "Video"}
          </p>
        </div>

        {/* Use a responsive wrapper with padding-bottom for aspect ratio */}
        <div className="relative max-w-5xl mb-12 w-full sm:mx-0 md:mb-24" style={{ paddingBottom: '56.25%' }}> 
          <div className="absolute inset-0 h-full w-full">
            <ReactPlayer
              url={link}
              width="100%"
              height="100%"
              controls={true}
              loop
              muted
               
            />
          </div>
        </div>
      </div>
    </>
  );
}