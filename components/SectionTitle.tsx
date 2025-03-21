import { oswald } from 'app/fonts' 

interface SectionTitleProps {
  header: string;
  description?: string; // Optional description prop
}

export default function SectionTitle({ header, description }: SectionTitleProps) {
  return (
    <div className="container mx-auto flex w-full flex-col justify-between px-5 pt-8">
      <h1 className="font-montserrat   mb-3 text-3xl   sm:text-5xl  font-bold text-gray-900">
        {header}
      </h1>
      <div className="h-1 w-20 rounded bg-pink-500"></div>

      {description && (
        <p className={`${oswald.variable} mt-4 text-sm text-gray-500 leading-relaxed md:text-base lg:text-lg max-w-3xl`}> 
          {description}
        </p>
      )}
    </div>
  )
}