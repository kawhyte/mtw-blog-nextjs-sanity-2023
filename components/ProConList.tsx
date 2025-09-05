import {
  CheckCircle2,
  CircleCheckBig,
  Scale,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from 'lucide-react'
import React from 'react'

import { Spoiler } from '@/components/ui/spoiler'

import PostBody from '../components/PostBody'
import SectionTitle from './SectionTitle'

const boxHeight = 390 // Max height for spoiler content before collapsing

// --- Reusable Internal Component for Pro/Con/Verdict Boxes ---
const InfoBox = ({
  title,
  icon,
  color,
  items,
  content,
}: {
  title: string
  icon: React.ReactElement
  color: 'success' | 'destructive' | 'primary'
  items?: string[]
  content?: any
}) => {
  // Dynamically set theme colors based on the 'color' prop
  const themeClasses = {
    success: {
      border: 'border-success',
      text: 'text-success',
      shadow: 'shadow-success/10',
      iconBg: 'bg-green-600/10',
    },
    destructive: {
      border: 'border-success',
      text: 'text-success',
      shadow: 'shadow-success/10',
      iconBg: 'bg-destructive/10',
    },
    primary: {
      border: 'border-success',
      text: 'text-secondary',
      shadow: 'shadow-secondary/10',
      iconBg: 'bg-secondary/10',
    },
  }
  const theme = themeClasses[color]

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border-2 bg-card p-4 shadow-lg ${theme.border} ${theme.shadow}`}
    >
      {/* Box Header */}
      <div className="flex items-center border-b border-border pb-3 mb-3">
        <div
          className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${theme.iconBg}`}
        >
          {React.cloneElement(icon, { className: `h-5 w-5 ${theme.text}` })}
        </div>
        <h2
          className={`text-lg font-bold uppercase tracking-wider ${theme.text}`}
        >
          {title}
        </h2>
      </div>

      {/* Box Content */}
      <div className="flex-grow text-sm leading-relaxed text-foreground md:text-base">
        <Spoiler
          maxHeight={boxHeight}
          showLabel="Show more"
          hideLabel="Show less"
        >
          {items && (
            <ul className="pt-2 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className={`mr-2 shrink-0 pt-1 ${theme.text}`}>
                    {color === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {content && (
            <div className="prose prose-sm md:prose-base pt-2 max-w-none">
              <PostBody content={content} />
            </div>
          )}
        </Spoiler>
      </div>
    </div>
  )
}

// --- Main Exported Component ---
export default function ProConList({ positives, negatives, verdict2 }) {
  const showPositives = positives && positives.length > 0
  const showNegatives = negatives && negatives.length > 0
  const showVerdict = verdict2 && verdict2.length > 0

  if (!showPositives && !showNegatives && !showVerdict) {
    return null
  }

  return (
    <section className="my-12">
      <SectionTitle header={'The Bottom Line'} />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {showPositives && (
            <InfoBox
              title="What We Loved"
              icon={<ThumbsUp />}
              color="success"
              items={positives}
            />
          )}

          {showNegatives && (
            <InfoBox
              title="What We Didn't Like"
              icon={<ThumbsDown />}
              color="destructive"
              items={negatives}
            />
          )}

          {showVerdict && (
            <InfoBox
              title="The Verdict"
              icon={<Scale />}
              color="primary"
              content={verdict2}
            />
          )}
        </div>
      </div>
    </section>
  )
}
