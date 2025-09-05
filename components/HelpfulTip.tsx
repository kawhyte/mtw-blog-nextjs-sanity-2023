import { Lightbulb } from 'lucide-react' // Using lucide-react for a clean icon

import PostBody from './PostBody' // Assuming this component renders rich text

// You can place this component wherever you need to display a tip.
// It expects a 'tip' prop containing the rich text/markdown content.
export default function HelpfulTip({ tip }) {
  // If there's no tip content, the component won't render anything.
  if (!tip) {
    return null
  }

  return (
    // Main container using the 'accent' theme colors for a distinct look.
    <div className="my-16 bg-accent rounded-2xl border-l-8 border-accent-foreground p-6 sm:p-8">
      <div className="flex items-start gap-x-4">
        {/* Icon to visually signal that this is a "tip" or "idea". */}
        <div>
          <Lightbulb className="h-8 w-8 text-accent-foreground" />
        </div>

        {/* Content Section */}
        <div className="flex-1">
          {/* Title of the callout box. */}
          <h3 className="text-2xl font-bold text-accent-foreground mb-2">
            Helpful Tip
          </h3>

          {/* The PostBody component is wrapped in a `prose` container.
            This is best practice for styling blocks of rich text content,
            ensuring that paragraphs, lists, and links look great automatically.
            The text color is slightly transparent for better readability against the accent background.
          */}
          <div className="prose prose-sm sm:prose-base max-w-none text-accent-foreground/90">
            <PostBody content={tip} />
          </div>
        </div>
      </div>
    </div>
  )
}

// HOW TO USE IT IN YOUR PAGE:
//
// import HelpfulTip from './HelpfulTip';
//
// ...inside your main component's return statement:
//
// <HelpfulTip tip={hotelReview.tip} />
//
