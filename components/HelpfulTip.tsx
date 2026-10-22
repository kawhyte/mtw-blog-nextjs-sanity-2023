import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { Lightbulb } from 'lucide-react'

// The tip is a short rich-text note, so it gets its own compact text styles
// rather than PostBody's article spacing (which indents every paragraph)
const tipComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="[&+p]:mt-3">{children}</p>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary underline decoration-2 underline-offset-2 hover:opacity-75"
      >
        {children}
      </a>
    ),
  },
}

/** "Insider tip" card: white, 3px border, pink label, matches "Ratings at a glance" */
export default function HelpfulTip({ tip }) {
  if (!tip) {
    return null
  }

  return (
    <aside className="my-10 flex items-start gap-4 rounded-3xl border-[3px] border-border-bold bg-card p-5 sm:gap-5 sm:px-7 sm:py-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary-soft-background">
        <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-2 pt-0.5">
        <span className="text-xs font-bold tracking-[0.14em] text-primary">
          INSIDER TIP
        </span>
        <div className="text-base leading-relaxed text-foreground/80 sm:text-lg">
          <PortableText value={tip} components={tipComponents} />
        </div>
      </div>
    </aside>
  )
}
