import { Globe, Heart } from 'lucide-react'
import React from 'react'

import SectionTitle from './SectionTitle'
import { Section } from './ui/Section'

interface Duo {
  id: number
  color: string
  name: string
  image: string
}

const duo: Duo[] = [
  {
    id: 1,
    color: 'indigo',
    name: 'Mr. Whyte',
    image: '/avatar_mr.png',
  },
  {
    id: 2,
    color: 'pink',
    name: 'Mrs. Whyte',
    image: '/avatar_mrs.png',
  },
]

function Welcome(): JSX.Element {
  return (
    <Section as="div" spacing="tight" className="container mx-auto space-y-6">
      {/* Bio: text left, avatars right */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
        <div className="w-full lg:w-3/5">
          <SectionTitle
            header="A Little About Us"
            description={`We're Rene and Kenny, and we travel for basketball. We're on a mission to cross every single NBA and WNBA arena off our list. But tip-off is only half the trip. This space is our playbook for the culture around it—the hotels we crash in, the local food we hunt down, and the sneakers we pack. Welcome to our courtside lifestyle.`}
          />
        </div>

        <div className="w-full lg:w-2/5 flex justify-center items-start gap-10 pt-4 lg:pt-0">
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

      {/* Compact stats strip */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 px-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-indigo-500" />
          <strong className="text-foreground">18</strong> countries visited
        </span>
        <span className="text-foreground/30">·</span>
        <span className="flex items-center gap-1.5">
          <Heart className="h-4 w-4 text-pink-500" />
          <strong className="text-foreground">13+</strong> interests
        </span>
      </div>
    </Section>
  )
}

export default Welcome
