import { inter, oswald } from 'app/fonts'

export default function SectionTitle({ header, description }) {
  return (
    <div className=" container mx-auto  flex w-full flex-col justify-between px-5   ">
      <h1
        className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-5xl`}
      >
        {header}
      </h1>
      <div className="h-1 w-20 rounded bg-pink-500"></div>

      <p
        className={` ${inter.variable} font-secondary mt-4 text-sm text-gray-500 leading-relaxed md:text-base  lg:text-lg max-w-3xl `}
      >
        {description}
      </p>
    </div>
  )
}
