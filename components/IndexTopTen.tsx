import { LiaCrownSolid } from 'react-icons/lia'
import Button from 'ui/Button'

import SectionTitle from './SectionTitle'

export default function IndexTopTen() {
  return (
    <div className=" flex justify-between">
      <div className="  flex w-full flex-col    lg:w-1/2">
        <SectionTitle
          header={'Our top Hotels & Restaurants recommendations.'}
          description={
            'Eats & Sleeps: Our Recommendations! Take a peek at our curated list of awesome spots to hit up.'
          }
        />

        <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
          <div className=" inline-flex ">
            <Button icon={<LiaCrownSolid className="h-6 w-6 text-pink-500   " />} link={'/picks'}>Our Top Picks</Button>
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
