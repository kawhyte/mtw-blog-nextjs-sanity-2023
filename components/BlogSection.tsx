import { oswald } from 'app/fonts'
import { twMerge } from 'tailwind-merge'

export default function BlogSection({ children, className, ...props }) {
  return (
    <section
      className={twMerge(
        'container mx-auto sm:rounded-2xl py-16 md:py-24 text-gray-600',
        className,
      )}
      {...props}
    >
      <div className="flex-col flex justify-between ">{children}</div>
    </section>
  )
}
