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
            className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm"
          >
            <img
              src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
              alt={`${country.name} flag`}
              className="h-5 w-6 object-cover rounded-full border-2"
            />
            <span className="text-sm">{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountriesCard
