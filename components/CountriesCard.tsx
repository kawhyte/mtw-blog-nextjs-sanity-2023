import { oswald } from 'app/fonts'
import React from 'react'

interface Country {
  name: string
  code: string
}

interface CountriesCardProps {
  countries: Country[]
}

function CountriesCard({ countries }: CountriesCardProps) {
  return (
    <div className="max-w-8xl w-full rounded-3xl bg-primary-soft-background  p-6">
      <h2 className=" font-montserrat my-4  mb-6    text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
        Countries we&apos;ve visited
      </h2>
      <div className="flex flex-wrap gap-2">
        {countries.map((country) => (
          <div
            key={country.code}
            className="flex items-center gap-2 border-4 border-foreground shadow-brutalist rounded-lg font-bold uppercase transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1F2937] bg-white px-3 py-1.5"
          >
            <img
              src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
              alt={`${country.name} flag`}
              className="h-5 w-6 object-cover rounded-sm"
            />
            <span className="text-sm">{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountriesCard
