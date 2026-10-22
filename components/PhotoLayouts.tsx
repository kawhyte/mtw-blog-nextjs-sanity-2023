import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { blockText } from 'lib/headings'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { ZoomablePhoto } from './PhotoViewer'

/*
 * Automatic photo layouts for article bodies (guides, review write-ups):
 * - 2+ photos back to back → one justified row (same height, nothing cropped)
 * - 2+ "list line, then its photo" pairs → a row of photo cards
 * A Sanity "Image Grid" block is left alone, so it always wins.
 */

const isEmptyText = (block: any) =>
  block?._type === 'block' && !block.listItem && !blockText(block)
const isImage = (block: any) => block?._type === 'image' && block.asset
const isListLine = (block: any) =>
  block?._type === 'block' && block.listItem && blockText(block)

/** Next index at or after `from` that isn't an empty paragraph */
const skipEmpty = (content: any[], from: number) => {
  let i = from
  while (i < content.length && isEmptyText(content[i])) i++
  return i
}

/** Replaces runs of photos (and line + photo pairs) with layout blocks */
export function groupPhotos(content: any[] = []): any[] {
  const out: any[] = []
  let i = 0
  while (i < content.length) {
    const block = content[i]

    // "Day 1 | …" line followed by its screenshot, repeated
    if (isListLine(block)) {
      const items: { line: any; image: any }[] = []
      let j = i
      while (isListLine(content[j])) {
        const imageAt = skipEmpty(content, j + 1)
        if (!isImage(content[imageAt])) break
        items.push({ line: content[j], image: content[imageAt] })
        j = skipEmpty(content, imageAt + 1)
      }
      if (items.length >= 2) {
        out.push({
          _type: 'autoPhotoCards',
          _key: `cards-${block._key}`,
          items,
        })
        i = j
        continue
      }
    }

    // Photos back to back (empty paragraphs between them don't count)
    if (isImage(block)) {
      const images = [block]
      let j = skipEmpty(content, i + 1)
      while (isImage(content[j])) {
        images.push(content[j])
        j = skipEmpty(content, j + 1)
      }
      if (images.length >= 2) {
        out.push({ _type: 'autoPhotoRow', _key: `row-${block._key}`, images })
        i = j
        continue
      }
    }

    out.push(block)
    i++
  }
  return out
}

const ratioOf = (image: any) => {
  const { width, height } = getImageDimensions(image)
  return width / height
}

const imageUrl = (image: any, width: number) =>
  urlForImage(image).width(width).quality(75).url()

/** Rows of `size`, e.g. 5 photos in rows of 3 → [3, 2] */
const chunk = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  )

function JustifiedRow({ images }: { images: any[] }) {
  return (
    <div className="flex gap-2">
      {images.map((image) => {
        const ratio = ratioOf(image)
        return (
          <figure
            key={image._key}
            className="m-0 flex min-w-0 flex-col gap-1.5"
            style={{ flex: `${ratio} 1 0%` }}
          >
            <ZoomablePhoto image={image} className="w-full">
              <Image
                src={imageUrl(image, 1000)}
                alt={image.alt || image.caption || ' '}
                width={1000}
                height={Math.round(1000 / ratio)}
                sizes={`(min-width: 1280px) ${Math.round(760 / images.length)}px, ${Math.round(100 / images.length)}vw`}
                className="block rounded-2xl object-cover"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: ratio,
                  padding: 0,
                }}
              />
            </ZoomablePhoto>
            {image.caption && (
              <figcaption className="text-center text-xs text-muted-foreground sm:text-sm">
                {image.caption}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}

/** Photos back to back, max 2 per row: pairs, with a big lead photo when the count is odd */
export function PhotoRow({ images }: { images: any[] }) {
  const rows =
    images.length % 2 === 1
      ? [[images[0]], ...chunk(images.slice(1), 2)]
      : chunk(images, 2)

  return (
    <div className="not-prose my-8 flex flex-col gap-2">
      {rows.map((row, i) => (
        <JustifiedRow key={i} images={row} />
      ))}
    </div>
  )
}

/** The list line as plain inline text (keeps bold/links via `marks`) */
function LineText({
  line,
  marks,
}: {
  line: any
  marks: PortableTextComponents['marks']
}) {
  return (
    <PortableText
      value={{
        ...line,
        listItem: undefined,
        level: undefined,
        style: 'normal',
      }}
      components={{
        block: { normal: ({ children }) => <>{children}</> },
        marks,
      }}
    />
  )
}

/** "Line, then its photo" pairs: photo cards, 2 per row on every screen */
export function PhotoCards({
  items,
  marks,
}: {
  items: { line: any; image: any }[]
  marks: PortableTextComponents['marks']
}) {
  return (
    <div className="not-prose my-8 grid grid-cols-2 gap-3 md:gap-4">
      {items.map(({ line, image }) => (
        <figure
          key={image._key}
          className="m-0 flex min-w-0 flex-col overflow-hidden rounded-2xl border-[3px] border-border-bold bg-card"
        >
          <ZoomablePhoto image={image} className="block w-full">
            <div className="h-40 bg-muted p-2.5 sm:h-48 md:h-56 md:p-3">
              <Image
                src={imageUrl(image, 700)}
                alt={image.alt || image.caption || blockText(line)}
                width={700}
                height={Math.round(700 / ratioOf(image))}
                sizes="(min-width: 1280px) 380px, 45vw"
                className="rounded-lg"
                // Fill the box and letterbox the screenshot, never crop it
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: 0,
                }}
              />
            </div>
          </ZoomablePhoto>
          <figcaption
            className="p-3 text-sm leading-snug text-foreground/80 md:p-4 md:text-sm md:leading-relaxed"
            style={{ textAlign: 'left' }}
          >
            <LineText line={line} marks={marks} />
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** Tall single photo (phone screenshots): capped height on a soft card */
export function TallPhoto({
  image,
  caption,
}: {
  image: any
  caption?: ReactNode
}) {
  const ratio = ratioOf(image)
  return (
    <figure className="not-prose my-8 flex flex-col gap-2">
      <div className="flex justify-center rounded-2xl bg-muted p-3 sm:p-4">
        <ZoomablePhoto image={image}>
          <Image
            src={imageUrl(image, 900)}
            alt={image.alt || image.caption || ' '}
            width={900}
            height={Math.round(900 / ratio)}
            sizes="(min-width: 768px) 360px, 70vw"
            placeholder={image.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={image.asset?.metadata?.lqip}
            className="block rounded-xl"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: 'min(520px, 55vh)',
              padding: 0,
            }}
          />
        </ZoomablePhoto>
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** Portrait photos taller than this (height / width) get the height cap */
export const TALL_PHOTO_RATIO = 1.3
