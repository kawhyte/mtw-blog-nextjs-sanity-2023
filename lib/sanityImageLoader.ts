// next/image custom loader (wired up via `images.loaderFile` in next.config.mjs).
//
// Lets next/image build a responsive srcset straight from Sanity's CDN, so each
// device downloads the width its `sizes` prop calls for, without using
// Vercel's paid image optimization.
//
// The w/h already on a Sanity URL (set by urlForImage().width().height()) are
// treated as the MAXIMUM size for that slot. Each srcset candidate keeps the
// same aspect ratio and is also capped at the original upload's resolution,
// because Sanity will happily upscale (bigger file, zero extra detail).

type LoaderProps = { src: string; width: number; quality?: number }

const CROP_FITS = new Set(['crop', 'fill', 'min'])

export default function sanityImageLoader({
  src,
  width,
  quality,
}: LoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io/')) return src

  const url = new URL(src)
  const params = url.searchParams

  const reqW = Number(params.get('w')) || undefined
  const reqH = Number(params.get('h')) || undefined
  const fit = params.get('fit') ?? ''

  // Source dimensions: the manual crop rect if present, else the filename (…-2400x1600.jpg)
  let srcW: number | undefined
  let srcH: number | undefined
  const rect = params.get('rect')?.split(',').map(Number)
  if (rect?.length === 4) {
    srcW = rect[2]
    srcH = rect[3]
  } else {
    const match = url.pathname.match(/-(\d+)x(\d+)\.\w+$/)
    if (match) {
      srcW = Number(match[1])
      srcH = Number(match[2])
    }
  }

  let maxW = reqW ?? Infinity
  if (srcW && srcH) {
    if (reqW && reqH && CROP_FITS.has(fit)) {
      // Cropped to reqW:reqH, widest crop the source supports without upscaling
      maxW = Math.min(maxW, srcW, srcH * (reqW / reqH))
    } else if (reqW && reqH) {
      // Bounding-box fit (max/clip), Sanity never upscales these
      maxW = Math.min(maxW, srcW, reqH * (srcW / srcH))
    } else {
      maxW = Math.min(maxW, srcW)
    }
  }

  const w = Math.max(1, Math.round(Math.min(width, maxW)))
  // Delete + append (rather than set) so the output never string-equals `src`,
  // which next/image's dev check reads as "loader ignores width".
  params.delete('w')
  params.delete('h')
  params.append('w', String(w))
  if (reqW && reqH) params.append('h', String(Math.round((w * reqH) / reqW)))
  if (!params.has('q')) params.set('q', String(quality ?? 75))
  if (!params.has('auto')) params.set('auto', 'format')

  // Keep rect=x,y,w,h commas readable (URLSearchParams encodes them as %2C)
  return url.toString().replace(/%2C/g, ',')
}
