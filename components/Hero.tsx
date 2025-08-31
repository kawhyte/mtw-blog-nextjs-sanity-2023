import { inter, montserrat, raleway } from 'app/fonts'
import dynamic from 'next/dynamic'
import { useEffect,  useState } from 'react'
import { LiaBasketballBallSolid } from 'react-icons/lia'
import Button from 'ui/Button'

// Optimized animation array - only load necessary data
const animation = [
  { url: 'basketball2.json' },
  { url: 'basketball.json' },
];

function Hero() {
  const [isMounted, setIsMounted] = useState(false);

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
      <section className="body-font container mx-auto text-gray-600 max-w-324 relative">
        <div className="container mx-auto flex flex-col justify-between pt-12 md:flex-row">
        <div className="flex flex-col mx-6 md:mx-0 sm:mb-0 md:pl-8 xl:mb-0 xl:w-full xl:items-start xl:pr-16 xl:text-left 2xl:pr-5">
  {/* Hero Headline */}
  <div className="flex flex-col mx-6 md:mx-0 md:pl-8 xl:w-full xl:items-start xl:pr-16 2xl:pr-5">
  {/* Hero Headline */}
  <div
    className={`${montserrat.variable} font-adventure-heading z-30 mb-12 flex flex-col font-extrabol uppercase leading-tight tracking-tight text-blog-heading space-y-0.5 lg:w-10/12 font-adventure-heading capitalize text-adventure-subtitle z-10 py-2 text-left text-blog-heading`}
  >
    <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5rem]">
      Our Quest
    </p>
    <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5rem]">
      to Visit Every
    </p>
    <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5rem] text-pink-500 drop-shadow-lg">
      NBA & WNBA
    </p>
    <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5rem]">
      Arena
    </p>
  </div>

  {/* Hero Subtext */}
  <p className={`${raleway.variable} z-30 max-w-2xl text-lg md:text-xl xl:text-2xl leading-relaxed text-blog-text mb-8`}>
    We&apos;re hitting the road (like, seriously hitting all the roads!) to check
    out and rank every single NBA and WNBA arena across the US and Canada.
    Buckle up and follow our adventure!
  </p>

  {/* CTA Button */}
  <div className="flex pt-9 lg:mt-0 lg:shrink-0">
    <Button
      icon={<LiaBasketballBallSolid className="h-7 w-8 text-pink-500" />}
      link={'/arenas'}
      className="uppercase tracking-wide py-3 px-5 bg-pink-500 text-white hover:bg-pink-600 shadow-md"
    >
      Follow Our Journey
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

      </section>
    </>
  );
}

export default Hero;