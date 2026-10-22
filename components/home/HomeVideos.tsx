import SwipeRow from 'components/listing/SwipeRow'
import type { Settings } from 'lib/sanity.queries'
import type { YoutubeVideo } from 'lib/youtube'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const CHANNEL_URL = 'https://www.youtube.com/@mtwtravel'

// Shown when the YouTube feed can't be reached at build time
const FALLBACK_VIDEOS: Pick<YoutubeVideo, 'id' | 'title'>[] = [
  { id: 'ylK35CxiGtU', title: 'Walking Tour Highlight' },
  { id: '2lOgqf0MDIQ', title: 'Trip Highlights' },
  { id: 'U1zTABvzInk', title: 'Travel Video' },
]

const youtubeId = (url: string) =>
  url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&?\s]+)/,
  )?.[1] ?? ''

/** Thumbnail first; the YouTube player only loads after a tap on play */
function VideoCard({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col gap-2 sm:max-w-none sm:w-[340px] md:w-[calc((100%-2.5rem)/3)]">
      <div className="relative aspect-video overflow-hidden rounded-[18px] border-[3px] border-border-bold bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              unoptimized
              sizes="400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute left-1/2 top-1/2 flex h-13 w-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-110">
              <Play
                className="h-5 w-5 translate-x-px fill-primary text-primary"
                aria-hidden="true"
              />
            </span>
          </button>
        )}
      </div>
      <span className="line-clamp-2 text-[15px] font-bold">{title}</span>
    </div>
  )
}

/** 3 videos: the pinned one from Settings first, then the newest from the playlist */
export default function HomeVideos({
  videos,
  featuredVideo,
}: {
  videos: YoutubeVideo[]
  featuredVideo?: Settings['featuredVideo']
}) {
  const list: Pick<YoutubeVideo, 'id' | 'title'>[] =
    videos.length > 0 ? videos : FALLBACK_VIDEOS
  const pinnedId = featuredVideo?.url ? youtubeId(featuredVideo.url) : ''
  const shown = (
    pinnedId
      ? [
          { id: pinnedId, title: featuredVideo?.title ?? '' },
          ...list.filter((video) => video.id !== pinnedId),
        ]
      : list
  ).slice(0, 3)

  return (
    <SwipeRow
      title="Watch us on YouTube"
      subtitle="Walking tours, arena visits and trip highlights."
      linkLabel="Our channel"
      shortLinkLabel="Channel"
      linkHref={CHANNEL_URL}
      linkExternal
    >
      {shown.map((video) => (
        <VideoCard key={video.id} id={video.id} title={video.title} />
      ))}
    </SwipeRow>
  )
}
