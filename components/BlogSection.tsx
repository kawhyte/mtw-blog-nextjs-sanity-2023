import { oswald } from 'app/fonts'
import { twMerge } from 'tailwind-merge'

export default function BlogSection({ children,className, ...props }) {
  return (
    <section  className={ twMerge ("container mx-auto  sm:rounded-2xl  py-9 text-gray-600 lg:mb-24  ",className)} {...props}>
            <div className="flex-col flex justify-between ">
        {children}
      </div>
    
    </section>
  )
}
