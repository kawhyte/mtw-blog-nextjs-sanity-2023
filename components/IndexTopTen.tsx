
import { Bed, CookingPot } from 'lucide-react';
import Button from 'ui/Button';
import dynamic from 'next/dynamic';
import SectionTitle from './SectionTitle';

// Dynamic import 
const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false }
);

export default function IndexTopTen() {
  return (
    // Outer container: Use flex, arrange in column on small, row on large.
    // Center items vertically on large screens.
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">

      {/* Left side content: Takes half width on large screens */}
      <div className="flex w-full flex-col lg:w-1/2">
        <SectionTitle
          header={'Our top Hotels & Restaurants recommendations.'}
          description={
            'Eats & Sleeps: Our Recommendations! Take a peek at our curated list of awesome spots to hit up.'
          }
        />
        <div className="flex pt-9 lg:mt-0 lg:flex-shrink-0">
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <Button icon={<Bed className="h-6 w-6 text-pink-500" />} link={'/top-hotel-picks'}>
              Hotel Picks
            </Button>
            <Button icon={<CookingPot className="h-6 w-6 text-pink-500" />} link={'/top-restaurant-picks'}>
              Restaurant Picks
            </Button>
          </div>
        </div>
      </div>

      {/* Right side container - Lottie Animation */}
      {/* - Hidden below lg, takes half width on lg+
          - Uses flexbox (`lg:flex`) to center its content (`justify-center`, `items-center`)
            only when displayed (on lg screens and up).
          - `mt-12 lg:mt-0` handles spacing relative to the content above/beside it. */}
      <div className="mt-12 w-full hidden lg:flex lg:w-1/2 lg:justify-center lg:items-center lg:mt-0">

        {/* Lottie Animation Wrapper - Controls the size constraint */}
        {/* - Takes full width up to max-w-md. Centered by the parent flex container. */}
        <div className="w-full max-w-sm"> {/* Use max-width to constrain animation size */}
          <PlayerWithNoSSR
            autoplay
            keepLastFrame // Optional prop
            loop
            src={'/watermelon.json'}
            // Make the player fill its wrapper width, height adjusts automatically
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}