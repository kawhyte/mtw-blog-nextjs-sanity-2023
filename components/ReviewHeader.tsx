import dynamic from 'next/dynamic'
import { LiaCrownSolid } from 'react-icons/lia'

const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
)

interface ReviewHeaderProps {
  title: string
  summary: string
  img?: any
  contentType?: 'post' | 'hotel' | 'food'
}

function ReviewHeader({ title, summary, img, contentType }: ReviewHeaderProps) {
  const showCrownLabel = contentType === 'hotel' || contentType === 'food'

  return (
    <div className="container mx-auto max-w-7xl px-4 py-9 pb-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center px-5 pt-8 align-middle md:items-start lg:col-span-2">
          {showCrownLabel && (
            <div className="mb-4 flex items-center gap-2 border-b-4 border-foreground pb-2">
              <LiaCrownSolid className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Our Curated List
              </span>
            </div>
          )}

          <h1 className="mb-1 font-epilogue text-5xl font-extrabold leading-tight tracking-tighter text-primary md:text-[4.3rem] lg:text-[4.7rem]">
            {title}
          </h1>

          <p className="mb-4 mt-4 max-w-xl leading-relaxed">{summary}</p>
        </div>

        <div className="hidden items-center justify-center md:flex lg:col-span-2">
          <PlayerWithNoSSR
            autoplay
            keepLastFrame
            loop
            src={img}
            style={{ width: '100%', height: '240px', maxWidth: '360px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default ReviewHeader
