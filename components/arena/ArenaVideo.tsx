import SanityImage from 'components/SanityImage'
import { Instagram, Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthewhytes.com'

const youtubeId = (url: string) =>
  url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^&?\s/]+)/,
  )?.[1] ?? null

const playBadge = (
  <span className="absolute left-1/2 top-1/2 flex h-15 w-15 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-110">
    <Play
      className="h-6 w-6 translate-x-0.5 fill-primary text-primary"
      aria-hidden="true"
    />
  </span>
)

const frame =
  'group relative block aspect-video w-full overflow-hidden rounded-2xl border-[3px] border-border-bold bg-black'

/**
 * "Watch our visit": a photo card instead of a heavy embed. YouTube plays in
 * place after a tap; Instagram opens in a new tab (its embed script often
 * rendered as a big empty box).
 */
export default function ArenaVideo({
  url,
  poster,
  arenaName,
  description,
  date,
}: {
  url: string
  /** Shown behind the play button for Instagram videos */
  poster?: any
  arenaName: string
  description: string
  date?: string
}) {
  const [playing, setPlaying] = useState(false)
  const id = youtubeId(url)
  const isInstagram = url.includes('instagram.com')
  if (!id && !isInstagram) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title font-extrabold tracking-tight sm:text-title">
        Watch our visit
      </h2>

      {id ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'VideoObject',
                name: `Our visit to ${arenaName}`,
                description,
                thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                uploadDate: date || new Date().toISOString(),
                contentUrl: url,
                embedUrl: `https://www.youtube.com/embed/${id}`,
                publisher: {
                  '@type': 'Organization',
                  name: 'Meet the Whytes',
                  url: SITE_URL,
                },
              }),
            }}
          />
          {playing ? (
            <div className={frame}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                title={`Our visit to ${arenaName}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play our video from ${arenaName}`}
              className={`${frame} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary`}
            >
              <Image
                src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 1280px) 860px, 100vw"
                className="object-cover"
              />
              {playBadge}
            </button>
          )}
        </>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={frame}
        >
          {poster?.asset && (
            <SanityImage
              image={poster}
              width={1200}
              height={675}
              alt=""
              sizes="(min-width: 1280px) 860px, 100vw"
              className="h-full w-full object-cover brightness-75"
            />
          )}
          {playBadge}
          <span className="absolute bottom-3.5 left-4 inline-flex items-center gap-2 text-base font-extrabold text-white drop-shadow">
            <Instagram className="h-5 w-5" aria-hidden="true" />
            Watch on Instagram ↗
          </span>
        </a>
      )}
    </section>
  )
}
