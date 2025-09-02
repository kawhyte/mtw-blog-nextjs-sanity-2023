import { oswald } from 'app/fonts';
import cn from 'classnames';

interface SectionTitleProps {
  header: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({ header, description, align = 'left' }: SectionTitleProps) {
  const isCentered = align === 'center';

  return (
    <div className={cn("container mx-auto px-6 mb-6", {
      "text-center": isCentered
    })}>
      <h1 className="font-adventure-heading capitalize text-2xl sm:text-3xl md:text-4xl font-extrabold text-blog-heading">
        {header}
      </h1>
      <div className={cn("h-1.5 w-24 mt-2 rounded-full bg-brand-primary", {
        "mx-auto": isCentered
      })}></div>

      {description && (
        <p className="font-adventure-body mt-4 text-base leading-relaxed text-blog-text-light md:text-lg lg:text-xl max-w-4xl">
          {description}
        </p>
      )}
    </div>
  );
}