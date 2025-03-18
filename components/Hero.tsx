import { inter, oswald } from 'app/fonts'
import { ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { LiaBasketballBallSolid } from 'react-icons/lia'
import Button from 'ui/Button'

// Optimized animation array - only load necessary data
const animation = [
  { url: 'basketball2.json' }, 
  { url: 'basketball2.json' },
  { url: 'basketball2.json' },
];

function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const container = useRef(null);
  const randomNum = Math.floor(Math.random() * animation.length);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  // Dynamically import the Lottie player with SSR disabled
  const PlayerWithNoSSR = dynamic(
    () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
    { ssr: false }
  );

  return (
    <>
      <section className="body-font container mx-auto text-gray-600 max-w-[81rem] relative">
        <div className="container mx-auto flex flex-col justify-between pt-12 md:flex-row">
          <div className="flex flex-col mx-6 md:mx-0 sm:mb-0 md:pl-8 xl:mb-0 xl:w-full xl:items-start xl:pr-16 xl:text-left 2xl:pr-5 ">
            <div
              className=" font-oswald tracking-tighter z-30 mb-6 flex flex-col font-heading text-[3.5rem] font-bold uppercase leading-none text-gray-700 md:text-[3.9rem] lg:w-10/12 lg:text-[5.2rem] xl:text-[5.8rem] 2xl:text-[6rem] whitespace-nowrap"
            >
              <p>Our Quest</p>
              <p>to Visit Every</p>
              <p className="text-pink-500 md:text-blue-500 lg:text-green-500 xl:text-yellow-500 2xl:text-pink-500">
                NBA & WNBA
              </p>
              <p>Arena</p>
            </div>

            <p className={`${inter.variable} z-30 max-w-2xl font-sans text-lg leading-relaxed md:text-lg xl:text-xl`}>
              We are traveling near and far to every state/country to visit and rank all the NBA and WNBA arenas across
              the US and Canada. Follow us on this journey.
            </p>

            <div className="flex pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex">
                <Button
                  icon={<LiaBasketballBallSolid className="h-7 w-8 text-pink-500" />}
                  link={'/arenas'}
                >
                  follow our Journey
                </Button>
              </div>
            </div>
          </div>

          {/* Conditionally render Lottie player to improve initial load */}
          <div className="-mt-12 hidden w-5/6 max-w-sm md:block md:mt-0 lg:w-full lg:max-w-md xl:max-w-lg">
            {isMounted && (
              <PlayerWithNoSSR autoplay keepLastFrame loop src={animation[randomNum]?.url} />
            )}
          </div>
        </div>

        {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-600" />
        </div> */}
      </section>
    </>
  );
}

export default Hero;