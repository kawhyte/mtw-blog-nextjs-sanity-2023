import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { blockText } from 'lib/headings'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import type { ReactNode } from 'react'

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

/** Photos back to back: 2 = pair, 3 = row of three (phone: one big + a pair), 4 = two pairs */
export function PhotoRow({ images }: { images: any[] }) {
  const desktopRows = chunk(images, images.length === 4 ? 2 : 3)
  // Phones: pairs, with a big lead photo when the count is odd
  const phoneRows =
    images.length % 2 === 1
      ? [[images[0]], ...chunk(images.slice(1), 2)]
      : chunk(images, 2)

  return (
    <div className="not-prose my-8">
      <div className="hidden flex-col gap-2 md:flex">
        {desktopRows.map((row, i) => (
          <JustifiedRow key={i} images={row} />
        ))}
      </div>
      <div className="flex flex-col gap-2 md:hidden">
        {phoneRows.map((row, i) => (
          <JustifiedRow key={i} images={row} />
        ))}
      </div>
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

/** "Line, then its photo" pairs: cards in a row (desktop), compact rows (phone) */
export function PhotoCards({
  items,
  marks,
}: {
  items: { line: any; image: any }[]
  marks: PortableTextComponents['marks']
}) {
  const columns = Math.min(items.length, 3)
  return (
    <div className="not-prose my-8">
      <div
        className="hidden gap-4 md:grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map(({ line, image }) => (
          <figure
            key={image._key}
            className="m-0 flex flex-col overflow-hidden rounded-[20px] border-[3px] border-border-bold bg-card"
          >
            <div className="flex h-56 items-center justify-center bg-muted p-3">
              <Image
                src={imageUrl(image, 700)}
                alt={image.alt || image.caption || blockText(line)}
                width={700}
                height={Math.round(700 / ratioOf(image))}
                sizes="(min-width: 1280px) 250px, 30vw"
                className="rounded-lg object-contain"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  padding: 0,
                }}
              />
            </div>
            <figcaption className="p-4 text-left text-sm leading-relaxed text-foreground/80">
              <LineText line={line} marks={marks} />
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex flex-col gap-2.5 md:hidden">
        {items.map(({ line, image }) => (
          <figure
            key={image._key}
            className="m-0 flex items-center gap-3 rounded-2xl border-2 border-border-bold bg-card p-2.5"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
              <Image
                src={imageUrl(image, 240)}
                alt={image.alt || image.caption || blockText(line)}
                width={240}
                height={Math.round(240 / ratioOf(image))}
                sizes="80px"
                className="object-contain"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  padding: 0,
                }}
              />
            </div>
            <figcaption className="text-left text-[13px] leading-snug text-foreground/80">
              <LineText line={line} marks={marks} />
            </figcaption>
          </figure>
        ))}
      </div>
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
