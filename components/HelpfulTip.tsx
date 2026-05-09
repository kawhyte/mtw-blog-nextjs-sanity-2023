import { Lightbulb } from 'lucide-react'

import PostBody from './PostBody'

export default function HelpfulTip({ tip }) {
  if (!tip) {
    return null
  }

  return (
    <div className="my-16 bg-accent border-4 border-foreground rounded-lg shadow-brutalist p-6 sm:p-8">
      <div className="flex items-start gap-x-4">
        <div className="flex-shrink-0 border-2 border-foreground rounded p-1.5 bg-accent-foreground/10">
          <Lightbulb className="h-6 w-6 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold uppercase tracking-wide text-accent-foreground mb-2">
            Helpful Tip
          </h3>
          <div className="prose prose-sm sm:prose-base max-w-none text-accent-foreground/90">
            <PostBody content={tip} />
          </div>
        </div>
      </div>
    </div>
  )
}
