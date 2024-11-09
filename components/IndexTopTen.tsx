import { inter, oswald } from 'app/fonts'
import Link from 'next/link'
import Button from 'ui/Button'

import SectionTitle from './SectionTitle'

export default function IndexTopTen() {
  return (
    <div className=" flex justify-between">
      <div className="  flex w-full flex-col    lg:w-1/2">
        <SectionTitle
          header={'Our top Hotels & Restaurants recommendations.'}
          description={
            'Our very own curated list of places you should consider visiting.'
          }
        />

        <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
          <div className=" inline-flex ">
            <Button link={'/top_picks'}>Our Top Picks</Button>
          </div>
        </div>

       
      </div>
      <div className=" mt-12 hidden h-full lg:block">
        <img
          src="/relaxing.svg"
          width={356}
          height={255}
          alt="Lady on beach
          ball"
        />
      </div>
    </div>
  )
}
