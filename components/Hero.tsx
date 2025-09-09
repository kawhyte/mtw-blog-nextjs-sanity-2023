import { inter, montserrat, raleway } from 'app/fonts'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LiaBasketballBallSolid } from 'react-icons/lia'
import Button from 'ui/Button'

// Optimized animation array - only load necessary data
const animation = [{ url: 'basketball2.json' }, { url: 'basketball.json' }]

function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  const randomNum = Math.floor(Math.random() * animation.length)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Dynamically import the Lottie player with SSR disabled
  const PlayerWithNoSSR = dynamic(
    () =>
      import('@lottiefiles/react-lottie-player').then(
        (module) => module.Player,
      ),
    { ssr: false },
  )

  return (
    <>
      <section className="body-font container mx-auto relative px-4 text-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full flex-col items-center pt-12 md:flex-row md:items-start md:justify-between md:pt-16 lg:pt-24 xl:max-w-[1200px]">
          {/* Text Content Container */}
          <div className="z-10 flex flex-col items-center text-center md:items-start md:text-left">
            {/* Hero Headline */}
            <div
              className={`${montserrat.variable} font-adventure-heading mb-8 flex flex-col uppercase leading-tight tracking-tight text-blog-heading space-y-0.5 text-adventure-subtitle py-2`}
            >
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-7xl xl:text-[5rem]">
                Our Quest
              </h1>
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-7xl xl:text-[5rem]">
                to Visit Every
              </h1>
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-7xl xl:text-[5rem] text-pink-500 drop-shadow-lg">
                NBA & WNBA
              </h1>
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-7xl xl:text-[5rem]">
                Arena
              </h1>
            </div>

            {/* Hero Subtext */}
            <p
              className={`${raleway.variable} mb-8 max-w-2xl text-lg leading-relaxed text-blog-text md:text-xl xl:text-2xl`}
            >
              We&apos;re hitting the road (like, seriously hitting all the
              roads!) to check out and rank every single NBA and WNBA arena
              across the US and Canada. Buckle up and follow our adventure!
            </p>
<Link href={'/arenas'}>
Hello</Link>
            {/* CTA Button */}
            <div className="flex pt-4 lg:mt-0 lg:shrink-0">
              <Button
                icon={
                  <LiaBasketballBallSolid className="h-7 w-8 text-pink-500" />
                }
                link={'/arenas'}
              >
                Follow Our Journey
              </Button>
            </div>
          </div>

          {/* Lottie Player Container - hidden on small screens */}
          <div className="hidden w-5/6 max-w-sm lg:block md:mt-0 lg:w-full lg:max-w-md xl:max-w-lg">
            {isMounted && (
              <PlayerWithNoSSR
                autoplay
                keepLastFrame
                loop
                src={animation[randomNum]?.url}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
