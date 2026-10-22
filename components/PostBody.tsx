import {
  PortableText,
  PortableTextBlockComponent,
  PortableTextMarkComponent,
} from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { blockText, headingId } from 'lib/headings'
import { urlForImage } from 'lib/sanity.image'
import { AlertTriangle, Info, Lightbulb, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { memo, useState } from 'react'

import {
  groupPhotos,
  PhotoCards,
  PhotoRow,
  TALL_PHOTO_RATIO,
  TallPhoto,
} from './PhotoLayouts'
import {
  photoKey,
  PhotoViewerProvider,
  type ViewerPhoto,
  ZoomablePhoto,
} from './PhotoViewer'
import styles from './PostBody.module.css'

const SampleImageComponent = ({ value }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  if (!value?.asset) return null
  const { width, height } = getImageDimensions(value)
  const lqip = value.asset?.metadata?.lqip
  const targetWidth = Math.min(width, 1600)
  const targetHeight = Math.round(targetWidth * (height / width))

  return (
    <figure className="image-container">
      <ZoomablePhoto image={value} className="w-full">
        <Image
          src={urlForImage(value)
            .width(targetWidth)
            .height(targetHeight)
            .quality(75)
            .url()}
          alt={value.alt || value.caption || ' '}
          width={width}
          height={height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 800px"
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
          onLoad={() => setIsLoaded(true)}
          className={`single-image transition-all duration-700 ease-in-out ${isLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'}`}
          style={{ aspectRatio: width / height }}
        />
      </ZoomablePhoto>
      {value.caption && (
        <figcaption className="image-caption">{value.caption}</figcaption>
      )}
    </figure>
  )
}

// In-article callouts use the same card as the review "Insider tip"
const CALLOUT_CONFIG = {
  tip: {
    icon: Lightbulb,
    label: 'INSIDER TIP',
    labelClass: 'text-primary',
    iconClass: 'border-primary/30 bg-primary-soft-background text-primary',
  },
  warning: {
    icon: AlertTriangle,
    label: 'HEADS UP',
    labelClass: 'text-amber-900 dark:text-amber-400',
    iconClass:
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  info: {
    icon: Info,
    label: 'GOOD TO KNOW',
    labelClass: 'text-secondary',
    iconClass:
      'border-secondary/30 bg-secondary-soft-background text-secondary',
  },
  highlight: {
    icon: Sparkles,
    label: 'DON’T MISS',
    labelClass: 'text-primary',
    iconClass: 'border-primary/30 bg-primary-soft-background text-primary',
  },
}

/** Every photo in the article, in reading order, for the click-to-enlarge viewer */
function viewerPhotos(blocks: any[]): ViewerPhoto[] {
  const photo = (image: any, caption?: string): ViewerPhoto => ({
    key: photoKey(image),
    image,
    caption: caption || image?.caption,
  })
  return blocks
    .flatMap((block) => {
      if (block?._type === 'image' && block.asset) return [photo(block)]
      if (block?._type === 'autoPhotoRow') return block.images.map(photo)
      if (block?._type === 'autoPhotoCards')
        return block.items.map(({ line, image }) =>
          photo(image, blockText(line)),
        )
      if (block?._type === 'imageGroup')
        return (block.images ?? []).filter((image) => image?.asset).map(photo)
      return []
    })
    .filter((p) => p.key)
}

const COL_MAP: Record<string, string> = {
  '2-col': 'grid-cols-1 sm:grid-cols-2',
  '3-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4-col': 'grid-cols-2 md:grid-cols-4',
}

function PostBody({
  content,
  flush = false,
}: {
  content: any
  /** Line text up with the column edges (guide pages) instead of insetting it */
  flush?: boolean
}) {
  const portableTextComponents = {
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null
        const { width, height } = getImageDimensions(value)
        // Tall phone screenshots get a height cap instead of filling the screen
        return height / width >= TALL_PHOTO_RATIO ? (
          <TallPhoto image={value} caption={value.caption} />
        ) : (
          <SampleImageComponent value={value} />
        )
      },

      // Built by groupPhotos(): photos back to back, and "line + photo" pairs
      autoPhotoRow: ({ value }) => <PhotoRow images={value.images} />,
      autoPhotoCards: ({ value }) => (
        <PhotoCards items={value.items} marks={portableTextComponents.marks} />
      ),

      imageGroup: ({ value }) => {
        const cols = COL_MAP[value.layout] || 'grid-cols-1 sm:grid-cols-2'
        return (
          <div className={`grid ${cols} gap-3 my-6 not-prose`}>
            {(value.images || []).map((img, idx) => (
              <SampleImageComponent key={idx} value={img} />
            ))}
          </div>
        )
      },

      videoEmbed: ({ value }) => {
        if (!value?.url) return null
        return (
          <figure className="my-8 not-prose">
            <div className="relative mx-auto w-full overflow-hidden rounded-xl shadow-lg aspect-video">
              <iframe
                src={value.url
                  .replace('watch?v=', 'embed/')
                  .replace('youtu.be/', 'www.youtube.com/embed/')}
                title={value.title || 'Embedded video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {value.caption && (
              <figcaption className="text-xs text-muted-foreground text-center mt-2">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },

      mediaWithText: ({ value }) => {
        const isRight = value.imagePosition === 'right'
        return (
          <div
            className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 my-8 items-start not-prose`}
          >
            {value.image && (
              <div className="w-full md:w-1/2 shrink-0">
                <SampleImageComponent value={value.image} />
              </div>
            )}
            {value.text && (
              <div className={`w-full md:w-1/2 ${styles.portableText}`}>
                <PortableText
                  value={value.text}
                  components={inlineComponents}
                />
              </div>
            )}
          </div>
        )
      },

      callout: ({ value }) => {
        const config =
          CALLOUT_CONFIG[value.type as keyof typeof CALLOUT_CONFIG] ||
          CALLOUT_CONFIG.tip
        const Icon = config.icon
        return (
          <aside className="not-prose my-8 flex items-start gap-4 rounded-3xl border-[3px] border-border-bold bg-card p-5 sm:gap-5 sm:px-7 sm:py-6">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${config.iconClass}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col gap-2 pt-0.5">
              <span
                className={`text-xs font-bold tracking-[0.14em] ${config.labelClass}`}
              >
                {config.label}
              </span>
              <div className={`${styles.portableText} ${styles.calloutBody}`}>
                {value.text && (
                  <PortableText
                    value={value.text}
                    components={inlineComponents}
                  />
                )}
              </div>
            </div>
          </aside>
        )
      },
    },

    // Section headings get an id (for "On this page" links); empty
    // heading blocks left in the editor are skipped
    block: {
      h2: (({ value, children }) => {
        const text = blockText(value)
        return text ? (
          <h2 id={headingId(text)} className="scroll-mt-28">
            {children}
          </h2>
        ) : null
      }) as PortableTextBlockComponent,
      h3: (({ value, children }) => {
        const text = blockText(value)
        return text ? (
          <h3 id={headingId(text)} className="scroll-mt-28">
            {children}
          </h3>
        ) : null
      }) as PortableTextBlockComponent,
    },

    marks: {
      link: (({ children, value }) => (
        <a
          href={value?.href}
          className="text-primary underline decoration-primary decoration-2 underline-offset-2 hover:opacity-75 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )) as PortableTextMarkComponent,
      strong: (({ children }) => (
        <strong className="font-bold text-foreground">{children}</strong>
      )) as PortableTextMarkComponent,
      em: (({ children }) => (
        <em className="italic">{children}</em>
      )) as PortableTextMarkComponent,
      underline: (({ children }) => (
        <span className="underline underline-offset-2">{children}</span>
      )) as PortableTextMarkComponent,
    },
  }

  const blocks = groupPhotos(content || [])

  // Shared components for nested PortableText (callout/mediaWithText)
  const inlineComponents = {
    marks: portableTextComponents.marks,
  }

  return (
    <div
      className={`max-w-7xl leading-loose text-sm md:text-base font-thin ${styles.portableText} ${flush ? styles.flush : ''}`}
    >
      <PhotoViewerProvider photos={viewerPhotos(blocks)}>
        <PortableText value={blocks} components={portableTextComponents} />
      </PhotoViewerProvider>
    </div>
  )
}

// Memoised: pages re-render as you scroll (e.g. the guide's "On this page"
// highlight), and the article and its photos shouldn't rebuild each time
export default memo(PostBody)
