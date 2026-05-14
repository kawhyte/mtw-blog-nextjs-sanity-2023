interface ReviewHeaderProps {
  title: string
  summary: string
  img?: any // kept for backward compat, no longer rendered
  contentType?: 'post' | 'hotel' | 'food'
}

const EYEBROW_LABELS: Record<string, string> = {
  hotel: 'Hotel Reviews',
  food: 'Food Reviews',
  post: 'Travel Guides',
}

function ReviewHeader({ title, summary, contentType }: ReviewHeaderProps) {
  const eyebrow = contentType ? EYEBROW_LABELS[contentType] : null

  return (
    <section className="bg-primary-soft-background py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        )}

        <h1 className="font-epilogue mb-4 text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mb-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {summary}
        </p>
      </div>
    </section>
  )
}

export default ReviewHeader
