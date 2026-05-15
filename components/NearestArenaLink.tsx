import { urlForImage } from 'lib/sanity.image'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'

import SectionTitle from './SectionTitle'

interface NearestArenaLinkProps {
  arena?: {
    name?: string
    slug?: string
    location?: string
    arenaImage?: any
  }
}

export default function NearestArenaLink({ arena }: NearestArenaLinkProps) {
  if (!arena?.slug || !arena?.name) return null

  const hasImage = arena.arenaImage?.asset?._ref || arena.arenaImage?.asset?._id

  return (
    <section className="py-8 md:py-12">
      <SectionTitle header="NBA Arena Nearby" />
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-2xl border-2 border-border shadow-brutalist-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              {hasImage && (
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={urlForImage(arena.arenaImage)
                      .width(224)
                      .height(160)
                      .fit('crop')
                      .url()}
                    alt={`${arena.name} arena`}
                    fill
                    className="object-cover"
                    sizes="112px"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  NBA Arena Nearby
                </p>
                <h3 className="text-lg font-bold text-foreground leading-tight mb-2">
                  {arena.name}
                </h3>

                {arena.location && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {arena.location}
                  </span>
                )}

                <Link
                  href={`/arena/${arena.slug}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Read our arena review &rarr;
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
