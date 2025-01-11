import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'
import SectionTitle from './SectionTitle'
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export default function Youtube({ link }) {
  // Early return if link is invalid or doesn't match YouTube pattern
  if (
    !link ||
    !link.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm)
  ) {
    return null // Or display an error message
  }

  return (
    <>
      <hr className="border-accent-2 mb-12 mt-12" />

      <div className="mx-5 sm:mx-0">
        <div className="mb-8 flex w-full flex-col  font-medium lg:mb-9">
          <SectionTitle
            header={link.title ? link.title : 'Video'}
            description={undefined}
          ></SectionTitle>
        </div>

        {/* Use a responsive wrapper with padding-bottom for aspect ratio */}
        <div
          className="container relative mb-12  w-full max-w-5xl sm:mx-auto md:mb-24"
          style={{ paddingBottom: '56.25%' }}
        >
          <div className="absolute inset-0 h-full w-full">
            <ReactPlayer
              url={link}
              width="100%"
              height="85%"
              controls={true}
              loop
              muted
            />
          </div>
        </div>
      </div>
    </>
  )
}
