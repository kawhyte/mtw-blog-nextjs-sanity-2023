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
  ToyBrick,
} from 'lucide-react'
import React from 'react'

import CountriesCard from './CountriesCard'
import InterestCard from './InterestCard'
import SectionTitle from './SectionTitle'
import { Section } from './ui/Section'

// Interfaces for the data
interface Duo {
  id: number
  color: string
  name: string
  image: string
  quoteBy: string
  quote: string
}

interface Interest {
  icon: React.ComponentType<React.ComponentProps<typeof Book>>
  label: string
}

interface Country {
  code: string
  name: string
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
  ]

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
  ]

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
  ]

  return (
    <Section as="div" spacing="tight" className="container mx-auto space-y-8">
      {/* Top row: text left, avatars right — mirrors Travel Gear / IndexTopTen layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
        <div className="w-full lg:w-1/2">
          <SectionTitle
            header="A Little About Us"
            description={`We're Rene and Kenny, and we travel for basketball. We're on a mission to cross every single NBA and WNBA arena off our list. But tip-off is only half the trip. This space is our playbook for the culture around it—the hotels we crash in, the local food we hunt down, and the sneakers we pack. Welcome to our courtside lifestyle.`}
          />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-start gap-10 pt-4 lg:pt-0">
          {duo.map((person) => (
            <div key={person.id} className="flex flex-col items-center gap-2">
              <div
                className={`rounded-full p-3 ${
                  person.color === 'indigo' ? 'bg-indigo-100' : 'bg-pink-100'
                }`}
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-28 w-28 rounded-full object-cover"
                />
              </div>
              <span
                className={`text-sm font-semibold ${
                  person.color === 'indigo' ? 'text-indigo-500' : 'text-primary'
                }`}
              >
                {person.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interests and Countries — unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-5">
        <InterestCard interests={interests} />
        <CountriesCard countries={countries} />
      </div>
    </Section>
  )
}

export default Welcome
