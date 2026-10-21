import cn from 'classnames'

interface SectionTitleProps {
  header: string
  description?: string
  align?: 'left' | 'center'
  /** Drop the container + side padding when the title sits inside a column
      that already has its own padding (e.g. the hotel review column) */
  flush?: boolean
}

export default function SectionTitle({
  header,
  description,
  align = 'left',
  flush = false,
}: SectionTitleProps) {
  const isCentered = align === 'center'

  return (
    <div
      className={cn(flush ? 'mb-6' : 'container mx-auto px-6 mb-6', {
        'text-center': isCentered,
      })}
    >
      <h2
        className={cn(
          'text-sm font-bold uppercase tracking-widest border-b-4 border-foreground pb-2 mb-6',
          { 'mx-auto max-w-fit': isCentered },
        )}
      >
        {header}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg max-w-4xl">
          {description}
        </p>
      )}
    </div>
  )
}
