import { oswald } from 'app/fonts'

export default function SectionTitle({ children }) {
  return (
    <div>
      <h1
        className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
      >
        {children}
      </h1>
      <div className="h-1 w-20 rounded bg-pink-500"></div>
    </div>
  )
}
