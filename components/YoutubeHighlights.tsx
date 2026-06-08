import { Badge } from 'components/ui/badge'
import type { Settings } from 'lib/sanity.queries'
import type { YoutubeVideo } from 'lib/youtube'
import { ExternalLink, Play, Tv, Youtube, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Button from 'ui/Button'

import SectionTitle from './SectionTitle'

const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

const FALLBACK_VIDEOS: YoutubeVideo[] = [
  {
    id: 'ylK35CxiGtU',
    title: 'Walking Tour Highlight',
    url: 'https://youtu.be/ylK35CxiGtU',
    thumbnail: 'https://i.ytimg.com/vi/ylK35CxiGtU/hqdefault.jpg',
    publishedAt: '',
    description: '',
  },
  {
    id: '2lOgqf0MDIQ',
    title: 'Trip Highlights',
    url: 'https://www.youtube.com/watch?v=2lOgqf0MDIQ',
    thumbnail: 'https://i.ytimg.com/vi/2lOgqf0MDIQ/hqdefault.jpg',
    publishedAt: '',
    description: '',
  },
  {
    id: 'U1zTABvzInk',
    title: 'Travel Video',
    url: 'https://youtu.be/U1zTABvzInk',
    thumbnail: 'https://i.ytimg.com/vi/U1zTABvzInk/hqdefault.jpg',
    publishedAt: '',
    description: '',
  },
  {
    id: 'WOX5m1Z0DoY',
    title: 'Travel Video',
    url: 'https://youtu.be/WOX5m1Z0DoY',
    thumbnail: 'https://i.ytimg.com/vi/WOX5m1Z0DoY/hqdefault.jpg',
    publishedAt: '',
    description: '',
  },
  {
    id: 'YGXaztMYl3M',
    title: 'Travel Video',
    url: 'https://youtu.be/YGXaztMYl3M',
    thumbnail: 'https://i.ytimg.com/vi/YGXaztMYl3M/hqdefault.jpg',
    publishedAt: '',
    description: '',
  },
  {
    id: 'TietUAnVBoA',
    title: 'Travel Video',
    url: 'https://youtu.be/TietUAnVBoA',
    thumbnail: 'https://i.ytimg.com/vi/TietUAnVBoA/hqdefault.jpg',
    publishedAt: '',
    description: '',
  },
]

function extractYoutubeId(url: string): string {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&?\s]+)/,
  )
  return m ? m[1] : ''
}

function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

interface DisplayVideo {
  id: string
  title: string
  url: string
  thumbnail: string
  publishedAt: string
  isFeatured?: boolean
  category?: string
}

interface YoutubeHighlightsProps {
  videos?: YoutubeVideo[]
  featuredVideo?: Settings['featuredVideo']
  shorts?: YoutubeVideo[]
}

export default function YoutubeHighlights({
  videos = [],
  featuredVideo,
  shorts = [],
}: YoutubeHighlightsProps) {
  const allVideos = videos.length > 0 ? videos : FALLBACK_VIDEOS

  let displayVideos: DisplayVideo[]

  if (featuredVideo?.url) {
    const pinnedId = extractYoutubeId(featuredVideo.url)
    const pinned: DisplayVideo = {
      id: pinnedId || 'pinned',
      title: featuredVideo.title ?? '',
      url: featuredVideo.url,
      thumbnail: pinnedId
        ? `https://i.ytimg.com/vi/${pinnedId}/hqdefault.jpg`
        : '',
      publishedAt: '',
      isFeatured: true,
      category: featuredVideo.category,
    }
    // Dedupe: remove from RSS list if the same video is pinned
    const rest = allVideos
      .filter((v) => v.id !== pinnedId && v.url !== featuredVideo.url)
      .slice(0, 5)
    displayVideos = [pinned, ...rest]
  } else {
    displayVideos = allVideos.slice(0, 6).map((v) => ({ ...v }))
  }

  return (
    <div className="px-6">
      <div className="mb-8">
        <SectionTitle
          header="Featured Videos"
          description="Walking tours, arena visits, and travel highlights from our YouTube channel."
        />
      </div>

      {shorts.length > 0 && <ShortsCarousel shorts={shorts.slice(0, 6)} />}

      {/* Long-form videos label + grid */}
      <div
        className={
          shorts.length > 0 ? 'mt-10 pt-8 border-t border-gray-200' : ''
        }
      >
        <div className="mb-4 flex items-center gap-2 px-1">
          <Tv size={14} className="text-pink-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
            Featured Videos
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          variant="primary"
          link="https://www.youtube.com/@mtwtravel"
          newTab
          icon={<Youtube size={16} className="text-white" />}
        >
          <span className="flex items-center gap-2">
            Watch More on YouTube
            <ExternalLink size={12} />
          </span>
        </Button>
      </div>
    </div>
  )
}

