import { oswald } from 'app/fonts' 

interface SectionTitleProps {
  header: string;
  description?: string; // Optional description prop
}

export default function SectionTitle({ header, description }: SectionTitleProps) {
  return (
    <div className="container mx-auto px-6 flex w-full flex-col justify-between pr-5 pt-8">
      <h1 className="font-adventure-heading capitalize text-adventure-subtitle z-10 py-2 text-left text-blog-heading">
        {header}
      </h1>
      <div className="h-1 w-20 rounded bg-brand-primary"></div>

      {description && (
        <p className="font-adventure-body mt-4 text-sm text-blog-text-light leading-relaxed md:text-base lg:text-lg max-w-3xl"> 
          {description}
        </p>
      )}
    </div>
  )
}