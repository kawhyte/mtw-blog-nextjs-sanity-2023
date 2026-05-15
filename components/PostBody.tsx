import { PortableText, PortableTextMarkComponent } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { urlForImage } from 'lib/sanity.image'
import { AlertTriangle, Info, Lightbulb, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import styles from './PostBody.module.css'

const SampleImageComponent = ({ value }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  if (!value?.asset) return null
  const { width, height } = getImageDimensions(value)
  const lqip = value.asset?.metadata?.lqip

  return (
    <figure className="image-container">
      <Image
        src={urlForImage(value).height(height).width(width).url()}
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
      {value.caption && (
        <figcaption className="image-caption">{value.caption}</figcaption>
      )}
    </figure>
  )
}

const CALLOUT_CONFIG = {
  tip: {
    border: 'border-secondary',
    bg: 'bg-secondary/10',
    icon: Lightbulb,
    label: 'Tip',
  },
  warning: {
    border: 'border-warning',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
    label: 'Warning',
  },
  info: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    icon: Info,
    label: 'Info',
  },
  highlight: {
    border: 'border-primary',
    bg: 'bg-primary/10',
    icon: Sparkles,
    label: 'Highlight',
  },
}

const COL_MAP: Record<string, string> = {
  '2-col': 'grid-cols-1 sm:grid-cols-2',
  '3-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4-col': 'grid-cols-2 md:grid-cols-4',
}

export default function PostBody({ content }) {
  const portableTextComponents = {
    types: {
      image: SampleImageComponent,

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
          <div
            className={`my-6 border-l-4 ${config.border} ${config.bg} rounded-r-xl p-4 flex gap-3 not-prose`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
            <div className={`${styles.portableText} ${styles.calloutBody}`}>
              {value.text && (
                <PortableText
                  value={value.text}
                  components={inlineComponents}
                />
              )}
            </div>
          </div>
        )
      },
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

  // Shared components for nested PortableText (callout/mediaWithText)
  const inlineComponents = {
    marks: portableTextComponents.marks,
  }

  return (
    <div
      className={`max-w-7xl leading-loose text-sm md:text-base font-thin ${styles.portableText}`}
    >
      <PortableText value={content || []} components={portableTextComponents} />
    </div>
  )
}