function ShortsCarousel({ shorts }: { shorts: YoutubeVideo[] }) {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-2 px-1">
        <Zap size={14} className="text-pink-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
          Latest Shorts
        </h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-track]:bg-transparent">
        {shorts.map((short) => (
          <ShortCard key={short.id} video={short} />
        ))}
        {/* Spacer so the last card isn't clipped by the container edge */}
        <div className="w-6 shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}

function ShortCard({ video }: { video: YoutubeVideo }) {
  const [playing, setPlaying] = React.useState(false)
  const date = formatDate(video.publishedAt)

  return (
    <div className="group shrink-0 w-36 sm:w-40 overflow-hidden rounded-xl border-2 border-black shadow-brutalist-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
      {playing ? (
        <div
          className="relative w-full bg-black"
          style={{ aspectRatio: '9/16' }}
        >
          <ReactPlayer
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          style={{ aspectRatio: '9/16' }}
          aria-label={`Play short: ${video.title}`}
        >
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title || 'YouTube Short'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="160px"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900" />
          )}

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-md transition-transform duration-200 group-hover:scale-110">
              <Play size={14} className="translate-x-px text-pink-500" />
            </div>
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/85 via-black/50 to-transparent px-2 pb-2 pt-8">
            {video.title && (
              <p className="line-clamp-2 text-xs font-bold leading-snug text-white drop-shadow">
                {video.title}
              </p>
            )}
            {date && <p className="mt-0.5 text-[10px] text-white/70">{date}</p>}
          </div>
        </button>
      )}
    </div>
  )
}

function VideoCard({ video }: { video: DisplayVideo }) {
  const [playing, setPlaying] = React.useState(false)
  const date = formatDate(video.publishedAt)

  return (
    <div className="group overflow-hidden rounded-xl border-2 border-black shadow-brutalist-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
      {playing ? (
        <div className="relative w-full aspect-video bg-black">
          <ReactPlayer
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative block w-full aspect-video overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          aria-label={`Play ${video.title}`}
        >
          {/* Thumbnail */}
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title || 'YouTube video'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900" />
          )}

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-md transition-transform duration-200 group-hover:scale-110">
              <Play size={18} className="translate-x-px text-pink-500" />
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-10">
            {(video.isFeatured || video.category) && (
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                {video.isFeatured && (
                  <Badge className="border-transparent bg-pink-500/90 text-xs text-white backdrop-blur-sm">
                    <Play size={9} className="mr-1" />
                    Featured
                  </Badge>
                )}
                {video.category && (
                  <Badge
                    variant="outline"
                    className="border-white/40 bg-white/15 text-xs text-white backdrop-blur-sm"
                  >
                    {video.category}
                  </Badge>
                )}
              </div>
            )}
            {video.title && (
              <p className="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow">
                {video.title}
              </p>
            )}
            {date && <p className="mt-0.5 text-xs text-white/70">{date}</p>}
          </div>
        </button>
      )}
    </div>
  )
}
