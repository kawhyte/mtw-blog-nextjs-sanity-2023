export interface YoutubeVideo {
  id: string
  title: string
  url: string
  thumbnail: string
  publishedAt: string
  description: string
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  if (!match) return ''
  return (match[1] ?? match[2] ?? '').trim()
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`))
  return match ? match[1] : ''
}

function parseEntries(xml: string): string[] {
  const entries: string[] = []
  let start = 0
  while (true) {
    const open = xml.indexOf('<entry>', start)
    if (open === -1) break
    const close = xml.indexOf('</entry>', open)
    if (close === -1) break
    entries.push(xml.slice(open, close + 8))
    start = close + 8
  }
  return entries
}

export async function fetchChannelShorts(
  channelId: string,
  limit = 6,
): Promise<YoutubeVideo[]> {
  if (!channelId) return []

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []

    const xml = await res.text()
    const entries = parseEntries(xml)

    return entries
      .map((entry) => {
        const id = extractTag(entry, 'yt:videoId')
        const title = extractTag(entry, 'title')
        const publishedAt = extractTag(entry, 'published')
        const description = extractAttr(entry, 'media:thumbnail', 'url')
          ? extractTag(entry, 'media:description')
          : ''
        return { id, title, url: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, publishedAt, description }
      })
      .filter((v) => {
        if (!v.id) return false
        const text = `${v.title} ${v.description}`.toLowerCase()
        return text.includes('#shorts')
      })
      .slice(0, limit)
  } catch {
    return []
  }
}

export async function fetchPlaylistVideos(playlistId: string): Promise<YoutubeVideo[]> {
  if (!playlistId) return []

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []

    const xml = await res.text()
    const entries = parseEntries(xml)

    return entries.slice(0, 6).map((entry) => {
      const id = extractTag(entry, 'yt:videoId')
      const title = extractTag(entry, 'title')
      const publishedAt = extractTag(entry, 'published')
      const description = extractAttr(entry, 'media:thumbnail', 'url')
        ? extractTag(entry, 'media:description')
        : ''

      return {
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt,
        description,
      }
    }).filter((v) => v.id)
  } catch {
    return []
  }
}
