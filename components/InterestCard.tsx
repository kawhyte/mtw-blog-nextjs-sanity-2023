import { oswald } from 'app/fonts'
import { Book } from 'lucide-react'
import React from 'react'

interface Interest {
  icon: React.ComponentType<React.ComponentProps<typeof Book>>
  label: string
}

interface InterestCardProps {
  interests: Interest[]
}

function InterestCard({ interests }: InterestCardProps) {
  return (
    <div className="max-w-8xl w-full rounded-3xl bg-secondary-soft-background p-6">
      <h2 className=" font-montserrat my-4  mb-6    text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
        BEYOND THE HARDWOOD
      </h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border-4 border-foreground shadow-brutalist rounded-lg font-bold uppercase transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1F2937] bg-white px-3 py-1.5"
          >
            <item.icon className="h-6 w-6 text-violet-500" />
            <span className="text-nowrap text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InterestCard
