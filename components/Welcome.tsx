import {
  Bed,
  Book,
  Clapperboard,
  Code,
  Coffee,
  Dumbbell,
  Footprints,
  Gamepad,
  Luggage,
  Music,
  Pizza,
  Ship,
  ToyBrick} from 'lucide-react';
import React from 'react';

import AvatarCard from './AvatarCard';
import CountriesCard from './CountriesCard';
import InterestCard from './InterestCard';
import SectionTitle from './SectionTitle';

// Interfaces for the data
interface Duo {
  id: number;
  color: string;
  name: string;
  image: string;
  quoteBy: string;
  quote: string;
}

interface Interest {
  icon: React.ComponentType<React.ComponentProps<typeof Book>>; // Use any icon as a reference for type
  label: string;
}

interface Country {
  code: string;
  name: string;
}

function Welcome(): JSX.Element {
  const duo: Duo[] = [
    {
      id: 1,
      color: 'indigo',
      name: 'Mr. Whyte',
      image: '/avatar_mr.png',
      quoteBy: '- Oscar Wilde',
      quote: 'Be yourself; everyone else is already taken.',
    },
    {
      id: 2,
      color: 'pink',
      name: 'Mrs. Whyte',
      image: '/avatar_mrs.png',
      quoteBy: '- Frank Zappa',
      quote: 'So many books, so little time',
    },
  ];

  const interests: Interest[] = [
    { icon: Pizza, label: 'Pizza' },
    { icon: Book, label: 'Reading' },
    { icon: Luggage, label: 'Traveling' },
    { icon: Code, label: 'Coding' },
    { icon: Gamepad, label: 'Retro Games' },
    { icon: Coffee, label: 'Coffee' },
    { icon: Footprints, label: 'Sneakers' },
    { icon: Dumbbell, label: 'Weightlifting' },
    { icon: Bed, label: 'Sleep' },
    { icon: Music, label: 'Music' },
    { icon: ToyBrick, label: 'Legos' },
    { icon: Clapperboard, label: 'Movies' },
    { icon: Ship, label: 'Cruise' },
  ];

  const countries: Country[] = [
    { code: 'HK', name: 'Hong Kong' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'SG', name: 'Singapore' },
    { code: 'CA', name: 'Canada' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'MX', name: 'Mexico' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'SE', name: 'Sweden' },
    { code: 'BS', name: 'The Bahamas' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
  ];

  return (
    <div className="container mx-auto space-y-16"> 
      <header className="mx-auto mb-12">
        <SectionTitle
          header="Meet the Dynamic Duo"
          description={`Hi! We are the Whytes. Welcome to our space on the interwebs. We are a husband and wife duo. We love to travel, relax & try new food.`} 
        />
      </header>

      <div className=" grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 px-5">
        <AvatarCard data={duo[0]} />
        <AvatarCard data={duo[1]} />
      </div>

      <InterestCard interests={interests} />
      <CountriesCard countries={countries} />
    </div>
  );
}

export default Welcome;